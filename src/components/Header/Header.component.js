import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './Header.module.scss'
import logo from '../../assets/images/carbon-rlay-logo-dark.png'
import {OperationsService} from '../../services/OperationsService'

type TypeProps = {
  history: Object,
}

export const Header = ({history}: TypeProps) => {
  const shutdownClick = e => {
    e.preventDefault()
    const opsService = new OperationsService()
    const [shutdownRequest] = opsService.shutdown()
    shutdownRequest().finally(() => {
      history.push('/server-down')
    })
  }
  return (
    <header className={style.header}>
      <img className={style.logo} src={logo} alt="Carbon Relay" />

      <div className={style.rightSide}>
        <button className={style.shutdown} onClick={shutdownClick}>
          Shutdown
        </button>
      </div>
    </header>
  )
}

export default withRouter(Header)
