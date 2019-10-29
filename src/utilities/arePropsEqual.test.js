import arePropsEqual from './arePropsEqual'

describe('Function: arePropsEqual', () => {
  it('should return false if no props list provided', () => {
    const prev = {
      prop: 'test',
    }
    const next = {
      prop: 'test',
    }
    expect(arePropsEqual()(prev, next)).toBe(false)
  })

  it('should perform shallow compare and return true if no change', () => {
    const prev = {
      propName: 'test',
      secondProps: 'test2',
    }
    const next = {
      propName: 'test',
      secondProps: 'test2',
    }
    expect(arePropsEqual(['propName'])(prev, next)).toBe(true)
  })

  it('should perform shallow compare and return false if at lease one prop value change', () => {
    const prev = {
      propName: 'test',
      secondProps: 'test2',
    }
    const next = {
      propName: 'test',
      secondProp: 'other_value',
    }
    expect(arePropsEqual(['propName', 'secondProp'])(prev, next)).toBe(false)
  })

  it('should perform shallow compare only', () => {
    const prev = {
      propName: 'test',
      secondProp: {
        innerProp: 'inner_value',
      },
    }
    const next = {
      propName: 'test',
      secondProp: {
        innerProp: 'inner_value',
      },
    }
    expect(arePropsEqual(['propName', 'secondProp'])(prev, next)).toBe(false)
  })

  it('should return true if child property refer to same object', () => {
    const secondProp = {
      innerProp: 'inner_value',
    }
    const prev = {
      propName: 'test',
      secondProp,
    }
    const next = {
      propName: 'test',
      secondProp,
    }
    expect(arePropsEqual(['propName', 'secondProp'])(prev, next)).toBe(true)
  })

  it('should be concerned only with passed list of props', () => {
    const prev = {
      propName: 'test',
      secondProp: 'some_value',
    }
    const next = {
      propName: 'test',
      secondProp: 'some_other_value',
    }
    expect(arePropsEqual(['propName'])(prev, next)).toBe(true)
  })
})
