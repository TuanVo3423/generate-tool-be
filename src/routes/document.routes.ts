import { Router } from 'express'
import {
  createDocumentController,
  deleteDocumentController,
  getDocumentController,
  updateDocumentController
} from '~/controllers/documents.controller'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const documentsRouter = Router()

documentsRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getDocumentController))
documentsRouter.post('/', accessTokenValidator, wrapRequestHandler(createDocumentController))
documentsRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(deleteDocumentController))
documentsRouter.patch('/:id', accessTokenValidator, wrapRequestHandler(updateDocumentController))

export default documentsRouter
