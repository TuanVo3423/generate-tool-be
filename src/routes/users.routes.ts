import { Router } from 'express'
import {
  getDocumentOfUserController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  getProfileValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

// add middlewares here
usersRouter.get('/me', getProfileValidator, wrapRequestHandler(getProfileController))
usersRouter.get('/me/documents', accessTokenValidator, wrapRequestHandler(getDocumentOfUserController))
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default usersRouter

// class errorWithStatus
//
