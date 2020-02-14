import React from 'react'

import style from './ServerDown.module.scss'

export const ServerDown = () => {
  return (
    <div className={style.serverDown}>
      <div className={style.content}>
        <h1>RED SKY</h1>
        <p className={style.red}>SERVER NOT AVAILABLE</p>
        <p className={style.small}>
          Please close this browser window and start server again with
          &quot;redskyctl results&quot; command
        </p>
      </div>
    </div>
  )
}

export default ServerDown
