'use strict'

/*** COMPONENTS ***/
//React
import React from 'react'

//Semantic UI React
import { Container, Icon, Menu } from 'semantic-ui-react'

/*** MAIN ***/
const Footer = () => {
  return (
    <Menu fixed="bottom" inverted stackable>
      <Container>
        <Menu.Item
          as="a"
          href="https://github.com/CharmedSatyr-freeCodeCamp/pinterest_clone/"
          rel="noopener"
          target="_blank"
        >
          Designed and coded by &nbsp;<Icon fitted name="github" /> CharmedSatyr
        </Menu.Item>
        <Menu.Item
          as="a"
          href="https://github.com/CharmedSatyr-freeCodeCamp/pinterest_clone/blob/master/LICENSE"
          rel="noopener"
          target="_blank"
        >
          GNU General Public License v3.0
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default Footer
