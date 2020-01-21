import React from 'react'

import ExperimentsList from '../Experiments/ExperimentsList.component'

import style from './LeftPanel.module.scss'

export const LeftPanel = () => {
  return (
    <div className={style.leftPanel}>
      <h1 className={style.title}>Red Sky</h1>
      <ExperimentsList />
    </div>
  )
}

export default LeftPanel
