import React from 'react'

import style from './TrialDetails.module.scss'
import ValueDisplay from '../ValueDisplay/ValueDisplay.component'
import Icon from '../../Icon/Icon.component'
import Labels from '../Labels/Labels.component'

type Props = {
  trial?: Object,
  experimentId: string,
  parameters?: Array<Object>,
  closeHandler: () => any,
}

export const TrialDetails = (props: Props) => {
  const {trial, parameters = []} = props

  if (!trial) {
    return null
  }

  const parametersMap = parameters.reduce(
    (acc, para) => ({...acc, [para.name]: para}),
    {},
  )

  const isBest = 'best' in (trial.labels || {})

  return (
    <div className={`${style.trial} ${isBest ? style.best : ''}`}>
      <div className={`${style.column} ${style.metrics} metricsCol`}>
        <h3 className={style.h3}>
          <Icon icon="metrics" width={18} cssClass={style.titleIcon} /> METRICS
        </h3>
        {trial.values.map(metric => (
          <ValueDisplay
            key={metric.metricName}
            name={metric.metricName}
            value={metric.value}
          />
        ))}

        <h3 className={`${style.h3} ${style.spaceTop}`}>
          <Icon icon="pencil" width={18} cssClass={style.titleIcon} /> LABELS
        </h3>
        <Labels />
      </div>
      <div className={`${style.column} ${style.parameters} parametersCol`}>
        <h3 className={style.h3}>
          <Icon icon="parameters" width={18} cssClass={style.titleIcon} />{' '}
          PARAMETERS
        </h3>
        <div className={style.paramList}>
          {trial.assignments.map(para => {
            return (
              <div className={style.parameterWrapper} key={para.parameterName}>
                <ValueDisplay
                  name={para.parameterName.replace(/_/g, ' ')}
                  value={para.value}
                  {...(para.parameterName in parametersMap
                    ? parametersMap[para.parameterName].bounds
                    : null)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TrialDetails
