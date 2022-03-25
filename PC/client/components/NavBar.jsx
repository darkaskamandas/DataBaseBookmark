'use strict'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//Semantic UI React
import { Container, Image, Menu } from 'semantic-ui-react'

//App
import NewPin from './NewPin.jsx'

/*** RESOURCES ***/
//Satyr
import glowsatyr from '../img/Glowing-Black-Satyr.png'

/*** MAIN ***/
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: 'showAllPins'
    }
  }
  //These functions entirely exist to make the pointers point
  handleLoggedUserPinsClick() {
    this.setState({ activeItem: 'showLoggedUserPins' })
    this.props.showLoggedUserPins()
  }
  handleAllPinsClick() {
    this.setState({ activeItem: 'showAllPins' })
    this.props.showAllPins()
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state || nextProps !== this.props) {
      return true
    } else {
      return false
    }
  }
  render() {
    const { activeItem } = this.state
    const { loggedUser } = this.props
    return (
      <Menu fixed="top" inverted pointing stackable>
        <Container>
          <Menu.Item header style={{ fontSize: '120%' }} className="fantasyFont">
            <Image alt="Glowing Black Satyr" src={glowsatyr} className="navSatyr" />
            Welcome, {loggedUser}
          </Menu.Item>
          <Menu.Item>
            <NewPin loggedUser={loggedUser} />
          </Menu.Item>
          <Menu.Item
            active={activeItem === 'showLoggedUserPins'}
            as="a"
            onClick={() => {
              this.handleLoggedUserPinsClick()
            }}
          >
            Your Cards
          </Menu.Item>
          <Menu.Item
            active={activeItem === 'showAllPins'}
            as="a"
            onClick={() => {
              this.handleAllPinsClick()
            }}
          >
            Recent Cards
          </Menu.Item>
          <Menu.Item as="a" href="/logout" position="right">
            Log Out
          </Menu.Item>
        </Container>
      </Menu>
    )
  }
}
