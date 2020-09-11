export const BASE_URL = process.env.REACT_APP_BASE_FOLDER || ''

export type TypeAxisType = 'parameter' | 'metric'

export const AXIS_TYPE: TypeAxisType = {
  PARAMETER: 'parameter',
  METRIC: 'metric',
}

export const BASELINE_LABEL = 'baseline'
