import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './Header.module.scss'
import logo from '../../assets/images/redskyop-clouds.png'

export const Header = () => {
  return (
    <header className={style.header}>
      <div style={{paddingLeft: '20px', flex: '3'}}>
        <a style={{color: '#f45266'}} href="/" className="button">
          <h1 className={style.h1}>
            <img className={style.logo} src={logo} alt="RED SKY OPS" />
            RED SKY OPS
          </h1>
        </a>
      </div>
      <div stlye={{flex: '1'}}></div>
      <div className={style.a} style={{flex: '2'}}>
        <a
          style={{color: '#000000', fontWeight: 'bold'}}
          href="/helpDocs"
          className="button"
        >
          Help Center
        </a>
      </div>
    </header>
  )
}

export default withRouter(Header)
