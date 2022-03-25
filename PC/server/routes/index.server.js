'use strict'

/*** ENVIRONMENT ***/
const path = process.cwd()
import dotenv from 'dotenv'
dotenv.load()

const DEV = process.env.NODE_ENV === 'development'
const PROD = process.env.NODE_ENV === 'production'

/*** CONTROLLERS ***/
import {
  allPins,
  deletePin,
  login,
  root,
  savePin,
  toggleLikePin,
  unpinAll
} from '../controllers/pinController.server.js'

/*** ROUTES ***/
export const routes = (app, passport) => {
  //Enforce HTTPS in production
  if (PROD) {
    app.use('*', (req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        console.log('Redirecting to', process.env.APP_URL + req.url)
        res.redirect(process.env.APP_URL + req.url)
      } else {
        next() /* Continue to other routes if we're not redirecting */
      }
    })
  }

  //This is the name that will display in the client view
  let name_view

  //Authorization check
  const permissions = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (DEV) {
        console.log('AUTHORIZATION SUCCESSFUL:', req.user) //This will only be available if proper URI is set with auth provider (Twitter or GitHub)
      }
      if (req.user.github.username) {
        name_view = req.user.github.username
      } else if (req.user.twitter.username) {
        name_view = req.user.twitter.username
      }
      console.log('USER:', name_view)
      return next()
    } else if (DEV) {
      //Developers pass permissions checks
      name_view = 'Stranger' //This can be set to whatever is needed-- e.g., a troll's username--to delete awkward submissions manually
      console.log('DEVELOPER:', name_view)
      return next()
    } else {
      res.redirect('/login')
    }
  }

  //Root view
  app.route('/').get(permissions, root)

  //Login view
  app.route('/login').get(login)

  //GitHub and Passport.js authentication - URL
  app.route('/auth/github').get(passport.authenticate('github'))

  //GitHub and Passport.js authentication - callback
  app.route('/auth/github/callback').get(
    passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )

  //Twitter Auth
  app.route('/auth/twitter').get(passport.authenticate('twitter'))

  //Twitter Auth
  app.route('/auth/twitter/callback').get(
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  )

  //Client-side API path to GET name_view
  app.route('/api/users/logged').get(
    /* permissions, */ (req, res) => {
      if (DEV) {
        console.log('Client requesting username...')
      }
      if (name_view) {
        if (DEV) {
          console.log('Sending username', name_view)
        }
        res.json(name_view)
      } else {
        res.redirect('/login')
      }
    }
  )

  //Passport logout
  app.route('/logout').get((req, res) => {
    req.logout()
    res.redirect('/login')
  })

  //Save new pin
  app.route('/api/savePin/:data').post(/* permissions, */ savePin)

  //Delete pin
  app.route('/api/deletePin/:data').delete(/* permissions, */ deletePin)

  //All pins
  app.route('/api/allPins').get(allPins)

  //Like or unlike a pin
  app.route('/api/toggleLikePin/:data').post(/* permissions, */ toggleLikePin)

  /*** DEBUGGING - No UI ***/
  if (DEV) {
    //Delete all pins
    if (DEV) {
      app.use('/api/unpinAll', unpinAll)
    }
  }
}
