import React from 'react'

import RangeIndicator from '../RangIndicator/RangeIndicator.component'

import style from './ValueDisplay.module.scss'

type TypeProps = {
  name: string,
  value: string | number,
  valueFormater: () => {},
  min: string | number,
  max: string | number,
}

export const ValueDisplay = ({
  name,
  value,
  valueFormater,
  min = null,
  max = null,
}: TypeProps) => {
  const minValue = parseInt(min)
  const maxValue = parseInt(max)
  return (
    <div className={style.valueDisplay}>
      <div className={style.data}>
        <div className={style.name}>{name}</div>
        <div className={style.value}>
          {'function' === typeof valueFormater ? valueFormater(value) : value}
        </div>
      </div>
      {!isNaN(minValue) && !isNaN(maxValue) && (
        <div className={style.indicator}>
          <RangeIndicator min={minValue} max={maxValue} value={value} />
        </div>
      )}
    </div>
  )
}

export default ValueDisplay
