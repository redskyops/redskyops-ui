import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import {
  TypeHoveredTrial,
  TypeActiveExperiment,
  TypeExperiments,
} from '../../../context/DefaultState'
import {BASELINE_LABEL} from '../../../constants'
// import Icon from '../../Icon/Icon.component'
// import {trialInfoLink} from '../../../config'

import style from './TrialPopup.module.scss'

type TypeProps = {
  hoveredTrial: TypeHoveredTrial,
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  mouseOver: () => {},
  mouseOut: () => {},
  baselineClick: () => {},
}

// const ICON_COLOR = '#f45266'

export const TrialPopup = (props: TypeProps) => {
  const {hoveredTrial, activeExperiment, experiments} = props

  if (!hoveredTrial) {
    return null
  }
  const {left, top, xData, yData, zData, trial} = hoveredTrial
  const isBaselineTrial = BASELINE_LABEL in (trial.labels || {})
  const experiment =
    activeExperiment && experiments.list[activeExperiment.index]
      ? experiments.list[activeExperiment.index]
      : null

  const divPos = {
    left: left + window.scrollX,
    top: top + window.scrollY,
  }

  const renderLables = () => {
    const trialLabels = Object.keys(trial.labels || {}).map(l =>
      l.toUpperCase(),
    )
    if (trialLabels.length < 1) {
      return null
    }
    return <h3 className={style.title}>{trialLabels.join(', ')}</h3>
  }

  let classes = style.trialPopup
  classes +=
    divPos.left + 200 >= window.innerWidth
      ? ` ${style.toLeftSide}`
      : ` ${style.toRightSide}`

  return (
    <div
      className={classes}
      style={divPos}
      onMouseOver={props.mouseOver}
      onMouseOut={props.mouseOut}
      onFocus={() => {}}
      onBlur={() => {}}
    >
      {experiment && (
        <h5 className={style.trialName}>
          {`${experiment.displayName}-${hoveredTrial.trial.number}`}
          {/* <a target="_blank" rel="noopener noreferrer" href={trialInfoLink}>
            <Icon
              icon="help"
              width={20}
              color={ICON_COLOR}
              cssClass={style.nameIcon}
            />
          </a> */}
        </h5>
      )}
      {renderLables()}
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
      {!isBaselineTrial && (
        <button
          className={style.btn}
          data-dom-id="popup-set-baseline"
          onClick={props.baselineClick(true, trial)}
        >
          SET BASELINE
        </button>
      )}
      {isBaselineTrial && (
        <>
          <button
            className={style.btn}
            data-dom-id="popup-remove-baseline"
            onClick={props.baselineClick(false, trial)}
          >
            REMOVE BASELINE
          </button>
          <div className={style.baselineLabel}>BASELINE</div>
        </>
      )}
    </div>
  )
}

export default connectWithState(TrialPopup, ['hoveredTrial'])
