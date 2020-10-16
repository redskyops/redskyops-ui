import React from 'react'

import style from './MetricParameterChart.module.scss'
import DotsChart2D from '../../Charts/DotsChart2D/DotsChart2D.component'
import {AXIS_TYPE} from '../../../constants'
import {ListSearch} from '../../FormControls/ListSearch/ListSearch.component'
import {TypeActiveTrial} from '../../../context/DefaultState'
import Icon from '../../Icon/Icon.component'
import {LabelsFilter} from '../LabelsFilter/LabelsFilter.component'

type Props = {
  trials: Array<Object>,
  parametersList: Array<string>,
  metricsList: Array<string>,
  labelsList: Array<string>,
  metric: string,
  parameter: string,
  activeTrial: TypeActiveTrial,
  labelsFilter: Array<string>,
  metricsRanges: Object,
  onMetricChange: () => {},
  onParameterChange: () => {},
  selectTrialHandler: () => {},
  hoverTrialHandler: () => {},
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
              data-dom-id="metric-param-clear"
              onClick={() => {
                props.onMetricChange()
                props.onParameterChange()
              }}
            >
              <Icon icon="circleX" width={18} className={style.clearIcon} />
              CLEAR
            </button>
          </div>
        )}

        <div className={`${style.metric} ${style.right}`}>
          <LabelsFilter
            labelsList={props.labelsList}
            selectedValues={props.labelsFilter}
            onChange={props.filterChangeHandler}
          />
        </div>
      </div>
      {props.metric && props.parameter && (
        <DotsChart2D
          trials={props.trials}
          xAxisValueType={AXIS_TYPE.PARAMETER}
          xAxisMetricName={props.parameter}
          yAxisMetricName={props.metric}
          selectTrialHandler={props.selectTrialHandler}
          hoverTrialHandler={props.hoverTrialHandler}
          activeTrial={props.activeTrial}
          labelsFilter={props.labelsFilter}
          xAxisRange={{
            min: props.metricsRanges[props.parameter].min,
            max: props.metricsRanges[props.parameter].max,
          }}
          xAxisMinValue={props.metricsRanges[props.parameter].min}
          yAxisRange={{
            min: props.metricsRanges[props.metric].min,
            max: props.metricsRanges[props.metric].max,
          }}
          yAxisMinValue={props.metricsRanges[props.metric].min}
        />
      )}
    </div>
  )
}

export default MetricParameterChart
