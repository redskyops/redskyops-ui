import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

export class OverlayPortal extends React.Component {
  render() {
    const mountingPoint = document.getElementById('overlay')
    if (!mountingPoint) {
      return process.env.NODE_ENV === 'development'
        ? 'DOM element with id "overlay" not found to mount the portal'
        : null
    }
    return ReactDOM.createPortal(this.props.children, mountingPoint)
  }
}

OverlayPortal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export default OverlayPortal
