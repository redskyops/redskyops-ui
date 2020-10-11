import React from 'react'

import style from './ExperimentsList.module.scss'
import {ExperimentsService} from '../../../services/ExperimentsService'
import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'

const FIRST_METRIC_NAME = 'cost'

type Props = {
  experiments: Object,
  activeExperiment: Object,
  updateState: () => any,
}

const getMetricsList = experiment => {
  return (experiment.metrics || [])
    .sort(m => (m.name === FIRST_METRIC_NAME ? -1 : 1))
    .map(({name}) => name)
}

const getParametersList = experiment => {
  return (experiment.parameters || []).map(({name}) => name)
}

export const ExperimentsList = (props: Props) => {
  const {experiments = {list: []}, activeExperiment = null, updateState} = props
  const {filter} = experiments
  const expService = new ExperimentsService()

  const requestFactory = () =>
    experiments.loading ? expService.getExperimentsFactory({limit: 500}) : null

  const requestSuccess = expResponse => {
    updateState({
      experiments: {
        ...experiments,
        list: expResponse.experiments,
        loading: false,
      },
    })
  }

  const requestError = () => {
    updateState({
      experiments: {
        ...experiments,
        error: 'Error loading experiments list',
        loading: false,
      },
    })
  }

  useApiCallEffect(requestFactory, requestSuccess, requestError, [
    experiments.loading,
  ])

  const setActiveExperiment = index => () => {
    const metricsList = getMetricsList(experiments.list[index])
    const parametersList = getParametersList(experiments.list[index])

    updateState({
      activeExperiment: {
        ...activeExperiment,
        index,
        metricsList,
        parametersList,
        isLoading: true,
        metricParameterChart: null,
        labelsFilter: [],
        tab: 0,
        xAxisMetric: metricsList[0],
        ...(metricsList.length >= 2 ? {yAxisMetric: metricsList[1]} : null),
        ...(metricsList.length >= 3 ? {zAxisMetric: metricsList[2]} : null),
      },
      experiments: {
        ...experiments,
        labelsFilter: [],
      },
      trials: null,
      activeTrial: null,
    })
  }

  return (
    <div className={style.expList}>
      {experiments.error && (
        <div data-dom-id="experiments-error" className={style.details}>
          {experiments.error}
        </div>
      )}
      {!experiments.error && (
        <div className={style.details}>
          <strong data-dom-id="experiments-num">
            {experiments.list.length}
          </strong>{' '}
          experiments loaded
        </div>
      )}
      <div className={style.list}>
        {experiments.list
          .map((exp, index) => ({...exp, index}))
          .filter(ex => {
            return (
              !filter ||
              !filter.name ||
              (filter.name.length > 0 &&
                new RegExp(filter.name, 'ig').test(ex.displayName))
            )
          })
          .map(exp => {
            let classes = style.btn
            classes +=
              activeExperiment && exp.index === activeExperiment.index
                ? ` ${style.active}`
                : ''
            return (
              <button
                className={classes}
                key={exp.id}
                onClick={setActiveExperiment(exp.index)}
              >
                {exp.displayName.replace(/-/g, ' ')}
              </button>
            )
          })}
      </div>
    </div>
  )
}

export default connectWithState(ExperimentsList, [
  'experiments',
  'activeExperiment',
])
