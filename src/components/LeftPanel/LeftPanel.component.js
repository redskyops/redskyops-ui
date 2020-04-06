import React from 'react'

import ExperimentsList from '../Experiments/ExperimentsList/ExperimentsList.component'
import {connectWithState} from '../../context/StateContext'
import {TypeExperiments, TypeLeftPanel} from '../../context/DefaultState'

import style from './LeftPanel.module.scss'
import Icon from '../Icon/Icon.component'

type TypeProps = {
  experiments: TypeExperiments,
  leftPanel: TypeLeftPanel,
  updateState: () => {},
}

export const LeftPanel = (props: TypeProps) => {
  const {leftPanel, experiments, updateState} = props
  const togglePanel = () => {
    updateState({
      leftPanel: {
        ...leftPanel,
        show: !leftPanel.show,
      },
    })
  }
  return (
    <div className={style.leftPanel}>
      <button
        style={{
          fontSize: '24px',
          paddingLeft: '6px',
          marginTop: '15px',
          backgroundColor: '#F8F8F8',
        }}
        className={`${style.button} fa fa-angle-double-${
          leftPanel.show ? 'left' : 'right'
        }`}
        onClick={togglePanel}
      />
      <div
        className={`${style.outter} ${
          leftPanel.show ? style.expand : style.collapse
        }`}
      >
        <div className={style.inner}>
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
      </div>
    </div>
  )
}

export default connectWithState(LeftPanel, ['experiments', 'leftPanel'])
