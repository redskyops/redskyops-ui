import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeActiveExperiment,
  TypeExperiments,
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
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
  labels: TypeLabels,
  updateState: () => any,
}

export const ExperimentDetails = (props: Props) => {
  const {
    activeExperiment,
    experiments,
    updateState,
    trials,
    activeTrial,
    labels,
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
      labels: {
        ...labels,
        postingNewLabel: false,
        postingDelLabel: false,
        newLabel: '',
        labelToDelete: '',
      },
    })
  }

  const labelClick = label => e => {
    e.preventDefault()
    if (label === 'ALL') {
      updateState({
        experiments: {
          ...experiments,
          labelsFilter: [],
        },
      })
      return
    }
    const newFilter = [...experiments.labelsFilter]
    const targetIndex = newFilter.indexOf(label)
    if (targetIndex < 0) {
      newFilter.push(label)
    } else {
      newFilter.splice(targetIndex, 1)
    }
    updateState({
      experiments: {
        ...experiments,
        labelsFilter: newFilter,
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
        experiment.metrics.length > 1
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
        trials={trials}
        activeTrial={activeTrial}
        xAxisMetricName={experiment.metrics[0].name}
        yAxisMetricName={experiment.metrics[1].name}
        selectTrialHandler={selectTrial}
        labelsFilter={experiments.labelsFilter}
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
        experimentId={experiments.list[activeExperiment.index].id}
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

  const renderLabels = () => {
    if (!trials || trials.length < 1) {
      return null
    }
    const allLabels = trials.reduce((acc, {labels}) => {
      return labels
        ? [...acc, ...Object.keys(labels).filter(l => acc.indexOf(l) < 0)]
        : acc
    }, [])

    return (
      <div className={style.labels}>
        <h2 className={style.h2}>Filter by label:</h2>
        <div className={style.labelInner}>
          {allLabels.map(l => {
            return (
              <button
                data-dome-id="exp-details-label"
                className={style.label}
                key={l}
                onClick={labelClick(l)}
              >
                <span className={`material-icons ${style.checkbox}`}>
                  {experiments.labelsFilter.indexOf(l) < 0
                    ? 'check_box_outline_blank'
                    : 'check_box'}
                </span>{' '}
                {l}
              </button>
            )
          })}
          {experiments.labelsFilter.length > 0 && (
            <button
              data-dome-id="exp-details-show-all"
              className={style.label}
              onClick={labelClick('ALL')}
            >
              Show all labels
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={style.expDetails}>
      <h1 className={style.h1}>
        {experiment.displayName} / {experiment.id}
      </h1>
      {renderStatus()}
      {renderLabels()}
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
