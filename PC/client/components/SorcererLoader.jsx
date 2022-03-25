'use strict'

/*** COMPONENTS ***/
//React
import React from 'react'

//Semantic UI React
import { Dimmer } from 'semantic-ui-react'

/*** MAIN ***/
/* This is a duplicate of the loader HTML in login.html and index.html
 * and uses the same SCSS. Built here in React for use in components. */
const SorcererLoader = () => {
  return (
    <Dimmer active>
      <div className="loader">
        <div className="circ">
          <div className="swirl">
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <div>
                        <div>
                          <div>
                            <div>
                              <div />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="hands">
              <div className="sleeveFold" />
            </div>
          </div>
          <div className="head">
            <div className="eye" />
            <div className="nose" />
            <div className="cheeks" />
            <div className="lip" />
            <div className="beard" />
          </div>
        </div>
      </div>
    </Dimmer>
  )
}

export default SorcererLoader
