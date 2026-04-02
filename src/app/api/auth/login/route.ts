import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { verifyPassword, signToken, setSessionCookie } from '@/lib/auth'
import { jsonResponse, errorResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email et mot de passe requis', 400)
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      return errorResponse('Identifiants invalides', 401)
    }

    // Verify password (Prisma field is "password")
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return errorResponse('Identifiants invalides', 401)
    }

    // Generate JWT token (signToken expects { userId, role })
    const token = signToken({
      userId: user.id,
      role: user.role as any,
    })

    // Set session cookie (uses next/headers cookies())
    setSessionCookie(token)

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Erreur interne du serveur', 500)
  }
}
