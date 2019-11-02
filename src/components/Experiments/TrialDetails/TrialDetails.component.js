import React from 'react'

import style from './TrialDetails.module.scss'

type Props = {
  trial?: Object,
  closeHandler: () => any,
}

export const TrialDetails = (props: Props) => {
  const {trial, closeHandler} = props
  if (!trial) {
    return null
  }

  const renderParameters = () => {
    return trial.assignments.map(para => {
      return (
        <div className={style.parameter} key={para.parameterName}>
          <strong className={style.capitalize}>
            {para.parameterName.replace(/_/g, ' ')}:{' '}
          </strong>
          <span className={style.capitalize}>{para.value}</span>
        </div>
      )
    })
  }

  return (
    <div className={style.trial}>
      <button className={style.close} onClick={closeHandler}>
        <span className="material-icons">close</span>
      </button>
      <h3 className={style.h3}>
        Values
        {trial.labels && 'best' in trial.labels && (
          <span className={`material-icons ${style.icon}`}>check_circle</span>
        )}
      </h3>
      <div className={style.parameter}>
        <strong className={style.capitalize}>
          {trial.values[0].metricName}:
        </strong>{' '}
        {trial.values[0].value}
      </div>
      <div className={style.parameter}>
        <strong className={style.capitalize}>
          {trial.values[1].metricName}:
        </strong>{' '}
        {trial.values[1].value}
      </div>
      <h3 className={style.h3}>Parameters</h3>
      {renderParameters()}
    </div>
  )
}
