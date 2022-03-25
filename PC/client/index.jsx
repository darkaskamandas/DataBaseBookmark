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
import App from './components/App.jsx'

//Favicon
import './img/favicon.ico'

//Render
ReactDOM.render(<App />, document.getElementById('app'))
