export type TypeExperimentsList = Array<Object>

export type TypeExperiments = {
  list: TypeExperimentsList,
  loading: boolean,
  error: string,
}

export type TypeActiveExperiment = {
  index: number,
  isLoading: boolean,
}

export type TypeTrials = Array<Object>

export type TypeActiveTrial = {
  index: number,
  trial: Object,
}

export type TypeLabels = {
  posting: boolean,
  newLabel: string,
}

const experimentsList: TypeExperimentsList = []

const trials: TypeTrials = null

const experiments: TypeExperiments = {
  list: experimentsList,
  loading: false,
  error: '',
}

const activeExperiment: TypeActiveExperiment = null

const activeTrial: TypeActiveTrial = null

const labels: TypeTrials = {
  posting: false,
  newLabel: '',
}

export const DEFAULT_STATE = {
  experiments,
  activeExperiment,
  trials,
  activeTrial,
  labels,
}
