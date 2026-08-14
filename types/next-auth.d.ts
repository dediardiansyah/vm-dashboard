import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      role: string
      status: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: number
      role: string
      status: string
    } & DefaultSession['user']
  }
}