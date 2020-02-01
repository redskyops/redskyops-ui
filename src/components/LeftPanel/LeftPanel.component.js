import React from 'react'

import ExperimentsList from '../Experiments/ExperimentsList/ExperimentsList.component'
import {connectWithState} from '../../context/StateContext'
import {TypeExperiments} from '../../context/DefaultState'

import style from './LeftPanel.module.scss'
import Icon from '../Icon/Icon.component'

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
          placeholder="FILTER EXPERIMENTS"
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
        <Icon icon="search" width={24} cssClass={style.icon} />
      </div>
      <ExperimentsList />
    </div>
  )
}

export default connectWithState(LeftPanel, [])
