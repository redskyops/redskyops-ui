import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {ExperimentsService} from '../../../services/Experiments.service'

import style from './ExperimentDetails.module.scss'

import {
  TypeActiveExperiment,
  TypeExperiments,
  TypeTrials,
} from '../../../context/DefaultState'
import Trials from '../Trials/Trials.component'

type Props = {
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  updateState: () => any,
}

export const ExperimentDetails = (props: Props) => {
  const {activeExperiment, experiments, updateState, trials} = props
  const expService = new ExperimentsService()

  const requestFactory = () =>
    activeExperiment
      ? expService.getTrialsFactory({
          name: experiments.list[activeExperiment.index].id, // eslint-disable-line indent
        }) // eslint-disable-line indent
      : null
  const requestSuccess = ({trials}) => {
    updateState({
      trials,
    })
  }
  const requestError = e => console.log(e)

  useApiCallEffect(requestFactory, requestSuccess, requestError, [
    activeExperiment,
  ])

  if (!activeExperiment) {
    return (
      <div className={style.expDetails}>
        <h1 className={style.h1}>Select an experiment!</h1>
      </div>
    )
  }
  const experiment = experiments.list[activeExperiment.index] || {}

  const renderTrials = () => {
    if (
      !(
        activeExperiment &&
        experiment &&
        experiment.metrics &&
        experiment.metrics.length > 1
      )
    ) {
      return <div>No valid metric data found</div>
    }

    if (!(activeExperiment && trials && trials.length > 0)) {
      return <div>No trials found</div>
    }

    return (
      <Trials
        trials={trials}
        xAxisMetricName={experiment.metrics[0].name}
        yAxisMetricName={experiment.metrics[1].name}
      />
    )
  }
  return (
    <div className={style.expDetails}>
      <h1 className={style.h1}>
        {experiment.displayName} / {experiment.id}
      </h1>
      {renderTrials()}
    </div>
  )
}

export default connectWithState(ExperimentDetails, [
  'activeExperiment',
  'experiments',
  'trials',
])
