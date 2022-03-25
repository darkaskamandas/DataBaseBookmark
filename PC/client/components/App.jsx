'use strict'

/*** ENVIRONMENT ***/
import dotenv from 'dotenv'
dotenv.load()

/*** DEVELOPMENT TOOLS ***/
const DEV = process.env.NODE_ENV === 'development'
if (DEV) {
  console.log('Development mode')
}

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//App
import Footer from './Footer.jsx'
import SorcererLoader from './SorcererLoader.jsx'
import LoginBar from './LoginBar.jsx'
import NavBar from './NavBar.jsx'
import PinWall from './PinWall.jsx'

/*** FUNCTIONS ***/
import { f } from '../../common/common.functions.js'
import { start } from '../controllers/socket.client.jsx'

/*** MAIN ***/
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      logged: true,
      loggedUser: 'Client',
      allPins: [],
      showLoggedUserPins: false,
      showAllPins: true
    }
    this.loggedUser = this.loggedUser.bind(this)
    this.showAllPins = this.showAllPins.bind(this)
    this.showLoggedUserPins = this.showLoggedUserPins.bind(this)
  }
  start(user) {
    if (DEV) {
      console.log('Calling start function; user:', user)
    }
    //Indicates Web Socket connection
    const cb1 = response => {
      if (DEV) {
        console.log(response)
      }
    }
    //Keeps allPins up to date for all users without browser refresh
    const cb2 = response => {
      /* Update only if the two arrays of objects are different. *
       * Checking for string equality here is a quick, easy test.*/
      if (JSON.stringify(response) !== JSON.stringify(this.state.allPins)) {
        this.setState({ allPins: response })
      }
    }
    start(1000, cb1, cb2)
    console.log('Welcome, ' + user + '!')
  }
  loggedUser() {
    f('GET', '/api/users/logged', response => {
      if (DEV) {
        console.log('Received username:', response)
      }
      this.setState({ loggedUser: response })
      //Start web socket updates
      this.start(response)
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true
    } else {
      return false
    }
  }
  showAllPins() {
    this.setState({ showAllPins: true, showLoggedUserPins: false })
  }
  showLoggedUserPins() {
    this.setState({ showAllPins: false, showLoggedUserPins: true })
  }
  componentDidMount() {
    //Show SorcererLoader until component mounts
    //  this.setState({ loading: false })
    //Briefly show loader while images continue to load
    setTimeout(() => this.setState({ loading: false }), 1000)
  }

  componentWillMount() {
    this.loggedUser()
  }
  render() {
    const { allPins, logged, loading, loggedUser, showLoggedUserPins } = this.state
    //Filter allPins for those made by the loggedUser
    const loggedUserPins = allPins.filter(item => {
      return item.owner === loggedUser
    })

    if (loading) {
      return (
        <div>
          <LoginBar />
          <SorcererLoader />
          <Footer />
        </div>
      )
    }

    return (
      <div>
        <header>
          <nav>
            <NavBar
              showAllPins={this.showAllPins}
              showLoggedUserPins={this.showLoggedUserPins}
              loggedUser={loggedUser}
            />
          </nav>
        </header>
        <main>
          {showLoggedUserPins ? (
            <PinWall logged={logged} wallPins={loggedUserPins} loggedUser={loggedUser} />
          ) : (
            <PinWall logged={logged} wallPins={allPins} loggedUser={loggedUser} />
          )}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    )
  }
}
