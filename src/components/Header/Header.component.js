import React from 'react'

import ExperimentsList from '../Experiments/ExperimentsList.component'
import style from './Header.module.scss'
import logo from '../../images/carbon-rlay-logo-dark.png'

export const Header = () => {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logo} alt="Carbon Relay" />
      <ExperimentsList />
    </header>
  )
}

export default Header
