import React from 'react'
import * as d3 from 'd3'

import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeActiveExperiment,
  TypeExperiments,
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
  TypeHoveredTrial,
} from '../../../context/DefaultState'
import ExperimentResults from '../ExperimentResults/ExperimentResults.component'
import TrialDetails from '../TrialDetails/TrialDetails.component'
import TrialsStatistics from '../TrialsStatistics/TrialsStatistics.component'
import {ExperimentsService} from '../../../services/ExperimentsService'
import getAllLabelsFromTrials from '../../../utilities/getAllLabelsFromTrials'

import style from './ExperimentDetails.module.scss'
import MetricParameterChart from '../MetricParameterChart/MetricParameterChart.component'
import Tabs from '../../Tabs/Tabs.component'
import arrowImage from '../../../assets/images/ArrowLeft.png'
import TrialPopup from '../TrialPopup/TrialPopup.component'
import {DEFAULT_LABEL_VALUE, BASELINE_LABEL} from '../../../constants'

const POPUP_HIDE_DELAY = 300

type Props = {
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  activeTrial: TypeActiveTrial,
  labels: TypeLabels,
  hoveredTrial: TypeHoveredTrial,
  updateState: () => any,
}

export const ExperimentDetails = (props: Props) => {
  const {
    activeExperiment,
    experiments,
    updateState,
    trials,
    activeTrial,
    labels,
    hoveredTrial,
  } = props
  const experiment =
    experiments &&
    experiments.list &&
    activeExperiment &&
    experiments.list[activeExperiment.index]
      ? experiments.list[activeExperiment.index]
      : null
  const experimentId = experiment ? experiment.id : null
  const expService = new ExperimentsService()
  let interval = null

  React.useEffect(() => () => clearInterval(interval), [experimentId])

  const trialsRequestFactory = () =>
    experiment &&
    experiment.metrics &&
    experiment.metrics.length >= 1 &&
    experimentId
      ? expService.getTrialsFactory({
          name: experimentId, // eslint-disable-line indent
        }) // eslint-disable-line indent
      : null

  const trialsRequestSuccess = ({trials}) => {
    const labelsList = getAllLabelsFromTrials(trials)

    let metricsRanges = {}
    if (activeExperiment && Array.isArray(activeExperiment.metricsList)) {
      metricsRanges = activeExperiment.metricsList.reduce((acc, key) => {
        const [rangeMin, rangeMax] = d3.extent(
          trials
            .filter(t => t.status === 'completed')
            .map(t => (t.values || []).find(v => v.metricName === key).value),
        )
        return {
          ...acc,
          [key]: {
            rangeMin,
            rangeMax,
            min: 0,
            max: rangeMax,
          },
        }
      }, {})
    }

    updateState({
      activeExperiment: {
        ...activeExperiment,
        labelsList,
        metricsRanges,
        isLoading: false,
      },
      trials,
    })
  }

  const triallsRequestError = () => {
    updateState({
      activeExperiment: {
        isLoading: false,
      },
    })
  }

  useApiCallEffect(
    trialsRequestFactory,
    trialsRequestSuccess,
    triallsRequestError,
    [experimentId],
  )

  /* eslint-disable indent */
  const postLabelFactory = () => {
    return labels.baselineAddNumber > -1 &&
      labels.postingNewLabel === true &&
      labels.postingDelLabel === false &&
      !!labels.newLabel === true
      ? expService.postLabelToTrialFactory({
          experimentId,
          trialId: labels.baselineAddNumber,
          labels: {[labels.newLabel.trim().toLowerCase()]: DEFAULT_LABEL_VALUE},
        })
      : null
  }
  /* eslint-enable indent */

  const postLabelSuccess = () => {
    const targetTrialNumber = labels.baselineAddNumber
    const trialIndex = trials.findIndex(t => t.number === targetTrialNumber)
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
        baselineAddNumber: -1,
      },
      /* eslint-disable indent */
      ...(label => {
        return label
          ? null
          : {
              activeExperiment: {
                ...activeExperiment,
                labelsList: [
                  ...activeExperiment.labelsList,
                  labels.newLabel.trim().toLowerCase(),
                ],
              },
            }
      })(
        activeExperiment.labelsList.find(
          l => l.toLowerCase() === labels.newLabel.trim().toLowerCase(),
        ),
      ),
      hoveredTrial: null,
      /* eslint-enable indent */
    })
  }

  const onBackendError = e => {
    updateState({
      labels: {
        ...labels,
        postingNewLabel: false,
        postingDelLabel: false,
        baselineAddNumber: -1,
        baselineDelNumber: -1,
        labelToDelete: '',
        newLabel: '',
        error: e.message,
      },
    })
  }

  useApiCallEffect(postLabelFactory, postLabelSuccess, onBackendError, [
    labels.postingNewLabel,
    labels.postingDelLabel,
  ])

  /* eslint-disable indent */
  const deleteLabelFactory = () => {
    return labels.baselineDelNumber > -1 &&
      labels.labelToDelete &&
      labels.postingDelLabel === true
      ? expService.postLabelToTrialFactory({
          experimentId,
          trialId: labels.baselineDelNumber,
          labels: {[labels.labelToDelete.trim().toLowerCase()]: ''},
        })
      : null
  }
  /* eslint-enable indent */

  const deleteLabelSuccess = () => {
    const targetTrialNumber = labels.baselineDelNumber
    const trialIndex = trials.findIndex(t => t.number === targetTrialNumber)
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
        baselineDelNumber: -1,
      },
      activeExperiment: {
        ...activeExperiment,
        labelsList: getAllLabelsFromTrials(updatedTrials),
      },
      ...(labels.baselineAddNumber === -1 && {hoveredTrial: null}),
    })
  }

  useApiCallEffect(deleteLabelFactory, deleteLabelSuccess, onBackendError, [
    labels.postingDelLabel,
  ])

  const selectTrial = ({index, trial}) => {
    if (activeTrial && activeTrial.index === index) {
      updateState({
        activeTrial: null,
      })
      return
    }

    updateState({
      activeTrial: {
        ...activeTrial,
        index,
        trial,
      },
      labels: {
        ...labels,
        postingNewLabel: false,
        postingDelLabel: false,
        newLabel: '',
        labelToDelete: '',
        error: '',
      },
    })
  }

  const hoverTrial = ({trial, index, domBox, xData, yData}) => {
    clearInterval(interval)
    if (trial) {
      updateState({
        hoveredTrial: {
          ...hoveredTrial,
          trial,
          index,
          xData,
          yData,
          left: domBox.left,
          top: domBox.top,
        },
      })
      return
    }

    interval = setTimeout(() => {
      updateState({hoveredTrial: null})
    }, POPUP_HIDE_DELAY)
  }

  const onPopupHover = () => {
    clearInterval(interval)
  }

  const baselineClick = (set, targetTrial) => () => {
    const currentBaselineNumber = trials.reduce((acc, t) => {
      if (t.labels && BASELINE_LABEL in t.labels) {
        return t.number
      }
      return acc
    }, -1)

    updateState({
      labels: {
        ...labels,
        ...(set && {
          postingNewLabel: true,
          newLabel: BASELINE_LABEL,
          baselineAddNumber: targetTrial.number,
        }),
        ...(currentBaselineNumber > -1 && {
          postingDelLabel: true,
          labelToDelete: BASELINE_LABEL,
          baselineDelNumber: currentBaselineNumber,
        }),
      },
    })
  }

  const filterChange = ({items}) => {
    updateState({
      activeExperiment: {
        ...activeExperiment,
        labelsFilter: items.map(l => l.value),
      },
    })
  }

  const onMetricChange = ({item} = {}) => {
    if (!item) {
      updateState({
        activeExperiment: {
          ...activeExperiment,
          metricParameterChart: null,
        },
      })
      return
    }
    updateState({
      activeExperiment: {
        ...activeExperiment,
        metricParameterChart: {
          ...(activeExperiment.metricParameterChart
            ? activeExperiment.metricParameterChart
            : null),
          metric: item.value,
        },
      },
    })
  }

  const onParameterChange = ({item} = {}) => {
    if (!item) {
      updateState({
        activeExperiment: {
          ...activeExperiment,
          metricParameterChart: null,
        },
      })
      return
    }
    updateState({
      activeExperiment: {
        ...activeExperiment,
        metricParameterChart: {
          ...(activeExperiment.metricParameterChart
            ? activeExperiment.metricParameterChart
            : null),
          parameter: item.value,
        },
      },
    })
  }

  if (!activeExperiment) {
    return (
      <div className={style.expDetails} data-dom-id="exp-details-select">
        <div className={style.noExp}>
          <div>
            <h1 className={style.noExpTitle}>RED SKY OPS</h1>
            <h2 className={style.h1}>
              <img
                src={arrowImage}
                width={26}
                className={style.noExpArrow}
                alt="Select Experiment"
              />
              Select an experiment!
            </h2>
          </div>
        </div>
      </div>
    )
  }

  const renderTrials = () => {
    if (
      !(
        activeExperiment &&
        experiment &&
        experiment.metrics &&
        experiment.metrics.length > 0
      )
    ) {
      return (
        <div data-dom-id="exp-details-no-metrics">
          No valid metric data found
        </div>
      )
    }

    if (activeExperiment && (!trials || trials.length < 1)) {
      return <div data-dom-id="exp-details-no-trials">No trials found</div>
    }

    const {metricParameterChart} = activeExperiment

    return (
      <Tabs>
        <div data-title="EXPERIMENT RESULTS">
          <ExperimentResults
            selectTrialHandler={selectTrial}
            hoverTrialHandler={hoverTrial}
            filterChangeHandler={filterChange}
          />
          <TrialsStatistics
            trials={trials}
            activeExperiment={activeExperiment}
          />
        </div>
        <div data-title="PARAMETER DRILLDOWN">
          <MetricParameterChart
            trials={trials}
            activeTrial={activeTrial}
            metricsList={activeExperiment.metricsList}
            parametersList={activeExperiment.parametersList}
            labelsList={activeExperiment.labelsList}
            metric={
              metricParameterChart && metricParameterChart.metric
                ? metricParameterChart.metric
                : null
            }
            parameter={
              metricParameterChart && metricParameterChart.parameter
                ? metricParameterChart.parameter
                : null
            }
            labelsFilter={activeExperiment.labelsFilter}
            onMetricChange={onMetricChange}
            onParameterChange={onParameterChange}
            selectTrialHandler={selectTrial}
            hoverTrialHandler={hoverTrial}
            filterChangeHandler={filterChange}
          />
        </div>
      </Tabs>
    )
  }

  const renderTrialDetails = () => {
    if (!activeTrial) {
      return null
    }

    return (
      <TrialDetails
        trial={activeTrial.trial}
        experimentId={experiments.list[activeExperiment.index].id}
        parameters={experiment.parameters}
        closeHandler={() =>
          updateState({
            activeTrial: null,
          })
        }
      />
    )
  }

  return (
    <div className={style.expDetails}>
      <h1 className={style.h1}>{experiment.displayName.replace(/-/g, ' ')}</h1>
      {renderTrials()}
      {renderTrialDetails()}
      <TrialPopup
        mouseOver={onPopupHover}
        mouseOut={() => hoverTrial({trial: null})}
        baselineClick={baselineClick}
      />
    </div>
  )
}

export default connectWithState(ExperimentDetails, [
  'activeExperiment',
  'experiments',
  'trials',
  'activeTrial',
  'labels',
])
