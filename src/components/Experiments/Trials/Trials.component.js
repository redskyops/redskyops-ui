import React from 'react'
import * as d3 from 'd3'

import {TypeTrials} from '../../../context/DefaultState'

import style from './Trials.module.scss'

type Props = {
  trials: TypeTrials,
  xAxisMetricName: string,
  yAxisMetricName: string,
}

export class Trials extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.chartRef = React.createRef()
  }

  buildChart() {
    const canvasWidth = 800
    const canvasHeight = 400
    const margins = {top: 20, right: 20, bottom: 20, left: 20}
    const width = canvasWidth - margins.top - margins.left
    const height = canvasHeight - margins.top - margins.bottom

    const xValueName = this.props.xAxisMetricName
    const yValueName = this.props.yAxisMetricName

    const completedTrials = this.props.trials.filter(
      t => t.status === 'completed',
    )
    const [minCost, maxCost] = d3.extent(
      completedTrials.map(
        v => v.values.filter(c => c.metricName === xValueName)[0].value,
      ),
    )
    const [minDuration, maxDuration] = d3.extent(
      completedTrials.map(v => {
        return v.values.filter(c => c.metricName === yValueName)[0].value
      }),
    )

    const xScale = d3
      .scaleLinear()
      .domain([minCost, maxCost])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([minDuration, maxDuration])
      .range([0, height])

    d3.select('#chart')
      .append('svg')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
      .selectAll('g')
      .data(completedTrials)
      .enter()
      .append('g')
      .attr('transform', d => {
        const [cost, duration] = d.values.reduce((acc, v) => {
          if (v.metricName === xValueName) acc[0] = v
          if (v.metricName === yValueName) acc[1] = v
          return acc
        }, [])

        return `translate(${xScale(cost.value)}, ${yScale(duration.value)})`
      })
      .append('circle')
      .attr('r', 3)
      .attr('class', style.circle)
  }

  componentDidMount() {
    this.buildChart()
  }

  render() {
    return (
      <div className={style.trials}>
        <div id="chart" ref={this.chartRef} />
      </div>
    )
  }
}

export default Trials
