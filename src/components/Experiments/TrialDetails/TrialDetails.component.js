import React from 'react'

import style from './TrialDetails.module.scss'
// import RangeIndicator from '../RangIndicator/RangeIndicator.component'
// import Labels from '../Labels/Labels.component'
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

  // const isBest = trial.labels && 'best' in trial.labels

  // const renderParameters = () => {
  //   return trial.assignments.map(para => {
  //     return (
  //       <div
  //         className={style.parameter}
  //         key={para.parameterName}
  //         data-dom-id={`trial-para-${para.parameterName}`}
  //       >
  //         <span className={style.capitalize}>
  //           <strong>{para.parameterName.replace(/_/g, ' ')}: </strong>
  //           {para.value}
  //         </span>
  //         {para.parameterName in parametersMap && (
  //           <RangeIndicator
  //             {...parametersMap[para.parameterName].bounds}
  //             value={para.value}
  //             {...(isBest ? {indicatorClass: style.indicatorPink} : null)}
  //           />
  //         )}
  //       </div>
  //     )
  //   })
  // }

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
      {/* <button
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
      {trial.values.map((value, i) => (
        <div
          key={value.metricName}
          className={style.parameter}
          data-dom-id={`trial-value-${i + 1}`}
        >
          <strong className={style.capitalize}>{value.metricName}:</strong>{' '}
          {value.value}
        </div>
      ))}

      <h3 className={style.h3}>Parameters</h3>
      {renderParameters()} */}
    </div>
  )
}

export default TrialDetails
