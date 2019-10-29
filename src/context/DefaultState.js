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

const experimentsList: TypeExperimentsList = []

const experiments: TypeExperiments = {
  list: experimentsList,
  loading: false,
  error: '',
}

const activeExperiment: TypeActiveExperiment = null

export const DEFAULT_STATE = {
  experiments,
  activeExperiment,
}
