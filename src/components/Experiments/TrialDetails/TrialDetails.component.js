import React from 'react'

import style from './TrialDetails.module.scss'
import RangeIndicator from '../RangIndicator/RangeIndicator.component'
import Labels from '../Labels/Labels.component'

type Props = {
  trial?: Object,
  experimentId: string,
  parameters?: Array<Object>,
  closeHandler: () => any,
}

export const TrialDetails = (props: Props) => {
  const {trial, parameters = [], closeHandler, experimentId} = props

  if (!trial) {
    return null
  }

  const parametersMap = parameters.reduce(
    (acc, para) => ({...acc, [para.name]: para}),
    {},
  )

  const isBest = trial.labels && 'best' in trial.labels

  const renderParameters = () => {
    return trial.assignments.map(para => {
      return (
        <div
          className={style.parameter}
          key={para.parameterName}
          data-dom-id={`trial-para-${para.parameterName}`}
        >
          <span className={style.capitalize}>
            <strong>{para.parameterName.replace(/_/g, ' ')}: </strong>
            {para.value}
          </span>
          {para.parameterName in parametersMap && (
            <RangeIndicator
              {...parametersMap[para.parameterName].bounds}
              value={para.value}
              {...(isBest ? {indecatorClass: style.indicatorPink} : null)}
            />
          )}
        </div>
      )
    })
  }

  return (
    <div className={style.trial}>
      <button
        className={style.close}
        onClick={closeHandler}
        data-dom-id="trial-close"
      >
        <span className="material-icons">close</span>
      </button>

      <h3 className={style.h3}>Labels</h3>
      <div className={style.labels}>
        <Labels trial={trial} experimentId={experimentId} />
      </div>

      <h3 className={style.h3}>
        Values
        {isBest && (
          <span className={`material-icons ${style.icon}`}>check_circle</span>
        )}
      </h3>
      <div className={style.parameter} data-dom-id="trial-value-1">
        <strong className={style.capitalize}>
          {trial.values[0].metricName}:
        </strong>{' '}
        {trial.values[0].value}
      </div>
      <div className={style.parameter} data-dom-id="trial-value-2">
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
