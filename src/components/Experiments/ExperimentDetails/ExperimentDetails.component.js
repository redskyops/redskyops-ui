import React from 'react'

import {connectWithState} from '../../../context/StateContext'
import useApiCallEffect from '../../../hooks/useApiCallEffect'
import {
  TypeActiveExperiment,
  TypeExperiments,
  TypeTrials,
  TypeActiveTrial,
  TypeLabels,
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

type Props = {
  activeExperiment: TypeActiveExperiment,
  experiments: TypeExperiments,
  trials: TypeTrials,
  activeTrial: TypeActiveTrial,
  labels: TypeLabels,
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
  } = props
  const expService = new ExperimentsService()

  const requestFactory = () =>
    activeExperiment &&
    activeExperiment.isLoading &&
    experiments.list[activeExperiment.index] &&
    experiments.list[activeExperiment.index].metrics &&
    experiments.list[activeExperiment.index].metrics.length > 1
      ? expService.getTrialsFactory({
          name: experiments.list[activeExperiment.index].id, // eslint-disable-line indent
        }) // eslint-disable-line indent
      : null
  const requestSuccess = ({trials}) => {
    const labelsList = getAllLabelsFromTrials(trials)
    updateState({
      activeExperiment: {
        ...activeExperiment,
        labelsList,
        isLoading: false,
      },
      trials,
    })
  }
  const requestError = e => console.log(e)

  useApiCallEffect(requestFactory, requestSuccess, requestError, [
    activeExperiment,
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
            <h3 className={style.noExpSubTitle}>VERSION 2.0</h3>
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
  const experiment = experiments.list[activeExperiment.index]

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
    const trialProps = {
      selectTrialHandler: selectTrial,
    }

    return (
      <Tabs>
        <div data-title="EXPERIMENT RESULTS">
          <ExperimentResults {...trialProps} />
          <TrialsStatistics trials={trials} />
        </div>
        <div data-title="PARAMETER DRILLDOWN">
          <MetricParameterChart
            trials={trials}
            activeTrial={activeTrial}
            metricsList={experiment.metrics.map(({name}) => name)}
            parametersList={experiment.parameters.map(({name}) => name)}
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
            labelsFilter={experiments.labelsFilter}
            onMetricChange={onMetricChange}
            onParameterChange={onParameterChange}
            selectTrialHandler={selectTrial}
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
    </div>
  )
}

export default connectWithState(ExperimentDetails, [
  'activeExperiment',
  'experiments',
  'trials',
  'activeTrial',
])
