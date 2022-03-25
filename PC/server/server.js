'use strict'

/*** ES6+ ***/
import 'babel-polyfill'
import Promise from 'es6-promise'
Promise.polyfill()
import 'isomorphic-fetch'

/*** EXPRESS ***/
import express from 'express'
const app = express()

/*** ENVIRONMENT ***/
const path = process.cwd()
import dotenv from 'dotenv'
dotenv.load()

/*** DEVELOPMENT TOOLS ***/
const DEV = process.env.NODE_ENV === 'development'
const PROD = process.env.NODE_ENV === 'production'
import morgan from 'morgan'
DEV ? app.use(morgan('dev')) : app.use(morgan('tiny'))
if (DEV) {
  console.log('Development mode')
}

/*** ENABLE COMPRESSION ***/
import compression from 'compression'
if (PROD) {
  app.use(compression())
}

/*** MIDDLEWARE ***/
app.use('/js', express.static(path + '/dist/js')) //The first argument creates the virtual directory used in index.html
app.use('/styles', express.static(path + '/dist/styles'))
app.use('/img', express.static(path + '/dist/img'))
app.use('/fonts', express.static(path + '/dist/fonts'))

/*** MONGOOSE ***/
import mongoose from 'mongoose'
const db = mongoose.connection
mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true }, (err, db) => {
  if (err) {
    console.error('Failed to connect to database!')
  } else {
    console.log('Connected to database.')
  }
})

/*** AUTHENTICATION ***/
import session from 'express-session'
import passport from 'passport'

import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session)

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

let sess = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: 1800000 //30 minutes
  },
  store: new MongoStore({ mongooseConnection: db }, err => {
    console.error(err)
  }), //defaults to MemoryStore instance, which can cause memory leaks
  name: 'id'
}

if (PROD) {
  app.set('trust proxy', 1)
  sess.cookie.secure = true //serve secure cookies in production
  sess.cookie.httpOnly = true
}

app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())

/*** ROUTES ***/
import { routes } from './routes/index.server.js'
import { authConfig } from './config/authConfig.js'
authConfig(passport)
routes(app, passport)

/*** WEB SOCKETS ***/
import http from 'http'
const server = http.createServer(app)
import socket from 'socket.io'
const io = socket(server)
import ioEvents from './routes/socket.server.js'
ioEvents(io)

/*** SERVE ***/
const port = process.env.PORT
server.listen(port, () => {
  console.log('Server is listening on port ' + port + '.')
})
