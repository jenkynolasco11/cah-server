import Router from 'koa-router'

import { Sets } from 'models'

import cards from '../../cah'
import cardRoute from './card-route'
import setRoute from './set-route'

import { handle404 } from 'middlewares'

Sets.importSets(cards)

const rootRoute = new Router()

const routes = [ cardRoute, setRoute ]
const middlewares = [ handle404 ]

rootRoute.use('/', ...middlewares)

routes.forEach(route => {
  rootRoute.use('/', route.routes(), route.allowedMethods())
})

export default rootRoute
