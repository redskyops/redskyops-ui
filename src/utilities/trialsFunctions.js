import * as d3 from 'd3'

export const mapMetricsValues = _trialls =>
  _trialls.map((t, index) => {
    let allValues = (t.values || []).reduce(
      (acc, v) => ({...acc, [v.metricName]: v.value}),
      {},
    )
    allValues = (t.assignments || []).reduce(
      (acc, v) => ({...acc, [v.parameterName]: v.value}),
      allValues,
    )
    return {...t, index, allValues}
  })

export const getFilteredTrials = (_trials, _metricsRanges) => {
  const filteredData = _trials
    .filter(t => t.status === 'completed')
    .filter(t => {
      return Object.keys(_metricsRanges).reduce((acc, key) => {
        if (typeof t.allValues[key] !== 'number') {
          return acc
        }
        const inRange =
          t.allValues[key] >= _metricsRanges[key].min &&
          t.allValues[key] <= _metricsRanges[key].max
        return acc && inRange
      }, true)
    })
  return filteredData
}

export const getTrialsFilteredRanges = (_trials, _metricsRanges) => {
  const filteredData = getFilteredTrials(_trials, _metricsRanges)
  return Object.keys(_metricsRanges).reduce((acc, key) => {
    const [filteredMin, filteredMax] = d3.extent(
      filteredData
        .map(t => t.allValues[key])
        .filter(t => typeof t === 'number'),
    )
    return {
      ...acc,
      [key]: {
        filteredMin,
        filteredMax,
      },
    }
  }, {})
}
