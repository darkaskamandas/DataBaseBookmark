'use strict'

/*** ENVIRONMENT ***/
const path = process.cwd()
import dotenv from 'dotenv'
dotenv.load()

/*** DEVELOPMENT TOOLS ***/
const DEV = process.env.NODE_ENV === 'development'
const PROD = process.env.NODE_ENV === 'production'

/*** MODEL ***/
import Pin from '../models/Pin.js'

/*** FUNCTIONS ***/

//Root view
export const root = (req, res) => {
  res.sendFile(path + '/dist/index.html')
}

//Login view
export const login = (req, res) => {
  res.sendFile(path + '/dist/login.html')
}

//Toggle Like Pin
export const toggleLikePin = (req, res) => {
  const obj = JSON.parse(decodeURIComponent(req.params.data))
  const title = obj.title
  const img = obj.img
  const owner = obj.owner
  const user = obj.loggedUser

  Pin.findOne(
    {
      title: title,
      img: img,
      owner: owner
    },
    (err, doc) => {
      if (err) {
        console.error(err)
      }
      if (doc) {
        //If the user already liked the pin
        if (doc.likes.indexOf(user) >= 0) {
          //Remove the like
          doc.likes.splice(doc.likes.indexOf(user), 1)
          if (DEV) {
            console.log('This pin has been unliked!')
          }
        } else {
          //Otherwise add it - but don't add a null value as a like
          if (user !== null) {
            doc.likes.push(user)
          }
          if (DEV) {
            console.log('This pin has been liked!')
          }
        }
        //Save what happened
        doc.save((err, result) => {
          res.json('Saved' + result)
        })
      }
    }
  )
}

//Get all pins
export const allPins = (req, res) => {
  Pin.find({})
    //Show most recent first
    .sort({ created: 'descending' })
    .exec((err, doc) => {
      if (err) {
        console.error(err)
      }
      if (doc) {
        res.json(doc)
      }
    })
}

//updateAllPins - web socket controller
export const updateAllPins = (socket, message) => {
  Pin.find({})
    //Show most recent first
    .sort({ created: 'descending' })
    .exec((err, doc) => {
      if (err) {
        console.error(err)
      }
      if (doc) {
        socket.emit(message, doc)
      }
    })
}

//Delete all pins
export const unpinAll = (req, res) => {
  Pin.remove({}, (err, doc) => {
    res.json('All pins deleted.')
  })
}

//Save new Pin
export const savePin = (req, res) => {
  const obj = JSON.parse(decodeURIComponent(req.params.data))
  const title = obj.title
  const img = obj.img
  const owner = obj.owner
  Pin.findOne(
    {
      title: title,
      img: img,
      owner: owner
    },
    (err, doc) => {
      if (err) {
        console.error(err)
      }
      if (doc) {
        res.json('You already pinned this!')
      } else {
        const newPin = new Pin({
          title: title,
          img: img,
          owner: owner
        })
        newPin.save((err, doc) => {
          if (err) {
            console.error(err)
          }
          res.json('Your pin has been saved!')
        })
      }
    }
  )
}

//Delete Pin
export const deletePin = (req, res) => {
  const obj = JSON.parse(decodeURIComponent(req.params.data))
  const title = obj.title
  const img = obj.img
  const owner = obj.owner

  Pin.remove(
    {
      title: title,
      img: img,
      owner: owner
    },
    (err, doc) => {
      if (err) {
        console.error(err)
      }
      if (doc) {
        res.json('Your pin has been deleted.')
      }
    }
  )
}
