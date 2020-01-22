import React from 'react'
import PropTypes from 'prop-types'

import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg'

import style from './icon.module.scss'

const iconsMap = {
  search: SearchIcon,
}

const strokeOrFill = {}

export const Icon = ({
  icon,
  width = 24,
  color = '0',
  alt = '',
  cssClass = '',
  ...rest
}) => {
  const MappedIcon = iconsMap[icon]
  if (!MappedIcon) {
    return null
  }
  const inlineStyle = {width}
  if (color !== '0') {
    inlineStyle['--icon-color'] = color
  }
  const extraProps = {}
  if (alt) {
    extraProps.alt = alt
  }
  let classes = style.icon
  classes += ` ${strokeOrFill[icon] ? strokeOrFill[icon] : style.fillColor}`

  classes += cssClass ? ` ${cssClass}` : ''
  return (
    <MappedIcon
      className={classes}
      style={inlineStyle}
      {...extraProps}
      {...rest}
    />
  )
}

Icon.propTypes = {
  icon: PropTypes.oneOf(Object.keys(iconsMap)).isRequired,
  width: PropTypes.number,
  color: PropTypes.string,
  alt: PropTypes.string,
  cssClass: PropTypes.string,
  status: PropTypes.string,
}

export default Icon
