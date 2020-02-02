import React from 'react'

import DotsChart1D from '../../Charts/DotsChart1D/DotsChart1D.component'
import DotsChart2D from '../../Charts/DotsChart2D/DotsChart2D.component'
import DotsChart3D from '../../Charts/DotsChart3D/DotsChart3D.component'
import {
  TypeActiveExperiment,
  TypeTrials,
  TypeActiveTrial,
} from '../../Charts/ChartProps.type'
import Icon from '../../Icon/Icon.component'
import ListSearch from '../../FormControls/ListSearch/ListSearch.component'
import ListSearchMulti from '../../FormControls/ListSearchMulti/ListSearchMulti.component'
import {connectWithState} from '../../../context/StateContext'

import style from './ExperimentResults.module.scss'

type TypeProps = {
  activeExperiment: TypeActiveExperiment,
  trials: TypeTrials,
  activeTrial: TypeActiveTrial,
  selectTrialHandler: () => {},
  updateState: () => {},
}

export const ExperimentResults = (props: TypeProps) => {
  const {
    activeExperiment,
    trials,
    activeTrial,
    selectTrialHandler,
    updateState,
  } = props
  const numOfMertics = activeExperiment.metricsList.length

  const onMetricChange = axis => ({item}) => {
    updateState({
      activeExperiment: {
        ...activeExperiment,
        [`${axis}AxisMetric`]: item.value,
      },
    })
  }

  const onSelectedLabelsChange = ({items}) => {
    updateState({
      activeExperiment: {
        ...activeExperiment,
        labelsFilter: items.map(l => l.value),
      },
    })
  }

  const chartProps = {
    trials,
    activeTrial,
    selectTrialHandler: selectTrialHandler,
    numOfMertics: activeExperiment.metricsList.length,
    labelsFilter: activeExperiment.labelsFilter,
    xAxisMetricName: activeExperiment.xAxisMetric,
    xAxisMinValue: 0,
    ...(numOfMertics >= 2 && {
      yAxisMetricName: activeExperiment.yAxisMetric,
    }),
    ...(numOfMertics >= 3 && {
      zAxisMetricName: activeExperiment.zAxisMetric,
    }),
  }

  const renderChart = () => {
    if (numOfMertics === 1) {
      return <DotsChart1D {...chartProps} />
    }
    if (numOfMertics === 2) {
      return <DotsChart2D {...chartProps} />
    }
    if (numOfMertics >= 3) {
      return <DotsChart3D {...chartProps} />
    }
  }

  return (
    <div className={style.expResults}>
      <div className={style.metrics}>
        <div className={style.metric}>
          <Icon icon="xAxis" width={18} cssClass={style.metricIcon} />
          X-AXIS METRIC
          <div className={style.dropdown}>
            <ListSearch
              value={activeExperiment.xAxisMetric}
              itemsList={activeExperiment.metricsList.map(label => ({
                label: label.toUpperCase(),
                value: label,
              }))}
              onSelect={onMetricChange('x')}
            />
          </div>
        </div>

        {activeExperiment.metricsList.length >= 2 && (
          <div className={style.metric}>
            <Icon icon="yAxis" width={18} cssClass={style.metricIcon} />
            Y-AXIS METRIC
            <div className={style.dropdown}>
              <ListSearch
                value={activeExperiment.yAxisMetric}
                itemsList={activeExperiment.metricsList.map(m => ({
                  label: m.toUpperCase(),
                  value: m,
                }))}
                onSelect={onMetricChange('y')}
              />
            </div>
          </div>
        )}

        {activeExperiment.metricsList.length >= 3 && (
          <div className={style.metric}>
            <Icon icon="zAxis" width={18} cssClass={style.metricIcon} />
            Y-AXIS METRIC
            <div className={style.dropdown}>
              <ListSearch
                value={activeExperiment.zAxisMetric}
                itemsList={activeExperiment.metricsList.map(m => ({
                  label: m.toUpperCase(),
                  value: m,
                }))}
                onSelect={onMetricChange('z')}
              />
            </div>
          </div>
        )}

        <div
          className={`${style.metric} ${style.alignRight}  ${
            activeExperiment.labelsFilter.length > 0 ? style.activeFilter : ''
          }`}
        >
          <Icon icon="filter" width={18} cssClass={style.metricIcon} />
          <div className={style.dropdown}>
            <ListSearchMulti
              value={activeExperiment.labelsFilter}
              itemsList={activeExperiment.labelsList.map(m => ({
                label: m.toUpperCase(),
                value: m,
              }))}
              placeholder="FILTER BY"
              onChange={onSelectedLabelsChange}
            />
          </div>
        </div>
      </div>
      <div className={style.chart}>{renderChart()}</div>
    </div>
  )
}

export default connectWithState(ExperimentResults)
