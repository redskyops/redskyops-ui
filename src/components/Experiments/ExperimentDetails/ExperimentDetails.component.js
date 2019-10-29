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

type Props = {
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  updateState: () => any,
}

export const ExperimentDetails = (props: Props) => {
  const {activeExperiment, experiments, updateState} = props
  const expService = new ExperimentsService()

  const requestFactory = () =>
    activeExperiment
      ? expService.getTrialsFactory({
          id: experiments.list[activeExperiment.index].id, // eslint-disable-line indent
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
