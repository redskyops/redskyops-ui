import React from 'react'
import * as d3 from 'd3'

import style from './RangeIndicator.module.scss'

type Props = {
  min: number,
  max: number,
  value: number,
  width?: number,
  indecatorClass?: string,
}

export const ICON_WIDTH = 32

export const RangeIndicator = ({
  min,
  max,
  value,
  width = 200,
  indecatorClass = '',
}: Props) => {
  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, width])
    .clamp(true)

  const leftPos = xScale(parseInt(value, 10)) - ICON_WIDTH / 2
  return (
    <div className={style.rangeIndicator} style={{width}}>
      <span
        className={`material-icons ${style.icon} ${indecatorClass}`}
        style={{left: `${leftPos}px`}}
        data-dom-id="range-indicator"
      >
        arrow_drop_down
      </span>
      <div className={style.bar} data-dom-id="range-bar" />
      <div className={style.labels}>
        <span data-dom-id="range-label-min">{min}</span>
        <span data-dom-id="range-label-max">{max}</span>
      </div>
    </div>
  )
}

export default RangeIndicator
