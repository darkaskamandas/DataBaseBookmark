'use strict'

import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Pin = new Schema({
  created: {
    type: Date,
    required: true,
    default: new Date(),
    expires: '365d'
  },
  img: {
    type: String,
    default: '../../client/img/image.png' //This is redundant from default client state
  },
  likes: [String],
  shares: [String],
  title: { type: String, required: true },
  owner: { type: String, required: true }
})

export default mongoose.model('Pin', Pin)
