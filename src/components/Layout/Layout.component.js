import React from 'react'

import Header from '../Header/Header.component'
import style from './Layout.module.scss'

export const Layout = () => {
  return (
    <div className={style.layout}>
      <Header />
    </div>
  )
}

export default Layout
