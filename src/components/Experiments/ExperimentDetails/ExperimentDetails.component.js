import React from 'react'

import {connectWithState} from '../../../context/StateContext'

import style from './ExperimentDetails.module.scss'

type Props = {
  activeExperiment: {
    index: Number,
  },
  experiments: {
    list: Array<Object>,
  },
}

export const ExperimentDetails = (props: Props) => {
  const {activeExperiment, experiments} = props

  if (!activeExperiment) {
    return <div>Select an experiment!</div>
  }
  const experiment = experiments.list[activeExperiment.index] || {}

  return (
    <div className={style.expDetails}>
      <h1>
        {experiment.displayName} / {experiment.id}
      </h1>
    </div>
  )
}

export default connectWithState(ExperimentDetails, [
  'activeExperiment',
  'experiments',
])
