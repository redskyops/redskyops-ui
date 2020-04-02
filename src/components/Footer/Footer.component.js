import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './Footer.module.scss'
import logo from '../../assets/images/carbon-rlay-logo-dark.png'

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.logo}>
        <a
          href="https://www.carbonrelay.com/"
          className="button"
          target="_blank"
        >
          <img className={style.logo} src={logo} alt="Carbon Relay" />
        </a>
      </div>
    </footer>
  )
}

export default withRouter(Footer)
