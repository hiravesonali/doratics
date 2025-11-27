import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - No token provided',
    })
  }

  const token = authHeader.substring(7)

  try {
    // In production, verify with Clerk
    const config = useRuntimeConfig()
    const clerkSecretKey = config.clerkSecretKey

    // Basic token validation (you'll need to implement Clerk JWT verification)
    if (!token || token === '') {
      throw new Error('Invalid token')
    }

    // TODO: Implement proper Clerk JWT verification
    // For now, we'll extract userId from token claims
    // In production, use Clerk's verifyToken function

    // Placeholder user ID extraction
    const userId = 'user-placeholder' // This should come from verified JWT claims

    event.context.userId = userId
    return userId
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Invalid token',
    })
  }
}

export async function getOptionalAuth(event: H3Event): Promise<string | null> {
  try {
    return await requireAuth(event)
  } catch {
    return null
  }
}
