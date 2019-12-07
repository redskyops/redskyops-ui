import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import {ExperimentsService} from '../../../services/ExperimentsService'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
} from '../../../context/DefaultState'

import style from './Labels.module.scss'

const DEFAULT_LABEL_VALUE = 'true'

type Props = {
  activeTrial: TypeActiveTrial,
  trials: TypeTrials,
  labels: TypeLabels,
  experimentId: string,
  updateState: () => any,
}

export const Labels = (props: Props) => {
  const {activeTrial, trials, labels, experimentId, updateState} = props
  const trial = trials[activeTrial.index]

  const expService = new ExperimentsService()

  /* eslint-disable indent */
  const postLabelFactory = () =>
    labels.posting === true && labels.newLabel
      ? expService.postLabelToTrial({
          experimentId,
          trialId: trial.number,
          labels: {[labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE},
        })
      : null
  /* eslint-enable indent */

  const postLabelSuccess = res => {
    const trialIndex = trials.findIndex(t => t.number === trial.number)
    const trialWithNewLables = {
      ...trials[trialIndex],
      labels: {
        ...trials[trialIndex].labels,
        ...res.labels,
      },
    }
    const updatedTrials = [...trials]
    updatedTrials.splice(trialIndex, 1, trialWithNewLables)
    updateState({
      trials: updatedTrials,
      labels: {
        ...labels,
        posting: false,
        newLabel: '',
      },
    })
  }

  const postLabelError = () => {}

  useApiCallEffect(postLabelFactory, postLabelSuccess, postLabelError, [
    labels.posting,
  ])

  const addLabel = e => {
    e.preventDefault()

    updateState({
      labels: {
        ...labels,
        posting: true,
      },
    })
  }

  const renderLabels = () => {
    const list = Object.keys(trial.labels || {}).map(label => {
      return (
        <button key={label} className={style.label}>
          {label}
          <span className={`material-icons ${style.labelDel}`}>close</span>
        </button>
      )
    })
    return list.length > 0 ? <div className={style.list}>{list}</div> : null
  }

  return (
    <div className={style.labels}>
      {renderLabels()}
      <form onSubmit={addLabel}>
        <input
          type="text"
          className={style.labelInput}
          value={labels.newLabel}
          onChange={e =>
            updateState({
              labels: {
                ...labels,
                newLabel: e.target.value,
              },
            })
          }
        />
      </form>
    </div>
  )
}

export default connectWithState(Labels, ['labels', 'trials', 'activeTrial'])
