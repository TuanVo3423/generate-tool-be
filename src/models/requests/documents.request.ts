import { ObjectId } from 'mongodb'

export interface ICreateDocumentBody {
  name_project: string
  description_project: string
  content: string
}

export interface IGetDocumentBody {
  document_id: string
}

export interface IUpdateDocumentBody {
  content: string
}
