import React from 'react'
import * as d3 from 'd3'

import {TypeTrials} from '../../../context/DefaultState'

import style from './Trials.module.scss'

type Props = {
  trials: TypeTrials,
}

export class Trials extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.chartRef = React.createRef()
  }

  buildChart() {
    const width = 800
    const height = 400
    const completedTrials = this.props.trials.filter(
      t => t.status === 'completed',
    )
    const [minCost, maxCost] = d3.extent(
      completedTrials.map(
        v => v.values.filter(c => c.metricName === 'cost')[0].value,
      ),
    )
    const [minDuration, maxDuration] = d3.extent(
      completedTrials.map(
        v => v.values.filter(c => c.metricName === 'duration')[0].value,
      ),
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
      .attr('width', width)
      .attr('height', height)
      .selectAll('g')
      .data(completedTrials)
      .enter()
      .append('g')
      .attr('transform', d => {
        const [cost, duration] = d.values.reduce((acc, v) => {
          if (v.metricName === 'cost') acc[0] = v
          if (v.metricName === 'duration') acc[1] = v
          return acc
        }, [])

        return `translate(${xScale(cost.value)}, ${yScale(duration.value)})`
      })
      .append('circle')
      .attr('r', 5)
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
