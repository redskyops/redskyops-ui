/* eslint-disable-next-line */
import 'bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
/* eslint-disable-next-line */
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
