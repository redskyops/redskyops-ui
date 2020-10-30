import React from 'react'

import {TypeTrials, TypeActiveExperiment} from '../../../context/DefaultState'
import RangeSlider from '../../FormControls/RangeSlider/RangeSlider.component'
import Icon from '../../Icon/Icon.component'
import style from './TrialsStatistics.module.scss'

const TRIALS_TYPES = {
  COMPLETED: 'completed',
  FAILED: 'failed',
}
const METRIC_PARAMETER_TAB = 1

type TypeProps = {
  trials: TypeTrials,
  activeExperiment: TypeActiveExperiment,
  onSliderChange: () => {},
}

export const TrialsStatistics = ({
  trials,
  activeExperiment,
  onSliderChange,
}: TypeProps) => {
  const trialsStatusMap = trials.reduce((acc, t) => {
    if (t.status in acc) {
      acc[t.status].push(t)
      return acc
    }
    return {...acc, ...{[t.status]: [t]}}
  }, {})

  const onChange = metric => range => {
    onSliderChange({metric, range})
  }

  const axisNames = ['X', 'Y', 'Z']
  let slidersList = []
  if (activeExperiment.tab === METRIC_PARAMETER_TAB) {
    if (
      activeExperiment.tab === METRIC_PARAMETER_TAB &&
      activeExperiment.metricParameterChart &&
      activeExperiment.metricParameterChart.metric &&
      activeExperiment.metricParameterChart.parameter
    ) {
      slidersList = [
        activeExperiment.metricParameterChart.metric,
        activeExperiment.metricParameterChart.parameter,
      ]
    }
  } else {
    slidersList = [activeExperiment.xAxisMetric]
    if (activeExperiment.metricsList.length > 1) {
      slidersList.push(activeExperiment.yAxisMetric)
    }
    if (activeExperiment.metricsList.length > 2) {
      slidersList.push(activeExperiment.zAxisMetric)
    }
  }

  return (
    <div className={style.stats}>
      <div className={style.divider} />
      <ul className={style.items}>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="experiments" width={30} />
          </div>
          <span data-dom-id="statistics-total-text">
            Total Trials
            <br />
            <strong data-dom-id="statistics-total">{trials.length}</strong>
          </span>
        </li>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="circleCheck" width={30} />
          </div>
          <span data-dom-id="statistics-completed-text">
            Completed Trials
            <br />
            <strong data-dom-id="statistics-completed">
              {(trialsStatusMap[TRIALS_TYPES.COMPLETED] || []).length}
            </strong>
          </span>
        </li>
        <li className={style.item}>
          <div className={style.icon}>
            <Icon icon="circleX" width={30} />
          </div>
          <span data-dom-id="statistics-failed-text">
            Unstable Configurations
            <br />
            <strong data-dom-id="statistics-failed">
              {(trialsStatusMap[TRIALS_TYPES.FAILED] || []).length}
            </strong>
          </span>
        </li>

        {slidersList.map((key, i) => {
          if (
            !activeExperiment.metricsRanges[key] ||
            !('rangeMax' in activeExperiment.metricsRanges[key]) ||
            !('rangeMin' in activeExperiment.metricsRanges[key]) ||
            activeExperiment.metricsRanges[key].rangeMin === null ||
            activeExperiment.metricsRanges[key].rangeMax === null ||
            typeof activeExperiment.metricsRanges[key].rangeMin === 'string'
          ) {
            return null
          }

          return (
            <li
              className={style.item}
              key={`${activeExperiment.tab}-${axisNames[i]}-${key}`}
            >
              <div className={style.sliderCaption}>{key}</div>
              <RangeSlider
                min={activeExperiment.metricsRanges[key].min}
                max={activeExperiment.metricsRanges[key].max}
                rangeMin={0}
                rangeMax={activeExperiment.metricsRanges[key].rangeMax}
                filteredMin={activeExperiment.metricsRanges[key].filteredMin}
                filteredMax={activeExperiment.metricsRanges[key].filteredMax}
                onChange={onChange(key)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TrialsStatistics
