import React from 'react'
import * as d3 from 'd3'

import {ChartPropsType} from '../ChartProps.type'
import style from '../Charts.module.scss'

export const AXIS_TYPE = {
  PARAMETER: 'parameter',
  METRIC: 'metric',
}

type AxisType = AXIS_TYPE.METIC | AXIS_TYPE.PARAMETER

export class DotsChart2D extends React.Component<
  ChartPropsType & {xAxisValueType: AxisType, xAxisMinValue: number},
> {
  constructor(props) {
    super(props)
    this.chartId = Math.round(10000 * Math.random())
  }

  buildChart() {
    if (!this.props.xAxisMetricName || !this.props.yAxisMetricName) {
      d3.select(`#chart-${this.chartId} svg`).remove()
      return
    }

    const canvasWidth = 1280
    const canvasHeight = 500
    const margins = {top: 20, right: 20, bottom: 40, left: 70}
    const width = canvasWidth - margins.top - margins.left
    const height = canvasHeight - margins.top - margins.bottom

    const popupWidth = 200
    const popupHeight = 50

    const xValueName = this.props.xAxisMetricName
    const yValueName = this.props.yAxisMetricName

    const completedTrials = this.props.trials
      .map((t, index) => ({...t, index}))
      .filter(t => t.status === 'completed')

    const filteredTrials = completedTrials.filter(
      ({labels}) =>
        this.props.labelsFilter.length === 0 ||
        this.props.labelsFilter.reduce((acc, l) => acc || l in labels, false),
    )

    const [minCost, maxCost] = d3.extent(
      completedTrials.map(v => {
        switch (this.props.xAxisValueType) {
          case AXIS_TYPE.PARAMETER:
            return v.assignments.filter(p => p.parameterName === xValueName)[0]
              .value
          case AXIS_TYPE.METRIC:
          default:
            return v.values.filter(c => c.metricName === xValueName)[0].value
        }
      }),
    )
    const [minDuration, maxDuration] = d3.extent(
      completedTrials.map(v => {
        return v.values.filter(c => c.metricName === yValueName)[0].value
      }),
    )

    const minXValue = (min => (!isNaN(min) ? min : minCost))(
      parseInt(this.props.xAxisMinValue, 10),
    )
    const xScale = d3
      .scaleLinear()
      .domain([minXValue, maxCost])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([minDuration, maxDuration])
      .range([height, 0])

    d3.select(`#chart-${this.chartId} svg`).remove()

    const svg = d3
      .select(`#chart-${this.chartId}`)
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
      .attr('transform', `translate(${width / 2}, ${height + 35})`)
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

    const circleOver = (xAxisValueType, chartId) =>
      function _circleOver(dataPoint) {
        let xValue = 0
        switch (xAxisValueType) {
          case AXIS_TYPE.PARAMETER:
            xValue = dataPoint.assignments.filter(
              v => v.parameterName === xValueName,
            )[0].value
            break
          case AXIS_TYPE.METRIC:
          default:
            xValue = dataPoint.values.filter(
              v => v.metricName === xValueName,
            )[0].value
            break
        }

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
          .select(`#popup-${chartId}`)
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

    const circleOut = (activeTrial, chartId) =>
      function _circleOut(dataPoint) {
        d3.select(this)
          .classed(style.active, false)
          .attr(
            'r',
            activeTrial && dataPoint.index === activeTrial.index ? 6 : 3,
          )
        d3.select(`#popup-${chartId}`)
          .classed(style.hidden, true)
          .classed(style.fadeIn, false)
      }

    const circleClick = selectTrialHandler =>
      function _circleClick(dataPoint) {
        selectTrialHandler({
          index: dataPoint.index,
          trial: dataPoint,
        })
      }

    svg
      .selectAll('g.point')
      .data(filteredTrials)
      .enter()
      .append('g')
      .attr('transform', d => {
        const duration = d.values.reduce((acc, v) => {
          if (v.metricName === yValueName) acc = v
          return acc
        }, 0)
        let cost = {value: 0}
        switch (this.props.xAxisValueType) {
          case AXIS_TYPE.PARAMETER:
            cost = d.assignments.reduce((acc, v) => {
              if (v.parameterName === xValueName) acc = v
              return acc
            }, 0)
            break
          case AXIS_TYPE.METRIC:
          default:
            cost = d.values.reduce((acc, v) => {
              if (v.metricName === xValueName) acc = v
              return acc
            }, 0)
            break
        }
        return `translate(${xScale(cost.value)}, ${yScale(duration.value)})`
      })
      .append('circle')
      .attr('class', 'point')
      .attr('r', d =>
        this.props.activeTrial && d.index === this.props.activeTrial.index
          ? 6
          : 3,
      )
      .attr('class', style.circle)
      .classed(style.best, d => {
        if ('best' in d.labels) {
          return true
        }
        return false
      })
      .classed(
        style.selected,
        d => this.props.activeTrial && d.index === this.props.activeTrial.index,
      )
      .on('mouseover', circleOver(this.props.xAxisValueType, this.chartId))
      .on('mouseout', circleOut(this.props.activeTrial, this.chartId))
      .on('click', circleClick(this.props.selectTrialHandler))

    svg
      .append('g')
      .attr('id', `popup-${this.chartId}`)
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
        <div id={`chart-${this.chartId}`} />
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

export default DotsChart2D
