import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, type UserRole, type AuthUser } from './auth'
import { prisma } from './db'

// ─── Response Helpers ────────────────────────────────────

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// ─── Auth Middleware ──────────────────────────────────────

export async function authenticateRequest(
  req: NextRequest,
  requiredRoles?: UserRole[]
): Promise<AuthUser | NextResponse> {
  const token = req.cookies.get('hormadi_admin_token')?.value

  if (!token) {
    return errorResponse('Non authentifié', 401)
  }

  const payload = verifyToken(token)
  if (!payload) {
    return errorResponse('Token invalide ou expiré', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  })

  if (!user) {
    return errorResponse('Utilisateur non trouvé', 401)
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (user.role !== 'super_admin' && !requiredRoles.includes(user.role as UserRole)) {
      return errorResponse('Accès non autorisé', 403)
    }
  }

  return user as AuthUser
}

// ─── Validation ──────────────────────────────────────────

export function validateRequired(data: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `Le champ "${field}" est requis`
    }
  }
  return null
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// ─── Pagination ──────────────────────────────────────────

export function getPaginationParams(req: NextRequest) {
  const url = new URL(req.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

// ─── Logging ─────────────────────────────────────────────

export async function logAdminAction(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: string
) {
  await prisma.adminLog.create({
    data: { userId, action, entity, entityId, details },
  })
}

// ─── Reference Generator ─────────────────────────────────

export function generateReference(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
