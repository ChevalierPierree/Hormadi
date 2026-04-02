import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendTicketEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { matchId, categoryId, quantity, customerName, customerEmail, customerPhone } = body

    if (!matchId || !categoryId || !quantity || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const qty = Number(quantity)
    if (qty < 1 || qty > 10) {
      return NextResponse.json({ error: 'Quantité invalide (1 à 10)' }, { status: 400 })
    }

    // Check match exists and is scheduled
    const matchRows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, status, date, homeTeam, awayTeam FROM Match WHERE id = '${matchId.replace(/'/g, "''")}'`
    )
    if (!matchRows.length) {
      return NextResponse.json({ error: 'Match introuvable' }, { status: 404 })
    }
    if (matchRows[0].status !== 'scheduled') {
      return NextResponse.json({ error: 'Ce match n\'est plus disponible à la vente' }, { status: 400 })
    }

    // Check category exists and has availability
    const catRows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, price, capacity, sold FROM TicketCategory WHERE id = '${categoryId.replace(/'/g, "''")}' AND matchId = '${matchId.replace(/'/g, "''")}'`
    )
    if (!catRows.length) {
      return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
    }

    const cat = catRows[0]
    const available = cat.capacity - cat.sold
    if (qty > available) {
      return NextResponse.json(
        { error: `Seulement ${available} place(s) disponible(s) en ${cat.name}` },
        { status: 400 }
      )
    }

    // Calculate total price
    const totalPrice = cat.price * qty

    // Generate reference
    const reference = `HRM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create order ID
    const orderId = 'to_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    const now = new Date().toISOString()

    // Update sold count
    await prisma.$executeRawUnsafe(
      `UPDATE TicketCategory SET sold = sold + ${qty} WHERE id = '${categoryId.replace(/'/g, "''")}'`
    )

    // Create order
    await prisma.$executeRawUnsafe(
      `INSERT INTO TicketOrder (id, matchId, categoryId, quantity, totalPrice, customerName, customerEmail, customerPhone, status, reference, createdAt)
       VALUES ('${orderId}', '${matchId.replace(/'/g, "''")}', '${categoryId.replace(/'/g, "''")}', ${qty}, ${totalPrice}, '${customerName.replace(/'/g, "''")}', '${customerEmail.replace(/'/g, "''")}', '${customerPhone.replace(/'/g, "''")}', 'confirmed', '${reference}', '${now}')`
    )

    const order = {
      id: orderId,
      reference,
      matchId,
      matchDate: matchRows[0].date,
      homeTeam: matchRows[0].homeTeam,
      awayTeam: matchRows[0].awayTeam,
      categoryName: cat.name,
      quantity: qty,
      unitPrice: cat.price,
      totalPrice,
      customerName,
      customerEmail,
      customerPhone,
      status: 'confirmed',
      createdAt: now,
    }

    // Send confirmation email (non-blocking)
    const matchDate = new Date(matchRows[0].date)
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
      homeTeam: matchRows[0].homeTeam,
      awayTeam: matchRows[0].awayTeam,
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

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error) {
    console.error('Create ticket order error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const reference = url.searchParams.get('reference')

    if (reference) {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT o.*, tc.name as categoryName, tc.price as unitPrice,
                m.date as matchDate, m.homeTeam, m.awayTeam, m.venue
         FROM TicketOrder o
         JOIN TicketCategory tc ON o.categoryId = tc.id
         JOIN Match m ON o.matchId = m.id
         WHERE o.reference = '${reference.replace(/'/g, "''")}'`
      )
      if (!rows.length) {
        return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
      }
      return NextResponse.json({ order: rows[0] })
    }

    return NextResponse.json({ error: 'Paramètre reference requis' }, { status: 400 })
  } catch (error) {
    console.error('Get ticket order error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
