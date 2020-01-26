export type TypeExperimentsList = Array<Object>

export type TypeExperimentsFilter = {
  name: string,
}

export type TypeExperiments = {
  list: TypeExperimentsList,
  loading: boolean,
  error: string,
  labelsFilter: Array<string>,
  filter: TypeExperimentsFilter,
}

export type TypeActiveExperiment = {
  index: number,
  isLoading: boolean,
  metricsList: Array<string>,
  parametersList: Array<string>,
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

const experimentsFilter: TypeExperimentsFilter = {
  name: '',
}

const experiments: TypeExperiments = {
  list: experimentsList,
  loading: true,
  error: '',
  labelsFilter: [],
  filter: experimentsFilter,
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
