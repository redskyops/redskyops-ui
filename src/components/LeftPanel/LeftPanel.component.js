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
console.log('slsll')
export const LeftPanel = (props: TypeProps) => {
  const {experiments, updateState} = props
  return (
    <div className={style.leftPanel}>
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
        {!experiments.filter.name && (
          <Icon icon="search" width={24} cssClass={style.icon} />
        )}
        {experiments.filter.name && (
          <button
            className={style.searchClearBtn}
            data-dom-id="left-panel-clear"
            onClick={() => {
              updateState({
                experiments: {
                  ...experiments,
                  filter: {
                    ...experiments.filter,
                    name: '',
                  },
                },
              })
            }}
          >
            <Icon icon="circleX" width={24} cssClass={style.icon} />
          </button>
        )}
      </div>
      <ExperimentsList />
    </div>
  )
}

export default connectWithState(LeftPanel, [])
