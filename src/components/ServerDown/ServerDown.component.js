import React from 'react'

import style from './ServerDown.module.scss'

export const ServerDown = () => {
  return (
    <div className={style.serverDown}>
      <div className={style.content}>
        <h1>RED SKY</h1>
        <p className={style.red}>SERVER NOT AVAILABLE</p>
      </div>
    </div>
  )
}

export default ServerDown
