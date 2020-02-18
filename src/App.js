/* eslint-disable-next-line */
import React, {Component} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import './App.scss'
import Layout from './components/Layout/Layout.component'
import {StateProvider} from './context/StateContext'
import Page404 from './components/Page404/Page404.component'
import BackendHealthCheck from './components/BackendHealthCheck/BackendHealthCheck.component'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router basename={process.env.REACT_APP_BASE_FOLDER || '/'}>
          <StateProvider>
            <BackendHealthCheck>
              <Switch>
                <Route exact path="/" component={Layout} />
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
