'use strict'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//Semantic UI React
import { Button, Header, Image, Input, Modal, Popup, Transition } from 'semantic-ui-react'

/*** Image ***/
//Dummy Image
import dummy from '../img/image.png'

/*** FUNCTIONS ***/
//Common
import { f } from '../../common/common.functions.js'

//Validate image URLs
import isURL from 'validator/lib/isURL'
import blacklist from 'validator/lib/blacklist'

/*** MAIN ***/
export default class NewPin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      image: dummy,
      modalOpen: false,
      title: 'Title',
      visible: false
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleImg = this.handleImg.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTitle = this.handleTitle.bind(this)
  }
  handleClose() {
    //Reset defaults
    this.setState({ error: false, image: dummy, title: 'Title', visible: false })
    //close Modal - this will NOT work if chained to setState like in handleOpen
    //Interval on setTimeout === Transition animation length
    setTimeout(() => this.setState({ modalOpen: false }), 250)
  }
  handleError(e) {
    this.setState({ error: true, image: dummy })
    if (e) {
      e.target.src = dummy //backup at img.src level
    }
  }
  handleImg() {
    const image = document.getElementById('pinImg').value
    //URL is validated by validator package. Must be HTTPS protocol.
    const options = { protocols: ['https'], require_protocol: true }
    if (isURL(image, options)) {
      //If there's a good image, clear the error and display the image
      this.setState({ error: false, image: image })
      return true
    } else {
      // If there's not a valid image link, always show a dummy
      this.handleError()
      return false
    }
  }
  handleOpen() {
    //Open Modal and then toggle visilibility to trigger animation
    this.setState({ modalOpen: true }, () => this.setState({ visible: true }))
  }
  handleSubmit() {
    const { error, image, title } = this.state
    if (this.handleImg() && !error) {
      const obj = {
        img: image,
        owner: this.props.loggedUser,
        title: title !== 'Title' ? title : 'Untitled'
      }
      const data = encodeURIComponent(JSON.stringify(obj))
      f('POST', '/api/savePin/' + data, response => {
        //console.log(response)
        this.handleClose()
      })
    } else {
      this.handleError()
    }
  }
  handleTitle() {
    //Title can be no more than 40 characters and can't contain `{}<>`
    const title = document.getElementById('pinTitle').value
    const safe = blacklist(title, '\\{\\}\\<\\>')
    const t = safe.split('').length
    if (t <= 40) {
      this.setState({
        title: safe
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) {
      return true
    } else {
      return false
    }
  }
  render() {
    const { error, image, modalOpen, title, visible } = this.state

    const newPinModal = (
      <Modal
        closeIcon
        onClose={() => {
          this.handleClose()
        }}
        open={modalOpen}
        size="mini"
      >
        <Modal.Header>New Card</Modal.Header>
        <Modal.Content>
          <div className="newpin">
            <Header as="h1" textAlign="center">
              {title}
            </Header>
            <Image alt={title} onError={this.handleError} src={image} />
            <Popup
              className="hintPopup"
              content="Please use less than 40 characters"
              flowing
              header="Add a title for your Card"
              on="focus"
              position="left center"
              trigger={
                <Input
                  id="pinTitle"
                  onChange={this.handleTitle}
                  placeholder="My Amazing Fantasy Card"
                  style={{ marginTop: 6 }}
                />
              }
            />
            <Popup
              className="hintPopup"
              content="Please use a valid image URL that starts with HTTPS"
              flowing
              header="Paste a link to an image"
              on="focus"
              position="left center"
              trigger={
                <Input
                  id="pinImg"
                  onChange={this.handleImg}
                  placeholder="https://www.website.com/photo.jpg"
                  style={{ marginTop: 6 }}
                />
              }
            />
            <Button
              style={{ marginTop: 6 }}
              color={error ? 'red' : 'blue'}
              onClick={() => this.handleSubmit()}
            >
              {error ? 'Image required!' : 'Submit'}
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    )

    return (
      <span>
        <Button color="blue" content="New Card" onClick={() => this.handleOpen()} icon="plus" />
        <Transition animation="scale" duration={250} visible={visible}>
          {newPinModal}
        </Transition>
      </span>
    )
  }
}
