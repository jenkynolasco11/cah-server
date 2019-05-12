import { Cards, Sets } from 'models'

const projection = { __v: 0, createdAt: 0 }

async function getInstance(ctx, next) {
  const { cardId, setId } = ctx.params

  ctx.locals = ctx.locals || {}

  if (cardId) ctx.locals.card = await Cards.findById(cardId, projection)
  if (setId) ctx.locals.set = await Sets.findById(setId, projection)

  return next()
}

export default getInstance
