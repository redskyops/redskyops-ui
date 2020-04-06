import React from 'react'

import {connectWithState} from '../../context/StateContext'
import {TypeLeftPanel} from '../../context/DefaultState'

import style from './LeftPanel.module.scss'

type TypeProps = {
  leftPanel: TypeLeftPanel,
  updateState: () => {},
}

export const LeftPanel = (props: TypeProps) => {
  const {leftPanel, updateState} = props
  const togglePanel = () => {
    updateState({
      leftPanel: {
        ...leftPanel,
        show: !leftPanel.show,
      },
    })
  }
  return (
    <div className={style.leftPanel}>
      <button
        style={{
          fontSize: '24px',
          paddingLeft: '6px',
          marginTop: '15px',
          backgroundColor: '#F8F8F8',
        }}
        className={`${style.button} fa fa-angle-double-${
          leftPanel.show ? 'left' : 'right'
        }`}
        onClick={togglePanel}
      />
      <div
        className={`${style.outter} ${
          leftPanel.show ? style.expand : style.collapse
        }`}
      >
        <div className={style.inner}>
          <div className={style.title}>
            <a
              style={{color: '#000000', fontWeight: 'bold'}}
              href="/"
              className="button"
            >
              My Experiments
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connectWithState(LeftPanel, ['leftPanel'])
