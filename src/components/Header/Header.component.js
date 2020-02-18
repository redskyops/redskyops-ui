import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './Header.module.scss'
import logo from '../../assets/images/carbon-rlay-logo-dark.png'

export const Header = () => {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logo} alt="Carbon Relay" />
    </header>
  )
}

export default withRouter(Header)
