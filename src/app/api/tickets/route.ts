import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { sendTicketEmail } from '@/lib/email'
import { jsonResponse, errorResponse } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { matchId, categoryId, quantity, customerName, customerEmail, customerPhone } = body

    if (!matchId || !categoryId || !quantity || !customerName || !customerEmail || !customerPhone) {
      return errorResponse('Champs requis manquants', 400)
    }

    const qty = Number(quantity)
    if (qty < 1 || qty > 10) {
      return errorResponse('Quantité invalide (1 à 10)', 400)
    }

    // Check match exists and is scheduled
    const match = await prisma.match.findUnique({ where: { id: matchId } })
    if (!match) {
      return errorResponse('Match introuvable', 404)
    }
    if (match.status !== 'scheduled') {
      return errorResponse("Ce match n'est plus disponible à la vente", 400)
    }

    // Check category exists and has availability
    const cat = await prisma.ticketCategory.findFirst({
      where: { id: categoryId, matchId },
    })
    if (!cat) {
      return errorResponse('Catégorie introuvable', 404)
    }

    const available = cat.capacity - cat.sold
    if (qty > available) {
      return errorResponse(
        `Seulement ${available} place(s) disponible(s) en ${cat.name}`,
        400
      )
    }

    // Calculate total price
    const totalPrice = cat.price * qty

    // Generate reference
    const reference = `HRM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Use transaction to update sold count and create order atomically
    const order = await prisma.$transaction(async (tx) => {
      // Update sold count
      await tx.ticketCategory.update({
        where: { id: categoryId },
        data: { sold: { increment: qty } },
      })

      // Create order
      return tx.ticketOrder.create({
        data: {
          matchId,
          categoryId,
          quantity: qty,
          totalPrice,
          customerName,
          customerEmail,
          customerPhone,
          status: 'confirmed',
          reference,
        },
      })
    })

    const orderResponse = {
      id: order.id,
      reference,
      matchId,
      matchDate: match.date,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      categoryName: cat.name,
      quantity: qty,
      unitPrice: cat.price,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone,
      status: 'confirmed',
      createdAt: order.createdAt,
    }

    // Send confirmation email (non-blocking)
    const matchDate = new Date(match.date)
    const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    const dateStr = `${weekdays[matchDate.getDay()]} ${matchDate.getDate()} ${months[matchDate.getMonth()]} ${matchDate.getFullYear()}`
    const timeStr = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    const qrData = `HORMADI-TICKET|${reference}|${matchId}|${cat.name}|${qty}|${customerName}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

    sendTicketEmail({
      to: customerEmail,
      customerName,
      reference,
      matchDate: dateStr,
      matchTime: timeStr,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      venue: 'Patinoire de la Barre',
      categoryName: cat.name,
      quantity: qty,
      totalPrice,
      qrCodeUrl,
    }).then((result) => {
      if (!result.success) console.error('Email send failed:', result.error)
      else console.log(`✉️ Confirmation email sent to ${customerEmail} for ${reference}`)
    }).catch((err) => {
      console.error('Email send error:', err)
    })

    return jsonResponse({ success: true, order: orderResponse }, 201)
  } catch (error) {
    console.error('Create ticket order error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const reference = url.searchParams.get('reference')

    if (reference) {
      const order = await prisma.ticketOrder.findUnique({
        where: { reference },
        include: {
          category: true,
          match: true,
        },
      })

      if (!order) {
        return errorResponse('Commande introuvable', 404)
      }

      return jsonResponse({
        order: {
          ...order,
          categoryName: order.category.name,
          unitPrice: order.category.price,
          matchDate: order.match.date,
          homeTeam: order.match.homeTeam,
          awayTeam: order.match.awayTeam,
          venue: order.match.venue,
        },
      })
    }

    return errorResponse('Paramètre reference requis', 400)
  } catch (error) {
    console.error('Get ticket order error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}
