import React from 'react'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'

import style from './Layout.module.scss'

export const Layout = () => {
  return (
    <div className={style.layout}>
      <Header />
      <Main />
    </div>
  )
}

export default Layout
