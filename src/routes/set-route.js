import Router from 'koa-router'

import { getInstance } from 'middlewares'
import { Sets, Cards } from 'models'

const setRoute = new Router({ prefix: 'set' })

const getSetCards = async ctx => {
  const { set } = ctx.locals

  const cards = await set.getCards()

  return (ctx.body = { cards, set })
}

setRoute.get('/:setId', getInstance, getSetCards)

export default setRoute
