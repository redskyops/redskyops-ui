import React from 'react'

import Icon from '../../Icon/Icon.component'
import ListSearchMulti from '../../FormControls/ListSearchMulti/ListSearchMulti.component'

import style from './LabelsFilter.module.scss'

type TypeProps = {
  labelsList: Array<string>,
  selectedValues: Array<string>,
  onChange: () => {},
}

export const LabelsFilter = (props: TypeProps) => {
  const {labelsList, selectedValues, onChange} = props
  const clearFilter = e => {
    e.preventDefault()
    onChange({indexs: [], items: []})
  }
  return (
    <>
      {(!Array.isArray(selectedValues) || selectedValues.length < 1) && (
        <Icon icon="filter" width={18} cssClass={style.metricIcon} />
      )}
      {Array.isArray(selectedValues) && selectedValues.length >= 1 && (
        <button className={style.btn} onClick={clearFilter}>
          <Icon icon="circleX" width={18} cssClass={style.metricIconBtn} />{' '}
          CLEAR
        </button>
      )}
      <div className={style.dropdown}>
        <ListSearchMulti
          value={selectedValues}
          itemsList={labelsList.map(m => ({
            label: m.toUpperCase(),
            value: m,
          }))}
          placeholder="FILTER BY"
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default LabelsFilter
