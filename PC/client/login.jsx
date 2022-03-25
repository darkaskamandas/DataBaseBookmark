//ES6
import 'babel-polyfill'

//React
import React from 'react'
import ReactDOM from 'react-dom'

//Semantic UI
import 'semantic-ui-css/semantic.min.css'

//SCSS
import sass from './styles/styles.scss'

//App
import LoginPage from './components/LoginPage.jsx'

//Favicon
import './img/favicon.ico'

//Render
ReactDOM.render(<LoginPage />, document.getElementById('login'))
