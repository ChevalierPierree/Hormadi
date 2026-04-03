import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if database is available (SQLite file exists or DATABASE_URL is set)
const isDatabaseAvailable = !!process.env.DATABASE_URL

function createMockPrisma(): PrismaClient {
  console.warn('⚠️ Database unavailable — using mock Prisma client (build mode)')
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') return undefined
      if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve()
      if (prop === '$on' || prop === '$use') return () => {}
      // For model access (prisma.user, prisma.match, etc.)
      return new Proxy({}, {
        get(_t, method) {
          // All Prisma methods return null/empty
          return (..._args: any[]) => {
            if (method === 'findMany') return Promise.resolve([])
            if (method === 'count') return Promise.resolve(0)
            return Promise.resolve(null)
          }
        }
      })
    }
  }
  return new Proxy({} as PrismaClient, handler)
}

function createPrismaClient(): PrismaClient {
  if (!isDatabaseAvailable) {
    return createMockPrisma()
  }
  try {
    return new PrismaClient()
  } catch (e) {
    console.warn('⚠️ Prisma client initialization failed:', e)
    return createMockPrisma()
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
