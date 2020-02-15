import React from 'react'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'
import LeftPanel from '../LeftPanel/LeftPanel.component'

import style from './Layout.module.scss'

export const Layout = () => {
  return (
    <div className={style.layout}>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.grid}>
        <div className={style.panel}>
          <LeftPanel />
        </div>
        <div className={style.content}>
          <Main />
        </div>
      </div>
    </div>
  )
}

export default Layout
