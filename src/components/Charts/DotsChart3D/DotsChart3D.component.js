import React from 'react'
import * as d3 from 'd3'
import * as aframe from 'aframe'

import ChartPropsType from '../ChartProps.type'
import style from '../Charts.module.scss'

export class DotsChart3D extends React.Component<ChartPropsType> {
  buildChart() {
    const canvasWidth = 1024
    const canvasHeight = 500
    const margins = {top: 20, right: 20, bottom: 40, left: 70}
    const width = canvasWidth - margins.top - margins.left
    const height = canvasHeight - margins.top - margins.bottom
    const depth = 100

    const popupWidth = 200
    const popupHeight = 50

    const xValueName = this.props.xAxisMetricName
    const yValueName = this.props.yAxisMetricName
    const zValueName = this.props.zAxisMetricName

    const completedTrials = this.props.trials
      .map((t, index) => ({...t, index}))
      .filter(t => t.status === 'completed')

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
    const [minThroughput, maxThroughput] = d3.extent(
      completedTrials.map(v => {
        return v.values.filter(c => c.metricName === zValueName)[0].value
      }),
    )

    const xScale = d3
      .scaleLinear()
      .domain([minCost, maxCost])
      .range([-2, 2])

    const yScale = d3
      .scaleLinear()
      .domain([minDuration, maxDuration])
      .range([0, 4])

    // eslint-disable-next-line no-unused-vars
    const zScale = d3
      .scaleLinear()
      .domain([minThroughput, maxThroughput])
      .range([-4, -2])

    const svg = d3.select('a-scene')

    svg
      .selectAll('a-sphere')
      .data(completedTrials)
      .enter()
      .append('a-sphere')
      .attr('position', d => {
        // eslint-disable-next-line no-unused-vars
        const [cost, duration, throughput] = d.values.reduce((acc, v) => {
          if (v.metricName === xValueName) acc[0] = v
          if (v.metricName === yValueName) acc[1] = v
          if (v.metricName === zValueName) acc[2] = v
          return acc
        }, [])
        return `${xScale(cost.value)} ${yScale(duration.value)} ${zScale(
          throughput.value,
        )}`
      })
      .attr('radius', '0.08')
      .attr('color', '#00f')

    // svg
    //   .append('g')
    //   .attr('id', 'popup')
    //   .attr('class', style.popup)
    //   .classed(style.hidden, true)
    //   .append('rect')
    //   .attr('transform', 'translate(5, 5)')
    //   .style('filter', 'url(#dropshadow)')
    //   .attr('class', style.popupRect)
    //   .attr('width', popupWidth)
    //   .attr('height', popupHeight)
  }

  componentDidMount() {
    this.buildChart()
  }

  componentDidUpdate() {
    // this.buildChart()
  }

  render() {
    return (
      <div className={style.trials}>
        <h1>3d</h1>
        <div id="chart" />

        <a-scene embedded>
          {/* <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box> */}
          {/* <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere> */}
          {/* <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder> */}
          <a-plane
            position="0 0 -4"
            rotation="-90 0 0"
            width="4"
            height="4"
            color="#7BC8A4"
          ></a-plane>
          <a-plane
            position="0 2 -4"
            rotation="0 0 0"
            width="4"
            height="4"
            color="#ff0"
          ></a-plane>
          <a-plane
            position="2 2 -4"
            rotation="0 -90 0"
            width="4"
            height="4"
            color="#f0f"
          ></a-plane>
          <a-sky color="#ECECEC"></a-sky>
        </a-scene>
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

export default DotsChart3D
