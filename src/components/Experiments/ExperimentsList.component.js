import React, {useEffect} from 'react'

import style from './Experiments.module.scss'
import {ExperimentsService} from '../../services/Experiments.service'
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
        console.log(e)
      }
    })()

    return () => abort()
  }, [])
  return (
    <div className={style.expList}>
      <pre>
        {experiments.list.map(e => (
          <h3 key={e.id}>
            {e.displayName}/{e.id}
          </h3>
        ))}
      </pre>
    </div>
  )
}

export default connectWithState(ExperimentsList)
