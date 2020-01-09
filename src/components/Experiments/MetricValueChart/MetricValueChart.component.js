import React from 'react'

import style from './MetricValueChart.module.scss'
import DotsChart2D, {
  AXIS_TYPE,
} from '../../Charts/DotsChart2D/DotsChart2D.component'
import {ListSearch} from '../../FormControls/ListSearch/ListSearch.component'

type Props = {
  trials: Array<Object>,
  parametersList: Array<string>,
  metricsList: Array<string>,
}

export const MetricValueChart = (props: Props) => {
  return (
    <div className={style.chart}>
      <div className={style.optionsRow}>
        <div className={style.dropdown}>
          <strong>Metric: </strong>
          <ListSearch
            itemsList={props.metricsList.map(p => ({label: p, value: p}))}
            onSelect={console.log}
          />
        </div>
        <div className={style.dropdown}>
          <strong>Parameter: </strong>
          <ListSearch
            itemsList={props.parametersList.map(p => ({label: p, value: p}))}
            onSelect={console.log}
          />
        </div>
      </div>
      <DotsChart2D
        trials={props.trials}
        xAxisValueType={AXIS_TYPE.PARAMETER}
        xAxisMetricName={props.parametersList[0]}
        yAxisMetricName={props.metricsList[0]}
      />
    </div>
  )
}
