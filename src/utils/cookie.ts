import { TokenPayload } from '~/models/requests/register.requests'

export const createCookie = (token: string): string => {
  return `Authorization=${token}; Max-Age=${process.env.REFRESH_TOKEN_EXPIRES_IN}; Path=/`
}
