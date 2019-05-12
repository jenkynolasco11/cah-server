import mongoose, { Schema } from 'mongoose'

import Card from './card'

const SetSchema = new Schema({
  name: { type: String, unique: true },
  code: { type: String, unique: true },
  createdAt: {
    type: Date,
    default() {
      return Date.now()
    },
  },
})

// Static Methods
SetSchema.statics.importSets = async function(cards) {
  const { whiteCards, blackCards, order, ...sets } = cards

  try {
    await Object.keys(sets).map(async code => {
      const { name, black, white } = cards[code]
      const data = { code, name }

      let set = await this.findOne(data)

      if (set) return Promise.resolve()

      set = await this.create(data)

      await set.importCards({ whiteCards, blackCards, black, white })
    })

    console.log('imported all sets')
  } catch (err) {
    // console.log({ err })
  }
}

// Instance Methods
SetSchema.methods.importCards = async function(cards) {
  const { _id: set, name } = this
  try {
    const { whiteCards, blackCards, white, black } = cards

    await Promise.all([
      white.map(i => Card.saveCard(whiteCards[i], set, 'white')),
      black.map(i => Card.saveCard(blackCards[i], set, 'black')),
    ])

    console.log(`imported all cards for set: ${name}`)
  } catch (err) {
    console.log({ err })
  }
}

SetSchema.methods.getCards = async function() {
  const { _id: set } = this

  try {
    const [ whites, blacks ] = await Promise.all([
      await Card.getCards(set, 'white'),
      await Card.getCards(set, 'black'),
    ])

    return {
      whites, //: Card.shuffleCards(whites),
      blacks, //: Card.shuffleCards(blacks),
    }
  } catch (err) {
    console.log({ err })
  }

  return { whites: [], blacks: [] }
}

export default mongoose.model('set', SetSchema, 'set')
