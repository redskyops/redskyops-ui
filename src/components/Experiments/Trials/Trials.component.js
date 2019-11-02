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
    const canvasWidth = 1024
    const canvasHeight = 500
    const margins = {top: 20, right: 20, bottom: 40, left: 70}
    const width = canvasWidth - margins.top - margins.left
    const height = canvasHeight - margins.top - margins.bottom

    const popupWidth = 200
    const popupHeight = 50

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
      .range([height, 0])

    d3.select('#chart svg').remove()

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)

    const yAxis = d3.axisLeft(yScale)
    svg.call(yAxis)

    svg
      .append('text')
      .attr(
        'transform',
        `translate(-${margins.left - 20}, ${height / 2}) rotate(-90)`,
      )
      .attr('font-size', '1.5em')
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .text(yValueName)

    const xAxis = d3.axisBottom(xScale).ticks(10)

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + 40})`)
      .attr('font-size', '1.5em')
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .text(xValueName)

    const makeXGridlines = () => {
      return d3.axisBottom(xScale).ticks(10)
    }

    svg
      .append('g')
      .attr('class', style.grid)
      .attr('transform', `translate(0, ${height})`)
      .call(
        makeXGridlines()
          .tickSize(-height)
          .tickFormat(''),
      )

    const makeYGridlines = () => {
      return d3.axisLeft(yScale).ticks(10)
    }

    svg
      .append('g')
      .attr('class', style.grid)
      .attr('transform', `translate(0, 0)`)
      .call(
        makeYGridlines()
          .tickSize(-width)
          .tickFormat(''),
      )

    const circleOver = () =>
      function _circleOver(dataPoint) {
        var xValue = dataPoint.values.filter(
          v => v.metricName === xValueName,
        )[0].value
        var yValue = dataPoint.values.filter(
          v => v.metricName === yValueName,
        )[0].value

        let xPos = xScale(xValue)
        let yPos = yScale(yValue)
        xPos -= xPos + popupWidth >= width ? popupWidth + 5 : 0
        yPos -= yPos + popupHeight >= height ? popupHeight + 8 : 0

        d3.select(this)
          .classed(style.active, true)
          .attr('r', 6)

        const popup = d3
          .select('#popup')
          .attr('transform', `translate(${xPos}, ${yPos})`)
          .classed(style.hidden, false)
          .classed(style.fadeIn, true)
          .classed(style.best, dataPoint.labels && 'best' in dataPoint.labels)

        popup.selectAll('text').remove()
        popup
          .append('text')
          .attr('font-size', '1.5em')
          .attr('font-family', 'sans-serif')
          .style('text-anchor', 'start')
          .attr('transform', 'translate(10, 23)')
          .attr('width', 100)
          .text(`${xValueName}: ${xValue}`)
        popup
          .append('text')
          .attr('font-size', '1.5em')
          .attr('font-family', 'sans-serif')
          .style('text-anchor', 'start')
          .attr('transform', 'translate(10, 45)')
          .attr('width', 100)
          .text(`${yValueName}: ${yValue}`)
      }

    const circleOut = () =>
      function _circleOut() {
        d3.select(this)
          .classed(style.active, false)
          .attr('r', 3)
        d3.select('#popup')
          .classed(style.hidden, true)
          .classed(style.fadeIn, false)
      }

    svg
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
      .classed(style.best, d => {
        if ('best' in d.labels) {
          return true
        }
        return false
      })
      .on('mouseover', circleOver())
      .on('mouseout', circleOut())

    svg
      .append('g')
      .attr('id', 'popup')
      .attr('class', style.popup)
      .classed(style.hidden, true)
      .append('rect')
      .attr('transform', 'translate(5, 5)')
      .style('filter', 'url(#dropshadow)')
      .attr('class', style.popupRect)
      .attr('width', popupWidth)
      .attr('height', popupHeight)
  }

  componentDidMount() {
    this.buildChart()
  }

  componentDidUpdate() {
    this.buildChart()
  }

  render() {
    return (
      <div className={style.trials}>
        <div id="chart" ref={this.chartRef} />
        <div className={style.svgFillter}>
          <svg>
            <filter id="dropshadow" height="130%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="3" dy="3" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </svg>
        </div>
      </div>
    )
  }
}

export default Trials
