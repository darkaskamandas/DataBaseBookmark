'use strict'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//Semantic UI React
import { Button, Header, Container, Image, Icon, Menu, Modal, Transition } from 'semantic-ui-react'

/*** RESOURCES ***/
//Satyr
import glowsatyr from '../img/Glowing-Black-Satyr.png'
import satyr from '../img/Black-Satyr.png'

/*** MAIN ***/
export default class LoginBar extends Component {
  constructor(props) {
    super(props)
    this.state = { modalOpen: false, visible: false }
  }
  handleClose() {
    //Toggle visibility to trigger animation
    this.setState({ visible: false })
    //close Modal - this will NOT work if chained to setState like in handleOpen
    //Interval on setTimeout === Transition animation length
    setTimeout(() => this.setState({ modalOpen: false }), 250)
  }
  handleOpen() {
    //Open Modal and then toggle visilibility to trigger animation
    this.setState({ modalOpen: true }, () => this.setState({ visible: true }))
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state || nextProps !== this.props) {
      return true
    } else {
      return false
    }
  }
  render() {
    const { modalOpen, visible } = this.state

    const loginModal = (
      <Modal closeIcon onClose={() => this.handleClose()} open={modalOpen} size="mini">
        <Image
          alt="Satyr logo"
          centered
          height="75px"
          src={satyr}
          style={{ marginTop: 13, marginBottom: -2 }}
        />
        <Modal.Header>
          <Header textAlign="center" className="fantasyFont">
            Welcome to Sorcerer City
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header as="h3" textAlign="center" style={{ marginBottom: -2 }}>
              Click below to log in.
            </Header>
            <br />
          </Modal.Description>
          <Button fluid color="grey" href="/auth/github">
            <Icon name="github" />Continue with GitHub
          </Button>
          <br />
          <Button fluid color="twitter" href="/auth/twitter">
            <Icon name="twitter" />Continue with Twitter
          </Button>
        </Modal.Content>
      </Modal>
    )

    return (
      <Menu fixed="top" inverted stackable>
        <Container>
          <Menu.Item header style={{ fontSize: '120%' }} className="fantasyFont">
            <Image alt="Glowing Black Satyr" src={glowsatyr} className="navSatyr" />
            Welcome to Sorcerer City, a fantasy-themed inspiration engine
          </Menu.Item>
          <Menu.Item as="a" position="right" onClick={() => this.handleOpen()}>
            Login
          </Menu.Item>
          <Transition visible={visible} animation="scale" duration={250}>
            {loginModal}
          </Transition>
        </Container>
      </Menu>
    )
  }
}
