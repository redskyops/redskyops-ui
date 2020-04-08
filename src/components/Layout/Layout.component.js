import React from 'react'
import {Switch, Route} from 'react-router-dom'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'
import LeftPanel from '../LeftPanel/LeftPanel.component'
import Footer from '../Footer/Footer.component'
import HelpDocs from '../HelpDocs/HelpDocs.component'

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
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/helpDocs" component={HelpDocs} />
          </Switch>
        </div>
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
