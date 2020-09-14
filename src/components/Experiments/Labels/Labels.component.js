import React, {useState, useEffect} from 'react'

import {connectWithState} from '../../../context/StateContext'
import {ExperimentsService} from '../../../services/ExperimentsService'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
  TypeActiveExperiment,
  TypeExperiments,
} from '../../../context/DefaultState'
import getAllLabelsFromTrials from '../../../utilities/getAllLabelsFromTrials'

import style from './Labels.module.scss'
import Icon from '../../Icon/Icon.component'

type Props = {
  activeTrial: TypeActiveTrial,
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  labels: TypeLabels,
  updateState: () => any,
}

export const Labels = (props: Props) => {
  const {
    activeTrial,
    activeExperiment,
    experiments,
    trials,
    labels,
    updateState,
  } = props
  const trial = activeTrial ? trials[activeTrial.index] : null
  const experiment =
    experiments &&
    experiments.list &&
    activeExperiment &&
    experiments.list[activeExperiment.index]
      ? experiments.list[activeExperiment.index]
      : null
  const experimentId = experiment ? experiment.id : null
  const expService = new ExperimentsService()
  const [showMenu, setShowMenu] = useState(false)
  let interval

  // /* eslint-disable indent */
  // const postLabelFactory = () =>
  //   labels.postingNewLabel === true &&
  //   labels.postingDelLabel === false &&
  //   !!labels.newLabel === true
  //     ? expService.postLabelToTrialFactory({
  //         experimentId,
  //         trialId: trial.number,
  //         labels: {[labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE},
  //       })
  //     : null
  // /* eslint-enable indent */

  // const postLabelSuccess = () => {
  //   const trialIndex = trials.findIndex(t => t.number === trial.number)
  //   const trialWithNewLables = {
  //     ...trials[trialIndex],
  //     labels: {
  //       ...trials[trialIndex].labels,
  //       [labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE,
  //     },
  //   }
  //   const updatedTrials = [...trials]
  //   updatedTrials.splice(trialIndex, 1, trialWithNewLables)
  //   updateState({
  //     trials: updatedTrials,
  //     labels: {
  //       ...labels,
  //       postingNewLabel: false,
  //       newLabel: '',
  //     },
  //     /* eslint-disable indent */
  //     ...(label => {
  //       return label
  //         ? null
  //         : {
  //             activeExperiment: {
  //               ...activeExperiment,
  //               labelsList: [
  //                 ...activeExperiment.labelsList,
  //                 labels.newLabel.trim().toLowerCase(),
  //               ],
  //             },
  //           }
  //     })(
  //       activeExperiment.labelsList.find(
  //         l => l.toLowerCase() === labels.newLabel.trim().toLowerCase(),
  //       ),
  //     ),
  //     /* eslint-enable indent */
  //   })
  // }

  const onBackendError = e => {
    updateState({
      labels: {
        ...labels,
        postingNewLabel: false,
        postingDelLabel: false,
        labelToDelete: '',
        error: e.message,
      },
    })
  }

  // useApiCallEffect(postLabelFactory, postLabelSuccess, onBackendError, [
  //   labels.postingNewLabel,
  // ])

  const onAddFormSubmit = e => {
    e.preventDefault()
    if (labels.postingNewLabel || labels.postingDelLabel || !labels.newLabel) {
      return
    }
    updateState({
      labels: {
        ...labels,
        postingNewLabel: true,
        error: '',
      },
    })
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
      activeExperiment: {
        ...activeExperiment,
        labelsList: getAllLabelsFromTrials(updatedTrials),
      },
    })
  }

  useApiCallEffect(deleteLabelFactory, deleteLabelSuccess, onBackendError, [
    labels.postingDelLabel,
  ])

  const deleteLabel = labelToDelete => e => {
    e.preventDefault()
    updateState({
      labels: {
        ...labels,
        postingDelLabel: true,
        labelToDelete,
        error: '',
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
          {label.toUpperCase()}
          <Icon icon="circleX" width={14} cssClass={style.labelDel} />
        </button>
      )
    })
    return list.length > 0 ? <div className={style.list}>{list}</div> : null
  }

  const handleFocus = () => {
    clearInterval(interval)
    setShowMenu(true)
  }

  const handleBlur = () => {
    clearInterval(interval)
    interval = setTimeout(() => setShowMenu(false), 150)
  }

  const onMenuItemClick = label => e => {
    e.preventDefault()
    clearInterval(interval)
    setShowMenu(false)
    updateState({
      labels: {
        ...labels,
        newLabel: label,
        postingNewLabel: true,
      },
    })
  }

  useEffect(() => () => clearInterval(interval))

  if (!experimentId || !trial) {
    return null
  }

  return (
    <div className={style.labels}>
      {renderLabels()}
      <form onSubmit={onAddFormSubmit} className={style.form}>
        <input
          type="text"
          className={style.labelInput}
          value={labels.newLabel}
          placeholder="Assign Label"
          onChange={e =>
            updateState({
              labels: {
                ...labels,
                newLabel: e.target.value,
              },
            })
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showMenu && (
          <div className={style.menu}>
            {activeExperiment.labelsList
              .filter(l => !trial.labels || !(l in trial.labels))
              .filter(l => new RegExp(labels.newLabel, 'gi').test(l))
              .map(label => (
                <button
                  className={style.menuItem}
                  key={label}
                  onClick={onMenuItemClick(label)}
                >
                  {label.toUpperCase()}
                </button>
              ))}
          </div>
        )}
        {labels.error && <div className={style.error}>{labels.error}</div>}
        <button className={style.submit}>SUBMIT</button>
      </form>
    </div>
  )
}

export default connectWithState(Labels, ['labels', 'trials', 'activeTrial'])
