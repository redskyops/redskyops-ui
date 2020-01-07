import React from 'react'

import style from './MetricValueChart.module.scss'
import DotsChart2D from '../../Charts/DotsChart2D/DotsChart2D.component'

type Props = {
  trials: Array<Object>,
  parametersList: Array<string>,
  metricsList: Array<string>,
}

export const MetricValueChart = (props: Props) => {
  return (
    <div className={style.chart}>
      <DotsChart2D
        trials={props.trials}
        xAxisMetricName={props.parametersList[0]}
        xAxisValueType="parameter"
        yAxisMetricName={props.metricsList[0]}
      />
    </div>
  )
}
