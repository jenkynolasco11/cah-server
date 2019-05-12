import Router from 'koa-router'

import { getInstance } from 'middlewares'
import { Sets, Cards } from 'models'

const cardRoute = new Router({ prefix: 'card' })

const getCard = async ctx => {
  const { card } = ctx.locals

  return (ctx.body = card)
}

cardRoute.get('/:cardId', getInstance, getCard)

export default cardRoute
