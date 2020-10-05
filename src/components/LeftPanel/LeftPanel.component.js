import React from 'react'
import {Switch, Route, Link} from 'react-router-dom'

import ExperimentsList from '../Experiments/ExperimentsList/ExperimentsList.component'
import {connectWithState} from '../../context/StateContext'
import {TypeExperiments, TypeLeftPanel} from '../../context/DefaultState'

import style from './LeftPanel.module.scss'
import Icon from '../Icon/Icon.component'
import RangeSlider from '../FormControls/RangeSlider/RangeSllider.component'

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

  const renderSearchList = () => (
    <>
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
    </>
  )

  const renderLink = () => (
    <Link to="/" className={style.homeLink}>
      My Experiments
    </Link>
  )
  return (
    <div className={style.leftPanel}>
      <button
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
          <RangeSlider min={0} max={100} onChange={console.log} />
          <Switch>
            <Route exact path="/" render={renderSearchList} />
            <Route exact path="/helpDocs" render={renderLink} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default connectWithState(LeftPanel, ['experiments', 'leftPanel'])
