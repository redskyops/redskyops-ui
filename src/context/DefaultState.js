export type TypeExperimentsList = Array<Object>

export type TypeExperiments = {
  list: TypeExperimentsList,
  loading: boolean,
  error: string,
  labelsFilter: Array<string>,
}

export type TypeActiveExperiment = {
  index: number,
  isLoading: boolean,
  metricParameterChart?: {
    metric: string,
    parameter: string,
  },
}

export type TypeTrials = Array<Object>

export type TypeActiveTrial = {
  index: number,
  trial: Object,
}

export type TypeLabels = {
  postingNewLabel: boolean,
  postingDelLabel: boolean,
  newLabel: string,
  labelToDelete: string,
}

const experimentsList: TypeExperimentsList = []

const trials: TypeTrials = null

const experiments: TypeExperiments = {
  list: experimentsList,
  loading: false,
  error: '',
  labelsFilter: [],
}

const activeExperiment: TypeActiveExperiment = null

const activeTrial: TypeActiveTrial = null

const labels: TypeTrials = {
  postingNewLabel: false,
  postingDelLabel: false,
  newLabel: '',
  labelToDelete: '',
}

export const DEFAULT_STATE = {
  experiments,
  activeExperiment,
  trials,
  activeTrial,
  labels,
}
