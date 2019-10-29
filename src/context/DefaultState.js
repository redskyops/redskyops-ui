const experimentsList = []
const experiments = {
  list: experimentsList,
  loading: false,
  error: '',
}

const activeExperiment = null

export const DEFAULT_STATE = {
  experiments,
  activeExperiment,
}
