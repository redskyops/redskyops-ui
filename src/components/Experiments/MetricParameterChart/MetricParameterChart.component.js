import React from 'react'

import style from './MetricParameterChart.module.scss'
import DotsChart2D, {
  AXIS_TYPE,
} from '../../Charts/DotsChart2D/DotsChart2D.component'
import {ListSearch} from '../../FormControls/ListSearch/ListSearch.component'
import {ListSearchMulti} from '../../FormControls/ListSearchMulti/ListSearchMulti.component'
import {TypeActiveTrial} from '../../../context/DefaultState'
import Icon from '../../Icon/Icon.component'

type Props = {
  trials: Array<Object>,
  parametersList: Array<string>,
  metricsList: Array<string>,
  labelsList: Array<string>,
  metric: string,
  parameter: string,
  activeTrial: TypeActiveTrial,
  labelsFilter: Array<string>,
  onMetricChange: () => {},
  onParameterChange: () => {},
  selectTrialHandler: () => {},
  filterChangeHandler: () => {},
}

export const MetricParameterChart = (props: Props) => {
  return (
    <div className={style.chart}>
      <div className={style.optionsRow}>
        <div className={style.metric}>
          <Icon icon="metrics" width={18} cssClass={style.icon} />
          METRIC
          <div className={style.dropdown}>
            <ListSearch
              itemsList={props.metricsList.map(p => ({
                label: p.toUpperCase().replace(/_/g, ' '),
                value: p,
              }))}
              value={props.metric}
              onSelect={props.onMetricChange}
              placeholder="SELECT"
            />
          </div>
        </div>
        <div className={style.metric}>
          <Icon icon="parameters" width={18} cssClass={style.icon} />
          PARAMETER
          <div className={style.dropdown}>
            <ListSearch
              itemsList={props.parametersList.map(p => ({
                label: p.toUpperCase().replace(/_/g, ' '),
                value: p,
              }))}
              value={props.parameter}
              onSelect={props.onParameterChange}
              placeholder="SELECT"
            />
          </div>
        </div>

        {props.metric && props.parameter && (
          <div className={style.metric}>
            <button
              className={style.button}
              onClick={() => {
                props.onMetricChange()
                props.onParameterChange()
              }}
            >
              CLEAR
            </button>
          </div>
        )}

        <div className={`${style.metric} ${style.right}`}>
          <Icon icon="filter" width={18} cssClass={style.icon} />
          <div className={style.dropdown}>
            <ListSearchMulti
              itemsList={props.labelsList.map(p => ({
                label: p.toUpperCase().replace(/_/g, ' '),
                value: p,
              }))}
              value={props.labelsFilter}
              onChange={props.filterChangeHandler}
              placeholder="FILTER BY"
            />
          </div>
        </div>
      </div>
      {props.metric && props.parameter && (
        <DotsChart2D
          trials={props.trials}
          xAxisValueType={AXIS_TYPE.PARAMETER}
          xAxisMetricName={props.parameter}
          yAxisMetricName={props.metric}
          selectTrialHandler={props.selectTrialHandler}
          activeTrial={props.activeTrial}
          labelsFilter={props.labelsFilter}
        />
      )}
    </div>
  )
}

export default MetricParameterChart
