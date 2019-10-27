import React, {useEffect} from 'react'

import style from './ExperimentsList.module.scss'
import {ExperimentsService} from '../../services/Experiments.service'
import ListSearch from '../FormControls/ListSearch/ListSearch.component'
import {connectWithState} from '../../context/StateContext'

type Props = {
  experiments: Array<Object>,
  updateState: () => any,
}

export const ExperimentsList = (props: Props) => {
  const {experiments = [], updateState} = props
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
  return (
    <div className={style.expList}>
      <div>
        <strong>{experiments.list.length}</strong> experiments loaded
      </div>
      <div className={style.list}>
        <ListSearch />
      </div>
    </div>
  )
}

export default connectWithState(ExperimentsList)
