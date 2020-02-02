import React from 'react'
import {shallow} from 'enzyme'

import {RangeIndicator} from './RangeIndicator.component'

describe('Component: RangeIndicator', () => {
  let wrapper
  let props = {
    min: 0,
    max: 100,
    value: 30,
    width: 100,
    indicatorCalss: '',
  }

  it('should render RangeIndicator component', () => {
    wrapper = shallow(<RangeIndicator {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render bar', () => {
    wrapper = shallow(<RangeIndicator {...props} />)
    expect(wrapper.find('[data-dom-id="range-bar"]')).toHaveLength(1)
  })

  it('should render min and max value labels', () => {
    wrapper = shallow(<RangeIndicator {...props} />)
    expect(wrapper.find('[data-dom-id="range-label-min"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="range-label-min"]').text()).toBe('0')

    expect(wrapper.find('[data-dom-id="range-label-max"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="range-label-max"]').text()).toBe('100')
  })

  it('should render inidcator', () => {
    wrapper = shallow(<RangeIndicator {...props} />)
    expect(wrapper.find('[data-dom-id="range-indicator"]')).toHaveLength(1)
  })

  it('should render inidcator at right position', () => {
    wrapper = shallow(<RangeIndicator {...props} />)
    const {min, max, value, width} = props
    const expectedLeft = Math.round((width * value) / (max - min))
    expect(
      wrapper.find('[data-dom-id="range-indicator"]').props().style,
    ).toHaveProperty('width', `${expectedLeft}%`)
  })

  it('should not set indector to max if value higher', () => {
    wrapper = shallow(<RangeIndicator {...props} value={200} />)
    expect(
      wrapper.find('[data-dom-id="range-indicator"]').props().style,
    ).toHaveProperty('width', '100%')
  })

  it('should not set indector to min if value less', () => {
    wrapper = shallow(<RangeIndicator {...props} value={-20} />)
    expect(
      wrapper.find('[data-dom-id="range-indicator"]').props().style,
    ).toHaveProperty('width', '0%')
  })

  it('should default width 200 if not passed with props', () => {
    const localProps = {...props}
    delete localProps.width
    wrapper = shallow(<RangeIndicator {...localProps} />)

    expect(
      wrapper
        .find('div')
        .first()
        .props().style,
    ).toHaveProperty('width', 200)
  })
})
