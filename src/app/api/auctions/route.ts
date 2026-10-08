import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  validateRequired,
  sanitizeString,
  logAdminAction,
} from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const isAdmin = url.searchParams.get('admin') === 'true'

    if (isAdmin) {
      const auth = await authenticateRequest(request, ['super_admin', 'editor'])
      if (auth instanceof NextResponse) return auth

      const items = await prisma.auctionItem.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: { bids: { orderBy: { amount: 'desc' } } },
      })

      const withStats = items.map((item) => ({
        ...item,
        currentPrice: item.bids[0]?.amount ?? item.startPrice,
        bidCount: item.bids.length,
        isEnded: item.endDate.getTime() < Date.now(),
      }))

      return jsonResponse({ items: withStats }, 200)
    }

    // Public: only visible items, no bidder PII
    const items = await prisma.auctionItem.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } },
    })

    const publicItems = items.map((item) => ({
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
    }))

    return jsonResponse({ items: publicItems }, 200)
  } catch (error) {
    console.error('Get auctions error:', error)
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, ['super_admin', 'editor'])
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { title, description, imageUrl, startPrice, minIncrement, endDate, order, visible } = body

    const validationError = validateRequired({ title, description, startPrice, endDate }, [
      'title', 'description', 'startPrice', 'endDate',
    ])
    if (validationError) return errorResponse(validationError, 400)

    const item = await prisma.auctionItem.create({
      data: {
        title: sanitizeString(title),
        description: sanitizeString(description),
        imageUrl: imageUrl ? sanitizeString(imageUrl) : null,
        startPrice: Math.round(Number(startPrice)),
        minIncrement: minIncrement !== undefined ? Math.round(Number(minIncrement)) : 500,
        endDate: new Date(endDate),
        order: order ?? 0,
        visible: visible ?? true,
      },
    })

    await logAdminAction(auth.id, 'CREATE_AUCTION_ITEM', 'AuctionItem', item.id, `Created: ${item.title}`)

    return jsonResponse({ item }, 201)
  } catch (error) {
    console.error('Create auction item error:', error)
    return errorResponse('Internal server error', 500)
  }
}
