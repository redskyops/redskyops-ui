import React from 'react'

import style from './ListSearch.module.scss'

export const ListSearch = () => {
  return (
    <div className={style.listSearch}>
      <input type="text" className={style.input} />
    </div>
  )
}

export default ListSearch
