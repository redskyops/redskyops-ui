import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import {TypeHoveredTrial} from '../../../context/DefaultState'

import style from './TrialPopup.module.scss'

type TypeProps = {
  hoveredTrial: TypeHoveredTrial,
}

export const TrialPopup = (props: TypeProps) => {
  const {hoveredTrial} = props

  if (!hoveredTrial) {
    return null
  }
  const {left, top, xData, yData, zData} = hoveredTrial

  const divPos = {
    left: left + window.scrollX,
    top: top + window.scrollY,
  }

  let classes = style.trialPopup
  classes +=
    divPos.left + 200 >= window.innerWidth
      ? ` ${style.toLeftSide}`
      : ` ${style.toRightSide}`

  return (
    <div className={classes} style={divPos}>
      <h3 className={style.title}>EXPERIMENT LABEL</h3>
      {xData && (
        <div className={style.metric}>
          {xData.name.toUpperCase().replace(/_/g, ' ')}{' '}
          <strong>{xData.value}</strong>
        </div>
      )}
      {yData && (
        <div className={style.metric}>
          {yData.name.toUpperCase().replace(/_/g, ' ')}{' '}
          <strong>{yData.value}</strong>
        </div>
      )}
      {zData && (
        <div className={style.metric}>
          {zData.name.toUpperCase().replace(/_/g, ' ')}{' '}
          <strong>{zData.value}</strong>
        </div>
      )}
    </div>
  )
}

export default connectWithState(TrialPopup, ['hoveredTrial'])
