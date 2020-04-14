import React from 'react'
import {withRouter, Link} from 'react-router-dom'

import style from './Header.module.scss'
import logo from '../../assets/images/redskyop-clouds.png'

export const Header = () => {
  return (
    <header className={style.header}>
      <div style={{paddingLeft: '20px', flex: '3'}}>
        <Link style={{color: '#f45266'}} to="/" className="button">
          <h1 className={style.h1}>
            <img className={style.logo} src={logo} alt="RED SKY OPS" />
            RED SKY OPS{' '}
          </h1>
        </Link>
      </div>
      <div className={style.a} style={{flex: '2'}}>
        <Link
          style={{color: '#f45266', fontWeight: 'bold'}}
          to="/helpDocs"
          className="button"
        >
          Help Center
        </Link>
      </div>
    </header>
  )
}

export default withRouter(Header)
