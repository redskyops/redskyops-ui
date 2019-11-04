import React, {useEffect} from 'react'

import style from './ExperimentsList.module.scss'
import {ExperimentsService} from '../../services/Experiments.service'
import ListSearch from '../FormControls/ListSearch/ListSearch.component'
import {connectWithState} from '../../context/StateContext'

type Props = {
  experiments: Array<Object>,
  activeExperiment: Object,
  updateState: () => any,
}

export const ExperimentsList = (props: Props) => {
  const {experiments = [], activeExperiment = null, updateState} = props
  useEffect(() => {
    const expService = new ExperimentsService()
    const [request, abort] = expService.getExperimentsFactory()
    ;(async () => {
      try {
        const expResponse = await request()
        updateState({
          experiments: {
            ...experiments,
            list: expResponse.experiments,
          },
        })
      } catch (e) {
        updateState({
          experiments: {
            ...experiments,
            error: 'Error loading experiments list',
          },
        })
      }
    })()

    return () => abort()
  }, [])

  const setActiveExperiment = ({index}) => {
    updateState({
      activeExperiment: {
        ...activeExperiment,
        index,
      },
      trials: null,
      activeTrial: null,
    })
  }
  return (
    <div className={style.expList}>
      <div>
        <strong>{experiments.list.length}</strong> experiments loaded
      </div>
      <div className={style.list}>
        <ListSearch
          itemsList={experiments.list.map(e => ({label: e.id, value: e.id}))}
          onSelect={setActiveExperiment}
        />
      </div>
    </div>
  )
}

export default connectWithState(ExperimentsList)
