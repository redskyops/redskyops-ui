import {
  mapMetricsValues,
  getFilteredTrials,
  getTrialsFilteredRanges,
} from './trialsFunctions'
import trialsStub from '../services/_stubs/trials-data.json'

describe('Function: mapMetricsValues', () => {
  const rawTrials = [...trialsStub.trials].splice(0, 20)

  it('should return array with same length', () => {
    const result = mapMetricsValues(rawTrials)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(20)
  })

  it('should add index property to each array item', () => {
    const result = mapMetricsValues(rawTrials)
    result.forEach((item, i) => {
      expect(item).toHaveProperty('index', i)
    })
  })

  it('should add allValues to each array item', () => {
    const result = mapMetricsValues(rawTrials)
    result.forEach(item => {
      expect(item).toHaveProperty('allValues')
      const {allValues} = item
      const metricsNames = (item.values || []).map(v => v.metricName)
      metricsNames.forEach(metric => {
        expect(allValues).toHaveProperty(metric)
      })
      const parametersNames = (item.assignment || []).map(v => v.parameterName)
      parametersNames.forEach(parameter => {
        expect(allValues).toHaveProperty(parameter)
      })
    })
  })
})

describe('Function: getFilteredTrials', () => {
  const rawTrials = mapMetricsValues([...trialsStub.trials].splice(0, 20))
  rawTrials
    .filter(t => t.status === 'completed')
    .forEach((t, i) => {
      t.allValues.cost = i + 1
      t.allValues.duration = i * 10
    })
  const metricsRanges = {
    cost: {min: 0, max: 10000},
    duration: {min: 0, max: 10000},
  }

  it('should exclude incomplete tirals', () => {
    const result = getFilteredTrials(rawTrials, metricsRanges)
    result.forEach(t => {
      expect(t.status).toBe('completed')
    })
  })

  it('should execlude trials with values out of passed ranges', () => {
    const localRange = {...metricsRanges}
    localRange.cost = {min: 10, max: 15}
    let result1 = getFilteredTrials(rawTrials, localRange)
    result1.forEach(t => {
      expect(
        t.allValues.cost >= localRange.cost.min &&
          t.allValues.cost <= localRange.cost.max,
      ).toBe(true)
    })

    localRange.duration = {min: 100, max: 125}
    const result2 = getFilteredTrials(rawTrials, localRange)
    result2.forEach(t => {
      expect(
        t.allValues.cost >= localRange.cost.min &&
          t.allValues.cost <= localRange.cost.max,
      ).toBe(true)
      expect(
        t.allValues.duration >= localRange.duration.min &&
          t.allValues.duration <= localRange.duration.max,
      ).toBe(true)
    })
  })
})

describe('Function: getTrialsFilteredRanges', () => {
  const rawTrials = mapMetricsValues([...trialsStub.trials].splice(0, 20))
  rawTrials
    .filter(t => t.status === 'completed')
    .forEach((t, i) => {
      t.allValues.cost = i + 1
      t.allValues.duration = i * 10
    })
  const metricsRanges = {
    cost: {min: 0, max: 10000},
    duration: {min: 0, max: 10000},
  }

  it('should return an object with property for each metric', () => {
    const localRange = {...metricsRanges}
    localRange.cost = {min: 10, max: 15}
    const result = getTrialsFilteredRanges(rawTrials, localRange)
    expect(result).toHaveProperty('cost')
    expect(result.cost).toHaveProperty('filteredMax')
    expect(result.cost).toHaveProperty('filteredMin')
    expect(result).toHaveProperty('duration')
    expect(result.duration).toHaveProperty('filteredMax')
    expect(result.duration).toHaveProperty('filteredMin')
  })

  it('should return the minimum and maximum value of filltered data', () => {
    const localRange = {...metricsRanges}
    localRange.cost = {min: 10, max: 15}

    const result1 = getTrialsFilteredRanges(rawTrials, localRange)
    expect(result1.cost).toEqual({filteredMin: 10, filteredMax: 15})
    expect(result1.duration).toEqual({filteredMin: 90, filteredMax: 140})
  })
})
