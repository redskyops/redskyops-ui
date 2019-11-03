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

export const RangeIndicator = ({
  min,
  max,
  value,
  width = 200,
  indecatorClass = '',
}: Props) => {
  const iconWidth = 32
  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, width])
    .clamp(true)

  const leftPos = xScale(parseInt(value, 10)) - iconWidth / 2
  return (
    <div className={style.rangeIndicator} style={{width}}>
      <span
        className={`material-icons ${style.icon} ${indecatorClass}`}
        style={{left: `${leftPos}px`}}
      >
        arrow_drop_down
      </span>
      <div className={style.bar} />
      <div className={style.labels}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default RangeIndicator
