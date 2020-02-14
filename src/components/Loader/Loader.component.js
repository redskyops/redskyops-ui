import React from 'react'
import PropTypes from 'prop-types'

import OverlayPortal from '../OverlayPortal/OverlayPortal.component'

import style from './Loader.module.scss'

export const Loader = ({color = null}) => {
  const inlineStyle = {
    ...(color && {'--loader-color': color}),
  }
  return (
    <OverlayPortal>
      <div className={style.wrapper}>
        <div
          className={style.loader}
          style={inlineStyle}
          data-dom-id="app-loader"
        >
          <div className={style.doubleBounce1}></div>
          <div className={style.doubleBounce2}></div>
        </div>
      </div>
    </OverlayPortal>
  )
}

Loader.propTypes = {
  color: PropTypes.string,
}

export default Loader
