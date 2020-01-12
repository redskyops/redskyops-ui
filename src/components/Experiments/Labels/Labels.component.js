import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import {ExperimentsService} from '../../../services/ExperimentsService'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
} from '../../../context/DefaultState'
import getAllLabelsFromTrials from '../../../utilities/getAllLabelsFromTrials'

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
    labels.postingNewLabel === true &&
    labels.postingDelLabel === false &&
    labels.newLabel
      ? expService.postLabelToTrialFactory({
          experimentId,
          trialId: trial.number,
          labels: {[labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE},
        })
      : null
  /* eslint-enable indent */

  const postLabelSuccess = () => {
    const trialIndex = trials.findIndex(t => t.number === trial.number)
    const trialWithNewLables = {
      ...trials[trialIndex],
      labels: {
        ...trials[trialIndex].labels,
        [labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE,
      },
    }
    const updatedTrials = [...trials]
    updatedTrials.splice(trialIndex, 1, trialWithNewLables)
    updateState({
      trials: updatedTrials,
      labels: {
        ...labels,
        postingNewLabel: false,
        newLabel: '',
      },
    })
  }

  const postLabelError = () => {}

  useApiCallEffect(postLabelFactory, postLabelSuccess, postLabelError, [
    labels.postingNewLabel,
  ])

  const addLabel = newLabel => {
    updateState({
      labels: {
        ...labels,
        postingNewLabel: true,
        ...(newLabel ? {newLabel} : null),
      },
    })
  }

  const onAddFormSubmit = e => {
    e.preventDefault()
    addLabel()
  }

  const onAddLabelClick = label => e => {
    e.preventDefault()
    addLabel(label)
  }

  /* eslint-disable indent */
  const deleteLabelFactory = () =>
    labels.postingDelLabel === true &&
    labels.postingNewLabel === false &&
    labels.labelToDelete
      ? expService.postLabelToTrialFactory({
          experimentId,
          trialId: trial.number,
          labels: {[labels.labelToDelete.trim().toLowerCase()]: ''},
        })
      : null
  /* eslint-enable indent */

  const deleteLabelSuccess = () => {
    const trialIndex = trials.findIndex(t => t.number === trial.number)
    const newLabels = {...trials[trialIndex].labels}
    delete newLabels[labels.labelToDelete]
    const trialWithNewLables = {
      ...trials[trialIndex],
      labels: newLabels,
    }
    const updatedTrials = [...trials]
    updatedTrials.splice(trialIndex, 1, trialWithNewLables)
    updateState({
      trials: updatedTrials,
      labels: {
        ...labels,
        postingDelLabel: false,
        labelToDelete: '',
      },
    })
  }

  const deleteLabelError = () => {}

  useApiCallEffect(deleteLabelFactory, deleteLabelSuccess, deleteLabelError, [
    labels.postingDelLabel,
  ])

  const deleteLabel = labelToDelete => e => {
    e.preventDefault()
    updateState({
      labels: {
        ...labels,
        postingDelLabel: true,
        labelToDelete,
      },
    })
  }

  const renderLabels = () => {
    const list = Object.keys(trial.labels || {}).map(label => {
      return (
        <button
          key={label}
          className={`${style.label} ${style.labelRemove}`}
          onClick={deleteLabel(label)}
          disabled={labels.postingNewLabel || labels.postingDelLabel}
        >
          {label}
          <span className={`material-icons ${style.labelDel}`}>close</span>
        </button>
      )
    })
    return list.length > 0 ? (
      <div className={style.list}>{list}</div>
    ) : (
      <span>No labels assigned</span>
    )
  }

  const renderLabelsToAdd = () => {
    const existingLabels = Object.keys(trial.labels || {})
    return getAllLabelsFromTrials(trials)
      .filter(l => existingLabels.indexOf(l) < 0)
      .map(label => {
        return (
          <button
            key={label}
            className={`${style.label} ${style.labelAssign}`}
            onClick={onAddLabelClick(label)}
          >
            {label}
            <span className={`material-icons ${style.labelDel}`}>add</span>
          </button>
        )
      })
  }

  return (
    <div className={style.labels}>
      <div className={style.section} data-dom-id="labels-assigned">
        <h4 className={style.h4}>Assigned labels</h4>
        {renderLabels()}
      </div>
      <div className={style.section} data-dom-id="labels-new">
        <h4 className={style.h4}>Assign label</h4>
        {renderLabelsToAdd()}
      </div>
      <div className={style.section}>
        <h4 className={style.h4}>Create new label</h4>
        <form onSubmit={onAddFormSubmit}>
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
    </div>
  )
}

export default connectWithState(Labels, ['labels', 'trials', 'activeTrial'])
