import React from 'react'
// import {Collapse} from 'reactstrap'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'
import LeftPanel from '../LeftPanel/LeftPanel.component'
import Footer from '../Footer/Footer.component'

import style from './Layout.module.scss'

export const Layout = () => {
  return (
    <div className={style.layout}>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.grid}>
        {/* <Collapse isOpen={isOpen}> */}
        <div className={style.panel}>
          <LeftPanel />
        </div>
        {/* </Collapse> */}
        <div className={style.content}>
          <Main />
        </div>
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
