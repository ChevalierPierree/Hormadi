import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

import {
  jsonResponse,
  errorResponse,
  validateRequired,
  validateEmail,
  sanitizeString,
  generateReference,
} from '@/lib/api-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { amount, bidderName, bidderEmail, bidderPhone } = body

    const validationError = validateRequired(
      { amount, bidderName, bidderEmail, bidderPhone },
      ['amount', 'bidderName', 'bidderEmail', 'bidderPhone']
    )
    if (validationError) return errorResponse(validationError, 400)

    if (!validateEmail(bidderEmail)) {
      return errorResponse('Adresse email invalide', 400)
    }

    const amountCents = Math.round(Number(amount))
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return errorResponse('Montant invalide', 400)
    }

    // Re-check item state and highest bid inside a transaction to avoid a race
    // between two people bidding at the same time.
    type TxResult =
      | { error: string; status: number }
      | { error?: undefined; bid: { reference: string }; currentPrice: number }

    const result: TxResult = await prisma.$transaction(async (tx) => {
      const item = await tx.auctionItem.findUnique({
        where: { id: params.id },
        include: { bids: { orderBy: { amount: 'desc' }, take: 1 } },
      })

      if (!item || !item.visible) {
        return { error: 'Objet non trouvé', status: 404 }
      }
      if (item.endDate.getTime() < Date.now()) {
        return { error: 'Cette enchère est terminée', status: 400 }
      }

      const currentPrice = item.bids[0]?.amount ?? item.startPrice
      const minAcceptable = item.bids[0] ? currentPrice + item.minIncrement : item.startPrice

      if (amountCents < minAcceptable) {
        return {
          error: `Votre mise doit être d'au moins ${(minAcceptable / 100).toFixed(2)} €`,
          status: 400,
        }
      }

      const reference = generateReference('ENCH')

      const bid = await tx.auctionBid.create({
        data: {
          auctionItemId: item.id,
          amount: amountCents,
          bidderName: sanitizeString(bidderName),
          bidderEmail: sanitizeString(bidderEmail),
          bidderPhone: sanitizeString(bidderPhone),
          reference,
        },
      })

      return { bid, currentPrice: amountCents }
    })

    if (result.error !== undefined) {
      return errorResponse(result.error, result.status)
    }

    return jsonResponse(
      { reference: result.bid.reference, currentPrice: result.currentPrice },
      201
    )
  } catch (error) {
    console.error('Create bid error:', error)
    return errorResponse('Internal server error', 500)
  }
}
