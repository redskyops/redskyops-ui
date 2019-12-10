import getAllLabelsFromTrials from './getAllLabelsFromTrials'

describe('Function: getAllLabelsFromTrials', () => {
  it('should return array of unique labels', () => {
    const trials = [
      {labels: {one: 'true', best: 'true'}},
      {labels: {two: 'true'}},
      {labels: {one: 'true'}},
      {labels: {best: 'true'}},
    ]

    const result = getAllLabelsFromTrials(trials)
    expect(result).toHaveLength(3)
    expect(result).toContain('one')
    expect(result).toContain('two')
    expect(result).toContain('best')
  })
})
