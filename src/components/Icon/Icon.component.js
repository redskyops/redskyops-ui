import React from 'react'
import PropTypes from 'prop-types'

import {ReactComponent as SearchIcon} from '../../assets/icons/Search.svg'
import {ReactComponent as ExperimentsIcon} from '../../assets/icons/Experiment.svg'
import {ReactComponent as CheckIcon} from '../../assets/icons/Check.svg'
import {ReactComponent as ExIcon} from '../../assets/icons/Ex.svg'
import {ReactComponent as XAxisIcon} from '../../assets/icons/X-axis.svg'
import {ReactComponent as YAxisIcon} from '../../assets/icons/Y-axis.svg'
import {ReactComponent as ZAxisIcon} from '../../assets/icons/Z-axis.svg'
import {ReactComponent as DownArrowIcon} from '../../assets/icons/DownArrow.svg'
import {ReactComponent as FilterIcon} from '../../assets/icons/Filter.svg'
import {ReactComponent as ParametersIcon} from '../../assets/icons/Parameters.svg'
import {ReactComponent as MetricsIcon} from '../../assets/icons/Metrics.svg'
import {ReactComponent as PencilIcon} from '../../assets/icons/Pencil.svg'

import style from './icon.module.scss'

const iconsMap = {
  search: SearchIcon,
  experiments: ExperimentsIcon,
  circleCheck: CheckIcon,
  circleX: ExIcon,
  xAxis: XAxisIcon,
  yAxis: YAxisIcon,
  zAxis: ZAxisIcon,
  arrowDown: DownArrowIcon,
  filter: FilterIcon,
  parameters: ParametersIcon,
  metrics: MetricsIcon,
  pencil: PencilIcon,
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
