import { config } from 'dotenv'
import Koa from 'koa'
import logger from 'koa-logger'
import body from 'koa-body'
import mongoose from 'mongoose'
import bluebird from 'bluebird'

import routes from 'routes'

import 'models'

mongoose.Promise = bluebird.Promise

config()

const { PORT, DB_HOST, DB_NAME, DB_PORT } = process.env
const DB_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
const dbOptions = { useNewUrlParser: true }

async function start(err) {
  if (err) {
    console.log({ err })

    return process.exit(1)
  }

  const app = new Koa()

  app.use(logger())
  app.use(body({ json: true, encoding: 'utf-8', urlencoded: true }))

  app.use(routes.routes())

  app.listen(PORT)

  console.log(`Process started at port :${PORT}`)
}

// mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
mongoose.connect(DB_URI, dbOptions, start)
