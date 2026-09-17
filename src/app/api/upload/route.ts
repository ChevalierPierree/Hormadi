import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { authenticateRequest, jsonResponse, errorResponse, logAdminAction } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

// Generic authenticated image upload for every admin form (articles, players,
// staff, partners, products). Files go to Vercel Blob — the alternative
// (writing into public/ on the server) doesn't work on Vercel: the filesystem
// there is read-only at runtime and reset on every deploy.
const ALLOWED_FOLDERS = ['articles', 'players', 'staff', 'partners', 'products'] as const
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE = 8 * 1024 * 1024 // 8MB

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request, [
      'super_admin', 'editor', 'admin_billetterie', 'admin_boutique',
    ])
    if (authResult instanceof NextResponse) return authResult

    const formData = await request.formData()
    const file = formData.get('file')
    const folderRaw = formData.get('folder')
    const folder = ALLOWED_FOLDERS.includes(folderRaw as any) ? (folderRaw as string) : 'misc'

    if (!(file instanceof File)) {
      return errorResponse('Aucun fichier reçu', 400)
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Format non supporté (JPEG, PNG, WEBP, GIF ou SVG uniquement)', 400)
    }
    if (file.size > MAX_SIZE) {
      return errorResponse('Fichier trop volumineux (8 Mo max)', 400)
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const base = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image'
    const filename = `${folder}/${base}-${Date.now()}.${ext}`

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    await logAdminAction(authResult.id, 'UPLOAD_IMAGE', folder, undefined, blob.url)

    return jsonResponse({ url: blob.url }, 200)
  } catch (error) {
    console.error('Upload error:', error)
    return errorResponse('Erreur lors du téléchargement', 500)
  }
}
