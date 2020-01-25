import React from 'react'

import style from './TrialDetails.module.scss'
import ValueDisplay from '../ValueDisplay/ValueDisplay.component'

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

  return (
    <div className={style.trial}>
      <div className={`${style.column} ${style.metrics}`}>
        <h3 className={style.h3}>METRICS</h3>
        {trial.values.map(metric => (
          <ValueDisplay
            key={metric.metricName}
            name={metric.metricName}
            value={metric.value}
          />
        ))}
      </div>
      <div className={`${style.column} ${style.parameters}`}>
        <h3 className={style.h3}>PARAMETERS</h3>
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
