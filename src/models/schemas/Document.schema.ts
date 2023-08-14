import { ObjectId } from 'mongodb'

interface IDocument {
  _id?: ObjectId
  name_project: string
  description_project: string
  content: string
  user_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class Document {
  _id?: ObjectId
  name_project: string
  description_project: string
  content: string
  user_id: ObjectId
  created_at: Date
  updated_at: Date

  constructor(document: IDocument) {
    const date = new Date()
    this._id = document._id
    this.user_id = document.user_id
    this.content = document.content
    this.description_project = document.description_project
    this.name_project = document.name_project
    this.created_at = document.created_at || date
    this.updated_at = document.updated_at || date
  }
}
