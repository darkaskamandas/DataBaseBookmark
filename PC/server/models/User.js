'use strict'

import mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = new Schema({
  github: {
    id: String,
    displayName: String,
    username: String,
    created: {
      type: Date,
      required: true,
      default: new Date(),
      expires: '365d'
    }
  },
  twitter: {
    id: String,
    displayName: String,
    username: String,
    created: {
      type: Date,
      required: true,
      default: new Date(),
      expires: '365d'
    }
  }
})

export default mongoose.model('User', User)
