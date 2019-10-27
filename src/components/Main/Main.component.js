import React from 'react'
import {Route, Switch} from 'react-router-dom'

import ExperimentsList from '../Experiments/ExperimentsList.component'
import Page404 from '../Page404/Page404.component'

export const Main = () => {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={ExperimentsList} />
        <Route path="*" component={Page404} />
      </Switch>
    </main>
  )
}

export default Main
