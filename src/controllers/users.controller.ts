import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import {
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody
} from '~/models/requests/register.requests'
import databaseServices from '~/services/database.services'
import userServices from '~/services/users.services'
import { createCookie } from '~/utils/cookie'

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.register(req.body)
  return res.json({ message: USER_MESSAGES.REGISTER_SUCCESS, result })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user
  const user_id = user?._id as ObjectId
  const result = await userServices.login(user_id.toString())
  const cookie = createCookie(result.access_token)
  res.setHeader('Set-Cookie', [cookie])
  return res.json({ message: USER_MESSAGES.LOGIN_SUCCESS, user, result })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  await userServices.logout(refresh_token)
  res.clearCookie('Authorization')
  return res.json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

  // neu khong tim ra user
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  // da xac thuc roi
  if (user.email_verify_token === '') {
    return res.json({ message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }

  const result = await userServices.verifyEmail(user_id)
  return res.json({ message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS, result })
}
export const resendVerifyEmailController = async (req: Request, res: Response) => {
  // find user
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({ message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }
  // goi service o day de tao moi email token
  const result = await userServices.resendVerifyEmail(user_id)
  return res.json(result)
}

export const getProfileController = async (req: Request, res: Response) => {
  // find user
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  // goi service o day de tao moi email token
  return res.json(user)
}

export const getDocumentOfUserController = async (req: Request, res: Response) => {
  // find user
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  const documents = await databaseServices.documents
    .find({ user_id: new ObjectId('64c8b6a6b1a08903c0febbe8') })
    .toArray()
  // goi service o day de tao moi email token
  return res.json(documents)
}
