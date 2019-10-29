import React from 'react'
import {Route, Switch} from 'react-router-dom'

import ExperimentDetails from '../Experiments/ExperimentDetails/ExperimentDetails.component'
import Page404 from '../Page404/Page404.component'

export const Main = () => {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={ExperimentDetails} />
        <Route path="*" component={Page404} />
      </Switch>
    </main>
  )
}

export default Main
