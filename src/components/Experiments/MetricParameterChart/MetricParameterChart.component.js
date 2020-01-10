import React from 'react'

import style from './MetricParameterChart.module.scss'
import DotsChart2D, {
  AXIS_TYPE,
} from '../../Charts/DotsChart2D/DotsChart2D.component'
import {ListSearch} from '../../FormControls/ListSearch/ListSearch.component'
import {TypeActiveTrial} from '../../../context/DefaultState'

type Props = {
  trials: Array<Object>,
  parametersList: Array<string>,
  metricsList: Array<string>,
  metric: string,
  parameter: string,
  activeTrial: TypeActiveTrial,
  onMetricChange: () => {},
  onParameterChange: () => {},
  selectTrialHandler: () => {},
}

export const MetricParameterChart = (props: Props) => {
  return (
    <div className={style.chart}>
      <div className={style.optionsRow}>
        <div className={style.dropdown}>
          <strong>Metric: </strong>
          <ListSearch
            itemsList={props.metricsList.map(p => ({label: p, value: p}))}
            value={props.metric}
            onSelect={props.onMetricChange}
          />
        </div>
        <div className={style.dropdown}>
          <strong>Parameter: </strong>
          <ListSearch
            itemsList={props.parametersList.map(p => ({label: p, value: p}))}
            value={props.parameter}
            onSelect={props.onParameterChange}
          />
        </div>
      </div>
      <DotsChart2D
        trials={props.trials}
        xAxisValueType={AXIS_TYPE.PARAMETER}
        xAxisMetricName={props.parameter}
        yAxisMetricName={props.metric}
        selectTrialHandler={props.selectTrialHandler}
        activeTrial={props.activeTrial}
      />
    </div>
  )
}

export default MetricParameterChart
