/* eslint-disable-next-line */
import React, {Component} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'

import './App.scss'
import {Layout} from './components/Layout/Layout.component'
import {StateProvider} from './context/StateContext'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router basename={'/ui'}>
          <StateProvider>
            <Layout />
          </StateProvider>
        </Router>
      </div>
    )
  }
}

export default App
