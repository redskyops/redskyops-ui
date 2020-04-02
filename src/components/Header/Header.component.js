import React from 'react'
import {withRouter} from 'react-router-dom'

import style from './Header.module.scss'

export const Header = () => {
  return (
    <header className={style.header}>
      <div className="col-lg-12">
        <a style={{color: '#000000'}} href="/" className="button">
          <h1 className={style.h1}>RED SKY OPS</h1>
          <h4 className={style.h4}>VERSION 2.0</h4>
        </a>
        <div className={style.a}>
          <a
            style={{color: '#000000', fontWeight: 'bold'}}
            href="/helpDocs"
            className="button"
          >
            Help Center
          </a>
        </div>
      </div>
    </header>
  )
}

export default withRouter(Header)
