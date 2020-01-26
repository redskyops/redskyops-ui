import React from 'react'

import DotsChart1D from '../../Charts/DotsChart1D/DotsChart1D.component'
import DotsChart2D from '../../Charts/DotsChart2D/DotsChart2D.component'
import DotsChart3D from '../../Charts/DotsChart3D/DotsChart3D.component'
import {
  TypeActiveExperiment,
  TypeExperiments,
} from '../../Charts/ChartProps.type'
import Icon from '../../Icon/Icon.component'
import ListSearch from '../../FormControls/ListSearch/ListSearch.component'
import {connectWithState} from '../../../context/StateContext'

import style from './ExperimentResults.module.scss'

type TypeProps = {
  experiments: TypeExperiments,
  activeExperiment: TypeActiveExperiment,
}

export const ExperimentResults = (props: TypeProps) => {
  const {activeExperiment} = props
  const numOfMertics = activeExperiment.metricsList.length

  const renderChart = () => {
    if (numOfMertics === 1) {
      return <DotsChart1D {...props} />
    }
    if (numOfMertics === 2) {
      return <DotsChart2D {...props} />
    }
    if (numOfMertics >= 3) {
      return <DotsChart3D {...props} />
    }
  }

  console.log(activeExperiment)

  return (
    <div className={style.expResults}>
      <div className={style.metrics}>
        <div className={style.metric}>
          <Icon icon="xAxis" width={18} cssClass={style.metricIcon} />
          X-AXIS METRIC
          <div className={style.dropdown}>
            <ListSearch
              label="metric"
              itemsList={activeExperiment.metricsList.map(m => ({
                label: m.toUpperCase(),
                value: m,
              }))}
              onSelect={() => {}}
            />
          </div>
        </div>

        <div className={style.metric}>
          <Icon icon="yAxis" width={18} cssClass={style.metricIcon} />
          Y-AXIS METRIC
          <div className={style.dropdown}>
            <ListSearch
              label="metric"
              itemsList={activeExperiment.metricsList.map(m => ({
                label: m.toUpperCase(),
                value: m,
              }))}
              onSelect={() => {}}
            />
          </div>
        </div>
      </div>
      <div className={style.chart}>{renderChart()}</div>
    </div>
  )
}

export default connectWithState(ExperimentResults)
