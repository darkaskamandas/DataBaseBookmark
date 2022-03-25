'use strict'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//App
import Footer from './Footer.jsx'
import SorcererLoader from './SorcererLoader.jsx'
import LoginBar from './LoginBar.jsx'
import PinWall from './PinWall.jsx'

/*** FUNCTIONS ***/
import { f } from '../../common/common.functions.js'
/*** MAIN ***/
export default class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allPins: [],
      loading: true
    }
  }
  componentDidMount() {
    /* Wizard loader shows in HTML/CSS before React has rendered or if JS is
     * disabled. This function artificially extends page load time to
     * allow more user-generated images to fully load.
     * Also, the wizard loader is cool and users should see it... */
    //Get current allPins, but no autoupdate like in App.jsx
    f('GET', '/api/allPins', response => {
      this.setState({ allPins: response }, () => {
        //Not sure whether it's better to use this here or in componentDidMount
        setTimeout(() => this.setState({ loading: false }), 2000)
      })
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state || nextProps !== this.props) {
      return true
    } else {
      return false
    }
  }
  showLogin() {
    this.setState({ showLogin: true })
  }
  render() {
    const { allPins, loading } = this.state

    return (
      <div>
        <LoginBar />
        {loading ? <SorcererLoader /> : <PinWall logged={false} wallPins={allPins} />}
        <Footer />
      </div>
    )
  }
}
