'use strict'

const GitHubStrategy = require('passport-github2').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
import User from '../models/User.js'

export const authConfig = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.APP_URL + '/auth/twitter/callback/'
      },
      (token, tokenSecret, profile, cb) => {
        process.nextTick(() => {
          User.findOne(
            {
              'twitter.id': profile.id
            },
            (err, user) => {
              if (err) {
                return cb(err)
              }
              if (user) {
                return cb(null, user)
              } else {
                const newUser = new User()

                newUser.twitter.id = profile.id
                newUser.twitter.username = profile.username
                newUser.twitter.displayName = profile.displayName

                newUser.save(err => {
                  if (err) {
                    throw err
                  }
                  return cb(null, newUser)
                })
              }
            }
          )
        })
      }
    )
  )

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_KEY,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: process.env.APP_URL + '/auth/github/callback/'
      },
      (token, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne(
            {
              'github.id': profile.id
            },
            (err, user) => {
              if (err) {
                return done(err)
              }
              if (user) {
                return done(null, user)
              } else {
                const newUser = new User()

                newUser.github.id = profile.id
                newUser.github.username = profile.username
                newUser.github.displayName = profile.displayName

                newUser.save(err => {
                  if (err) {
                    throw err
                  }
                  return done(null, newUser)
                })
              }
            }
          )
        })
      }
    )
  )
}
