import React from 'react'

import Header from '../Header/Header.component'
import LeftPanel from '../LeftPanel/LeftPanelHomeMenu.component'
import Footer from '../Footer/Footer.component'
import HelpDocs from '../HelpDocs/HelpDocs.component'
import style from './Layout.module.scss'

export const LayoutHelpDocs = () => {
  return (
    <div className={style.layout}>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.grid}>
        <div className={style.panel}>
          <LeftPanel />
        </div>
        <div>
          <HelpDocs />
        </div>
      </div>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default LayoutHelpDocs
