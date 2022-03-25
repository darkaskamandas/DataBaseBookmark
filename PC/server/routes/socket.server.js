'use strict'

/*** ENVIRONMENT ***/
const path = process.cwd()
import dotenv from 'dotenv'
dotenv.load()

/*** DEVELOPMENT TOOLS ***/
const DEV = process.env.NODE_ENV === 'development'

/*** CONTROLLER ***/
import { updateAllPins } from '../controllers/pinController.server.js'

/*** Web Socket Events ***/
const ioEvents = io => {
  io.on('connection', serverSocket => {
    if (DEV) {
      console.log('Web Sockets connected.')
    }
    //Callback 1
    serverSocket.emit('start', 'Regular communications received...')

    //Callback 2
    serverSocket.on('start', received => {
      setInterval(() => {
        updateAllPins(serverSocket, 'updateAllPins')
      }, received)
    })

    io.on('disconnect', () => {
      console.log('Web Sockets disconnected.')
    })
  })
}

export default ioEvents
