import React from 'react'
import {Route, Switch} from 'react-router-dom'

import ExperimentDetails from '../Experiments/ExperimentDetails/ExperimentDetails.component'

export const Main = () => {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={ExperimentDetails} />
      </Switch>
    </main>
  )
}

export default Main
