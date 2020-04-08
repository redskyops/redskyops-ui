/* eslint-disable-next-line */
import React, {Component} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import './App.scss'
import Layout from './components/Layout/Layout.component'
import {StateProvider} from './context/StateContext'
import Page404 from './components/Page404/Page404.component'
import BackendHealthCheck from './components/BackendHealthCheck/BackendHealthCheck.component'
import {BASE_URL} from './constants'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router basename={BASE_URL ? BASE_URL : '/'}>
          <StateProvider>
            <BackendHealthCheck>
              <Switch>
                <Route exact path="/" component={Layout} />
                <Route exact path="/helpDocs" component={Layout} />
                <Route path="*" component={Page404} />
              </Switch>
            </BackendHealthCheck>
          </StateProvider>
        </Router>
      </div>
    )
  }
}

export default App
