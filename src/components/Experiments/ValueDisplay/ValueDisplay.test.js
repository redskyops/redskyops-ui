import React from 'react'
import {shallow} from 'enzyme'

import {ValueDisplay} from './ValueDisplay.component'

describe('Component: ValueDisplay', () => {
  let wrapper
  const props = {
    name: 'name_test',
    value: '59',
  }

  beforeEach(() => {})

  it('should render ValueDisplay', () => {
    wrapper = shallow(<ValueDisplay {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render name and value', () => {
    wrapper = shallow(<ValueDisplay {...props} />)
    expect(wrapper.find('[data-dom-id="value-display-name"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="value-display-name"]').text()).toBe(
      'name_test',
    )
    expect(wrapper.find('[data-dom-id="value-display-value"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="value-display-value"]').text()).toBe(
      '59',
    )
    wrapper.unmount()
  })

  it('should format the value if fomrater function passed', () => {
    const valueFormater = jest.fn(() => 'formated_value')
    wrapper = shallow(<ValueDisplay {...props} valueFormater={valueFormater} />)
    expect(wrapper.find('[data-dom-id="value-display-value"]').text()).toBe(
      'formated_value',
    )
    wrapper.unmount()
  })

  it('should render RangeIndicator if min and max props passed', () => {
    wrapper = shallow(<ValueDisplay {...props} min={0} max={100} />)
    expect(wrapper.find('RangeIndicator')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should NOT render RangeIndicator if min props is not valid numbers', () => {
    wrapper = shallow(<ValueDisplay {...props} min="not_number" max={100} />)
    expect(wrapper.find('RangeIndicator')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should NOT render RangeIndicator if max props is not valid numbers', () => {
    wrapper = shallow(<ValueDisplay {...props} min={10} max="not_number" />)
    expect(wrapper.find('RangeIndicator')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should pass right props to RangeIndicator', () => {
    wrapper = shallow(<ValueDisplay {...props} min={10} max={100} />)
    expect(wrapper.find('RangeIndicator').props()).toHaveProperty('min', 10)
    expect(wrapper.find('RangeIndicator').props()).toHaveProperty('max', 100)
    expect(wrapper.find('RangeIndicator').props()).toHaveProperty(
      'value',
      props.value,
    )
    wrapper.unmount()
  })
})
