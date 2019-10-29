import React from 'react'

import {TypeTrials} from '../../../context/DefaultState'

import style from './Trials.module.scss'

type Props = {
  trials: TypeTrials,
}

export const Trials = (props: Props) => {
  const {trials} = props

  return <div className={style.trials}>{trials.length}</div>
}

export default Trials
