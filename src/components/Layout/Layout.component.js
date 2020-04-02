import React, {useState} from 'react'
import {Collapse} from 'reactstrap'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'
import LeftPanel from '../LeftPanel/LeftPanel.component'
import Footer from '../Footer/Footer.component'

import style from './Layout.module.scss'

export const Layout = () => {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(!isOpen);
        
  return (
    <div className={style.layout}>
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.grid}>
        <Collapse isOpen={isOpen}>
          <div className={style.panel}>
            <LeftPanel />
          </div>
        </Collapse>
        <button style={{fontSize: '24px', paddingLeft: '8px', marginTop: '15px'}}
          className="fa fa-angle-double-left"
          onClick={toggle}></button>
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
