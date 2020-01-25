import React from 'react'
import * as d3 from 'd3'

import style from './RangeIndicator.module.scss'

type Props = {
  min: number,
  max: number,
  value: number,
  width?: number,
  indicatorClass?: string,
}

export const RangeIndicator = ({min, max, value, width = 200}: Props) => {
  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, 1])
    .clamp(true)

  const indicatorWidth = xScale(value) * 100
  return (
    <div className={style.rangeIndicator} style={{width}}>
      <div className={style.bar} data-dom-id="range-bar">
        <div
          className={style.indicator}
          style={{width: `${indicatorWidth}%`}}
        />
      </div>
      <div className={style.labels}>
        <span data-dom-id="range-label-min">{min}</span>
        <span data-dom-id="range-label-max">{max}</span>
      </div>
    </div>
  )
}

export default RangeIndicator
