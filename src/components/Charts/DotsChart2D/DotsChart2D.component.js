import React from 'react'
import * as d3 from 'd3'

import {ChartPropsType} from '../ChartProps.type'
import style from '../Charts.module.scss'
import {AXIS_TYPE, BASELINE_LABEL, TypeAxisType} from '../../../constants'

export class DotsChart2D extends React.Component<
  ChartPropsType & {
    xAxisValueType: TypeAxisType,
    xAxisMinValue: number,
    yAxisMinValue: number,
    xAxisRange: {
      min: number,
      max: Number,
    },
    yAxisRange: {
      min: number,
      max: Number,
    },
  },
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
    const isStringX =
      typeof this.props.trials[0].allValues[xValueName] === 'string'

    const completedTrials = this.props.trials
      .filter(t => t.status === 'completed')
      .filter(t => {
        let inRange =
          t.allValues[yValueName] >= this.props.yAxisRange.min &&
          t.allValues[yValueName] <= this.props.yAxisRange.max
        if (!isStringX) {
          inRange =
            inRange &&
            t.allValues[xValueName] >= this.props.xAxisRange.min &&
              t.allValues[xValueName] <= this.props.xAxisRange.max
        }
        return inRange
      })

    const filteredTrials = completedTrials.filter(
      ({labels = {}}) =>
        this.props.labelsFilter.length === 0 ||
        this.props.labelsFilter.reduce(
          (acc, l) => acc || l in labels || BASELINE_LABEL in labels,
          false,
        ),
    )

    const [minCost, maxCost] = d3.extent(
      completedTrials.map(v => {
        return v.allValues[xValueName]
      }),
    )
    const [minDuration, maxDuration] = d3.extent(
      completedTrials.map(v => {
        return v.allValues[yValueName]
      }),
    )

    const minXValue = (min => (!isNaN(min) ? min : minCost))(
      parseInt(this.props.xAxisMinValue, 10),
    )

    const minYValue = (min => (!isNaN(min) ? min : minDuration))(
      parseInt(this.props.yAxisMinValue, 10),
    )

    let xScale
    let allXStringValues = {}
    if (isStringX) {
      allXStringValues = completedTrials.reduce((acc, t) => {
        if (!(t.allValues[xValueName] in acc)) {
          acc[t.allValues[xValueName]] = Object.keys(acc).length + 1
        }
        return acc
      }, allXStringValues)
      xScale = d3
        .scaleLinear()
        .domain([0, Object.keys(allXStringValues).length + 1])
        .range([0, width])
    } else {
      xScale = d3
        .scaleLinear()
        .domain([minXValue, maxCost])
        .range([0, width])
    }

    const yScale = d3
      .scaleLinear()
      .domain([minYValue, maxDuration])
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
      .attr('font-family', "'Montserrat', sans-serif")
      .attr('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .text(yValueName.toUpperCase().replace(/_/g, ' '))

    /* eslint-disable indent */
    const xAxis = isStringX
      ? d3
          .axisBottom(xScale)
          .ticks(Object.keys(allXStringValues).length)
          .tickFormat(d => {
            return Object.keys(allXStringValues)[
              Object.values(allXStringValues).indexOf(d)
            ]
          })
      : d3.axisBottom(xScale).ticks(10)
    /* eslint-enable indent */

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)

    svg
      .append('text')
      .attr('transform', `translate(${width / 2}, ${height + 38})`)
      .attr('font-size', '1.5em')
      .attr('font-family', "'Montserrat', sans-serif")
      .attr('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .style('fill', '#000')
      .text(xValueName.toUpperCase().replace(/_/g, ' '))

    const makeXGridlines = () => {
      return d3.axisBottom(xScale).ticks(10)
    }

    svg
      .append('g')
      .attr('class', style.gridX)
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

    const circleOver = ({
      xAxisValueType,
      xAxisMetricName,
      yAxisMetricName,
      hoverTrialHandler,
    }) =>
      function _circleOver(_, dataPoint) {
        const xValue = dataPoint.allValues[xValueName] || 0
        const yValue = dataPoint.allValues[yValueName] || 0

        d3.select(this)
          .classed(style.active, true)
          .attr('r', 6)

        const domBox = d3
          .select(this)
          .node()
          .getBoundingClientRect()

        const hoverData = {
          trial: dataPoint,
          domBox,
          index: dataPoint.index,
          xData: {name: xAxisMetricName, type: xAxisValueType, value: xValue},
          yData: {name: yAxisMetricName, type: AXIS_TYPE.METRIC, value: yValue},
        }
        hoverTrialHandler(hoverData)
      }

    const circleOut = ({activeTrial, hoverTrialHandler}) =>
      function _circleOut(_, dataPoint) {
        d3.select(this)
          .classed(style.active, false)
          .attr(
            'r',
            activeTrial && dataPoint.index === activeTrial.index ? 6 : 3,
          )

        hoverTrialHandler({trial: null, domBox: null, index: -1})
      }

    const circleClick = selectTrialHandler =>
      function _circleClick(_, dataPoint) {
        selectTrialHandler({
          index: dataPoint.index,
          trial: dataPoint,
        })
      }

    if (filteredTrials.length < 1) {
      svg
        .append('text')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .attr('font-size', '1.5em')
        .attr('font-family', "'Montserrat', sans-serif")
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .style('fill', '#000')
        .text('No Results')
      return
    }

    svg
      .selectAll('g.point')
      .data(filteredTrials)
      .enter()
      .append('g')
      .attr('transform', d => {
        const durationValue = d.allValues[yValueName] || 0
        const costValue = isStringX
          ? allXStringValues[d.allValues[xValueName]]
          : d.allValues[xValueName] || 0
        return `translate(${xScale(costValue)}, ${yScale(durationValue)})`
      })
      .attr('class', 'point')
      .classed('baseline', d => {
        if (d.labels && BASELINE_LABEL in d.labels) {
          return true
        }
        return false
      })
      .classed(style.best, d => {
        if (d.labels && 'best' in d.labels) {
          return true
        }
        return false
      })
      .append('circle')
      .attr('r', d =>
        this.props.activeTrial && d.index === this.props.activeTrial.index
          ? 10
          : 3,
      )
      .attr('class', style.circle)
      .classed(
        style.selected,
        d => this.props.activeTrial && d.index === this.props.activeTrial.index,
      )
      .on(
        'mouseover',
        circleOver({
          xAxisValueType: this.props.xAxisValueType,
          xAxisMetricName: this.props.xAxisMetricName,
          yAxisMetricName: this.props.yAxisMetricName,
          hoverTrialHandler: this.props.hoverTrialHandler,
        }),
      )
      .on(
        'mouseout',
        circleOut({
          activeTrial: this.props.activeTrial,
          hoverTrialHandler: this.props.hoverTrialHandler,
        }),
      )
      .on(
        'click',
        circleClick(
          this.props.selectTrialHandler,
          this.props.hoverTrialHandler,
        ),
      )

    svg
      .selectAll('g.point.baseline')
      .append('polygon')
      .lower()
      .attr('points', '-6,6 6,6, 0,-6 ')
      .attr('class', style.triangle)

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
      </div>
    )
  }
}

export default DotsChart2D
