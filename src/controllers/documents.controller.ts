import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { ICreateDocumentBody, IGetDocumentBody, IUpdateDocumentBody } from '~/models/requests/documents.request'
import { TokenPayload } from '~/models/requests/register.requests'
import Document from '~/models/schemas/Document.schema'
import databaseServices from '~/services/database.services'
export const createDocumentController = async (
  req: Request<ParamsDictionary, any, ICreateDocumentBody>,
  res: Response,
  next: NextFunction
) => {
  const payload = req.body
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  await databaseServices.documents.insertOne(new Document({ ...payload, user_id: new ObjectId(user_id) }))
  return res.json({ message: USER_MESSAGES.CREATED_DOCUMENT })
}

export const getDocumentController = async (
  req: Request<ParamsDictionary, any, IGetDocumentBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  const document = await databaseServices.documents.findOne({ _id: new ObjectId(id) })
  return res.json(document)
}

export const deleteDocumentController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  await databaseServices.documents.deleteOne({ _id: new ObjectId(id) })
  return res.json({ message: 'Document deleted successfully' })
}

export const updateDocumentController = async (
  req: Request<ParamsDictionary, any, IUpdateDocumentBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const { content } = req.body
  console.log(req.body)
  await databaseServices.documents.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        content
      }
    }
  )
  return res.json({ message: 'Document updated successfully' })
}
