import crypto from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecretKey(): string {
  const secret = process.env.ADMIN_SECRET_PASSWORD
  if (!secret) {
    throw new Error('ADMIN_SECRET_PASSWORD environment variable is not defined')
  }
  return secret
}

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export function verifyAdminPassword(password: string): boolean {
  try {
    const secret = getSecretKey()
    const passwordHash = crypto.createHash('sha256').update(password).digest()
    const secretHash = crypto.createHash('sha256').update(secret).digest()
    return crypto.timingSafeEqual(passwordHash, secretHash)
  } catch {
    return false
  }
}

export function createAdminSession(event: H3Event) {
  const secret = getSecretKey()
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  })
  const encodedPayload = Buffer.from(payload).toString('base64url')
  const signature = sign(encodedPayload, secret)
  const token = `${encodedPayload}.${signature}`

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  })
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, {
    path: '/',
  })
}

export function verifyAdminSession(event: H3Event): boolean {
  try {
    const token = getCookie(event, COOKIE_NAME)
    if (!token) return false

    const [encodedPayload, signature] = token.split('.')
    if (!encodedPayload || !signature) return false

    const secret = getSecretKey()
    const expectedSignature = sign(encodedPayload, secret)

    const sigBuffer = Buffer.from(signature)
    const expSigBuffer = Buffer.from(expectedSignature)

    if (sigBuffer.length !== expSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expSigBuffer)) {
      return false
    }

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    const payload = JSON.parse(payloadJson)

    if (payload.role !== 'admin') return false
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false

    return true
  } catch {
    return false
  }
}

export function requireAdmin(event: H3Event) {
  const isAuthenticated = verifyAdminSession(event)
  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Admin access required',
    })
  }
}
