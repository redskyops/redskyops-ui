import React from 'react'

import style from './TrialDetails.module.scss'
import RangeIndicator from '../RangIndicator/RangeIndicator.component'

type Props = {
  trial?: Object,
  parameters?: Array<Object>,
  closeHandler: () => any,
}

export const TrialDetails = (props: Props) => {
  const {trial, parameters = [], closeHandler} = props
  if (!trial) {
    return null
  }

  const parametersMap = parameters.reduce(
    (acc, para) => ({...acc, [para.name]: para}),
    {},
  )
  console.log(parametersMap)
  const renderParameters = () => {
    return trial.assignments.map(para => {
      return (
        <div className={style.parameter} key={para.parameterName}>
          <span className={style.capitalize}>
            <strong>{para.parameterName.replace(/_/g, ' ')}: </strong>
            {para.value}
          </span>
          {para.parameterName in parametersMap && (
            <RangeIndicator
              {...parametersMap[para.parameterName].bounds}
              value={para.value}
            />
          )}
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
