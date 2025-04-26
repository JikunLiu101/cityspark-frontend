import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  exp?: number
  iat?: number
  [key: string]: any
}

// Decode token and extract userId
export function getUserIdFromToken(): number | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token')
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token.startsWith('Bearer ') ? token.slice(7) : token)
    return parseInt(decoded.sub)  // Assuming your backend stores userId inside "sub"
  } catch (err) {
    console.error('Failed to decode token', err)
    return null
  }
}
