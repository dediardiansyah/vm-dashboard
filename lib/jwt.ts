import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: number
  campaignId: number
  iat?: number
  exp?: number
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as JwtPayload
    
    return decoded
  } catch (error) {
    return null
  }
}