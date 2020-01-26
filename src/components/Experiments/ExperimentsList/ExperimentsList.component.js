import React from 'react'

import style from './ExperimentsList.module.scss'
import {ExperimentsService} from '../../../services/ExperimentsService'
import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'

type Props = {
  experiments: Object,
  activeExperiment: Object,
  updateState: () => any,
}

export const ExperimentsList = (props: Props) => {
  const {experiments = {}, activeExperiment = null, updateState} = props
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
    updateState({
      activeExperiment: {
        ...activeExperiment,
        index,
        isLoading: true,
        metricParameterChart: null,
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
      <div className={style.details}>
        <strong data-dom-id="experiments-num">{experiments.list.length}</strong>{' '}
        experiments loaded
      </div>
      <div className={style.list}>
        {experiments.list
          .filter(ex => {
            return (
              !filter ||
              !filter.name ||
              (filter.name.length > 0 &&
                new RegExp(filter.name, 'ig').test(ex.displayName))
            )
          })
          .map((e, i) => {
            let classes = style.btn
            classes +=
              activeExperiment && i === activeExperiment.index
                ? ` ${style.active}`
                : ''
            return (
              <button
                className={classes}
                key={e.id}
                onClick={setActiveExperiment(i)}
              >
                {e.displayName.replace(/-/g, ' ')}
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
