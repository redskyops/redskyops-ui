import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeActiveExperiment,
  TypeExperiments,
  TypeTrials,
  TypeActiveTrial,
} from '../../../context/DefaultState'
import Trials from '../Trials/Trials.component'
import {TrialDetails} from '../TrialDetails/TrialDetails.component'
import {ExperimentsService} from '../../../services/ExperimentsService'

import style from './ExperimentDetails.module.scss'

type Props = {
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  activeTrial: TypeActiveTrial,
  updateState: () => any,
}

export const ExperimentDetails = (props: Props) => {
  const {
    activeExperiment,
    experiments,
    updateState,
    trials,
    activeTrial,
  } = props
  const expService = new ExperimentsService()

  const requestFactory = () =>
    activeExperiment &&
    experiments.list[activeExperiment.index] &&
    experiments.list[activeExperiment.index].metrics &&
    experiments.list[activeExperiment.index].metrics.length > 1
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

  const selectTrial = ({index, trial}) => {
    if (activeTrial && activeTrial.index === index) {
      updateState({
        activeTrial: null,
      })
      return
    }
    updateState({
      activeTrial: {
        ...activeTrial,
        index,
        trial,
      },
    })
  }

  if (!activeExperiment) {
    return (
      <div className={style.expDetails} data-dom-id="exp-details-select">
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
        experiment.metrics.length >= 1
      )
    ) {
      return (
        <div data-dom-id="exp-details-no-metrics">
          No valid metric data found
        </div>
      )
    }

    if (activeExperiment && (!trials || trials.length < 1)) {
      return <div data-dom-id="exp-details-no-trials">No trials found</div>
    }

    return (
      <Trials
        numOfMertics={1}
        trials={trials}
        activeTrial={activeTrial}
        xAxisMetricName={experiment.metrics[0].name}
        yAxisMetricName={experiment.metrics[1].name}
        selectTrialHandler={selectTrial}
      />
    )
  }

  const renderTrialDetails = () => {
    if (!activeTrial) {
      return null
    }

    return (
      <TrialDetails
        trial={activeTrial.trial}
        parameters={experiment.parameters}
        closeHandler={() =>
          updateState({
            activeTrial: null,
          })
        }
      />
    )
  }

  const renderStatus = () => {
    if (!(activeExperiment && trials && trials.length > 0)) {
      return null
    }

    const trialsStatusMap = trials.reduce((acc, t) => {
      if (t.status in acc) {
        acc[t.status].push(t)
        return acc
      }
      return {...acc, ...{[t.status]: [t]}}
    }, {})

    const order = ['completed', 'failed']

    return (
      <div className={style.status}>
        <p>
          <strong data-dom-id="exp-details-trials-total">
            {trials.length}
          </strong>{' '}
          total trials
        </p>
        {Object.keys(trialsStatusMap)
          .sort((s1, s2) => order.indexOf(s1) - order.indexOf(s2))
          .map(status => (
            <p key={status}>
              <strong data-dom-id={`exp-details-trials-${status}`}>
                {trialsStatusMap[status].length}
              </strong>{' '}
              {status} {status === 'completed' ? '(showing)' : ''}
            </p>
          ))}
      </div>
    )
  }

  return (
    <div className={style.expDetails}>
      <h1 className={style.h1}>{experiment.displayName}</h1>
      {renderStatus()}
      {renderTrials()}
      {renderTrialDetails()}
    </div>
  )
}

export default connectWithState(ExperimentDetails, [
  'activeExperiment',
  'experiments',
  'trials',
  'activeTrial',
])
