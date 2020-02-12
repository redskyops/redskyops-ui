/* eslint-disable-next-line */
import React, {Component} from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import './App.scss'
import Layout from './components/Layout/Layout.component'
import {StateProvider} from './context/StateContext'
import Page404 from './components/Page404/Page404.component'
import ServerDown from './components/ServerDown/ServerDown.component'
import {OperationsService} from './services/OperationsService'

class App extends Component {
  componentDidMount() {
    window.addEventListener('unload', function logData() {
      const opsService = new OperationsService()
      opsService.shutdown()
    })
  }
  render() {
    return (
      <div className="App">
        <Router basename={process.env.REACT_APP_BASE_FOLDER || '/'}>
          <StateProvider>
            <Switch>
              <Route exact path="/" component={Layout} />
              <Route exact path="/server-down" component={ServerDown} />
              <Route path="*" component={Page404} />
            </Switch>
          </StateProvider>
        </Router>
      </div>
    )
  }
}

export default App
