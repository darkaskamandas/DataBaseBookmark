'use strict'

/*** ENVIRONMENT ***/
import dotenv from 'dotenv'
dotenv.load()

/*** DEVELOPMENT TOOLS ***/
const DEV = process.env.NODE_ENV === 'development'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//Semantic UI React
import { Icon, Transition } from 'semantic-ui-react'

/*** FUNCTIONS ***/
//Common
import { f } from '../../common/common.functions.js'

/*** MAIN ***/
export default class Like extends Component {
  constructor(props) {
    super(props)
    const { likes, loggedUserLike } = this.props
    this.state = {
      /* empty and full are used for the Like/Unlike animation - directly
       * checking this.props.loggedUserLike in <Transition/> doesn't work */
      empty: !loggedUserLike,
      full: loggedUserLike,
      likes: likes.length,
      pulse: true,
      noClick: false
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      empty: !nextProps.loggedUserLike,
      full: nextProps.loggedUserLike,
      likes: nextProps.likes.length
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state || nextProps !== this.props) {
      return true
    } else {
      return false
    }
  }
  toggleLikePin() {
    const { img, logged, loggedUser, owner, title } = this.props
    const { empty, full, likes, pulse } = this.state
    //Only logged users can Like a post
    if (logged) {
      //Quick, client-only response
      this.setState({
        empty: !empty,
        full: !full,
        likes: full ? likes - 1 : likes + 1,
        pulse: !pulse,
        noClick: true //Disable clicking on Like until the first response clears
      })

      const obj = {
        img: img,
        loggedUser: loggedUser,
        owner: owner,
        title: title
      }
      const data = encodeURIComponent(JSON.stringify(obj))
      f('POST', 'api/toggleLikePin/' + data, response => {
        if (DEV) {
          console.log(response)
        }
        //Enable clicking on Like on response
        this.setState({ noClick: false })
      })
    }
  }
  render() {
    const { logged } = this.props
    const { full, empty, likes, noClick, pulse } = this.state

    return (
      <span>
        <Transition animation="pulse" duration={500} visible={pulse}>
          <Icon
            link
            name={full ? 'heart' : 'empty heart'}
            size="large"
            className={logged ? null : 'noLike'}
            color={full ? 'red' : 'grey'}
            onClick={() => {
              if (!noClick) {
                this.toggleLikePin()
              } else {
                console.log('Patience...')
              }
            }}
          />
        </Transition>
        {likes}
      </span>
    )
  }
}
