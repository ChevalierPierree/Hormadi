import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-dev-only'
const TOKEN_NAME = 'hormadi_admin_token'
const TOKEN_EXPIRY = '7d'

// ─── Types ───────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin_billetterie' | 'admin_boutique' | 'editor'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
}

type TokenPayload = {
  userId: string
  role: UserRole
}

// ─── Password ────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ─── JWT ─────────────────────────────────────────────────

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

// ─── Session ─────────────────────────────────────────────

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  })

  if (!user) return null

  return user as AuthUser
}

export function setSessionCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearSessionCookie() {
  cookies().delete(TOKEN_NAME)
}

// ─── Authorization ───────────────────────────────────────

const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin_billetterie: 50,
  admin_boutique: 50,
  editor: 10,
}

export function hasRole(user: AuthUser, requiredRole: UserRole): boolean {
  if (user.role === 'super_admin') return true
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessBilletterie(user: AuthUser): boolean {
  return user.role === 'super_admin' || user.role === 'admin_billetterie'
}

export function canAccessBoutique(user: AuthUser): boolean {
  return user.role === 'super_admin' || user.role === 'admin_boutique'
}

export function canEditContent(user: AuthUser): boolean {
  return true // all roles can edit content
}
