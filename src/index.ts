import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { config } from 'dotenv'
config()
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import documentsRouter from './routes/document.routes'

databaseServices.connect()
const app = express()
const port = 3002
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:3003', credentials: true }))
app.use('/users', usersRouter)
app.use('/documents', documentsRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
