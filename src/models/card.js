import mongoose, { Schema } from 'mongoose'

const PROJECTION = {
  _id: 1,
  type: 1,
  'set._id': 1,
  'set.code': 1,
  'set.name': 1,
}

const CardSchema = new Schema({
  set: { type: Schema.Types.ObjectId, ref: 'set', index: true },
  type: { type: String, enum: [ 'black', 'white' ], index: true },
  text: { type: String, unique: true },
  picks: {
    type: Number,
    index: true,
    default() {
      return 0
    },
  },
  createdAt: {
    type: Date,
    default() {
      return Date.now()
    },
  },
})

// Static Methods
CardSchema.statics.saveCard = async function(cardItem, set, type) {
  const data = { set, type, text: cardItem.text || cardItem }

  const card = await this.findOne(data)

  if (card) return Promise.resolve()

  return this.create({ ...data, picks: cardItem.pick || 0 })
}

CardSchema.statics.shuffleCards = function(cards) {
  const copy = [ ...cards ]
  const cardsCount = copy.length

  for (let i = cardsCount - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }

  return copy
}

CardSchema.statics.getCard = async function(cardId) {
  try {
    const card = await this.findById(cardId).populate('set', PROJECTION.set)

    return card
  } catch (err) {
    console.log(err)
  }

  return {}
}

CardSchema.statics.getCards = async function(set, type = 'white') {
  const pipelines = [
    { $match: { set: mongoose.Types.ObjectId(set), type } },
    {
      $lookup: {
        from: 'set',
        localField: 'set',
        foreignField: '_id',
        as: 'set',
      },
    },
    { $unwind: '$set' },
    {
      $project: {
        ...PROJECTION,
        ...(type === 'white' ? {} : { picks: 1 }),
      },
    },
  ]

  try {
    const cards = await this.aggregate(pipelines)

    return { total: cards.length, cards }
  } catch (err) {
    console.log(err)
  }

  return []
}

export default mongoose.model('card', CardSchema, 'card')
