'use strict'

/*** COMPONENTS ***/
//React
import React, { Component } from 'react'

//Masonry
import Masonry from 'react-masonry-component'

//Semantic UI React
import { Container } from 'semantic-ui-react'

//App
import Pin from './Pin.jsx'

/*** MAIN ***/
const PinWall = ({ wallPins, logged, loggedUser }) => {
  const masonryOptions = {
    transitionDuration: 250
  }
  const show = wallPins.map((item, index) => {
    //Check to see if the loggedUser liked the Pin already
    const loggedUserLike = item.likes.indexOf(loggedUser) >= 0 ? true : false

    return (
      <Pin
        key={index}
        img={item.img}
        likes={item.likes}
        logged={logged}
        loggedUser={loggedUser}
        loggedUserLike={loggedUserLike}
        owner={item.owner}
        title={item.title}
      />
    )
  })
  return (
    <Container fluid className="pinWall">
      <Masonry options={masonryOptions}>{show}</Masonry>
    </Container>
  )
}

export default PinWall
