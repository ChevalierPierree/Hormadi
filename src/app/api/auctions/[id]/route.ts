import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  sanitizeString,
  logAdminAction,
} from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const isAdmin = url.searchParams.get('admin') === 'true'

    const item = await prisma.auctionItem.findUnique({
      where: { id: params.id },
      include: { bids: { orderBy: { amount: 'desc' } } },
    })

    if (!item || (!item.visible && !isAdmin)) {
      return errorResponse('Objet non trouvé', 404)
    }

    if (isAdmin) {
      const auth = await authenticateRequest(request, ['super_admin', 'editor'])
      if (auth instanceof NextResponse) return auth

      return jsonResponse({
        item: {
          ...item,
          currentPrice: item.bids[0]?.amount ?? item.startPrice,
          bidCount: item.bids.length,
          isEnded: item.endDate.getTime() < Date.now(),
        },
      }, 200)
    }

    // Public: no bidder PII, just amounts/timestamps
    return jsonResponse({
      item: {
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        startPrice: item.startPrice,
        minIncrement: item.minIncrement,
        endDate: item.endDate,
        currentPrice: item.bids[0]?.amount ?? item.startPrice,
        bidCount: item.bids.length,
        isEnded: item.endDate.getTime() < Date.now(),
        recentBids: item.bids.slice(0, 5).map((b) => ({
          amount: b.amount,
          createdAt: b.createdAt,
          bidderInitial: b.bidderName.trim().charAt(0).toUpperCase(),
        })),
      },
    }, 200)
  } catch (error) {
    console.error('Get auction item error:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request, ['super_admin', 'editor'])
    if (auth instanceof NextResponse) return auth

    const existing = await prisma.auctionItem.findUnique({ where: { id: params.id } })
    if (!existing) return errorResponse('Objet non trouvé', 404)

    const body = await request.json()
    const { title, description, imageUrl, startPrice, minIncrement, endDate, order, visible } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = sanitizeString(title)
    if (description !== undefined) updateData.description = sanitizeString(description)
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? sanitizeString(imageUrl) : null
    if (startPrice !== undefined) updateData.startPrice = Math.round(Number(startPrice))
    if (minIncrement !== undefined) updateData.minIncrement = Math.round(Number(minIncrement))
    if (endDate !== undefined) updateData.endDate = new Date(endDate)
    if (order !== undefined) updateData.order = order
    if (visible !== undefined) updateData.visible = visible

    const item = await prisma.auctionItem.update({ where: { id: params.id }, data: updateData })

    await logAdminAction(auth.id, 'UPDATE_AUCTION_ITEM', 'AuctionItem', item.id, `Updated fields: ${Object.keys(updateData).join(', ')}`)

    return jsonResponse({ item }, 200)
  } catch (error) {
    console.error('Update auction item error:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request, ['super_admin'])
    if (auth instanceof NextResponse) return auth

    const existing = await prisma.auctionItem.findUnique({ where: { id: params.id } })
    if (!existing) return errorResponse('Objet non trouvé', 404)

    await prisma.auctionItem.delete({ where: { id: params.id } })

    await logAdminAction(auth.id, 'DELETE_AUCTION_ITEM', 'AuctionItem', params.id, `Deleted: ${existing.title}`)

    return jsonResponse({ message: 'Objet supprimé' }, 200)
  } catch (error) {
    console.error('Delete auction item error:', error)
    return errorResponse('Internal server error', 500)
  }
}
