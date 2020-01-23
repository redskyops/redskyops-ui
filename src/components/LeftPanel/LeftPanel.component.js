import React from 'react'

import ExperimentsList from '../Experiments/ExperimentsList.component'
import {connectWithState} from '../../context/StateContext'
import {TypeExperiments} from '../../context/DefaultState'

import style from './LeftPanel.module.scss'

type TypeProps = {
  experiments: TypeExperiments,
  updateState: () => {},
}

export const LeftPanel = (props: TypeProps) => {
  const {experiments, updateState} = props
  return (
    <div className={style.leftPanel}>
      <h1 className={style.h1}>RED SKY OPS</h1>
      <h4 className={style.h4}>VERSION 2.0</h4>
      <div className={style.search}>
        <input
          type="text"
          className={style.searchInput}
          placeholder="Filter experiments"
          value={experiments.filter.name}
          onChange={e => {
            updateState({
              experiments: {
                ...experiments,
                filter: {
                  ...experiments.filter,
                  name: e.target.value,
                },
              },
            })
          }}
        />
      </div>
      <ExperimentsList />
    </div>
  )
}

export default connectWithState(LeftPanel, [])
