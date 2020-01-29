import React from 'react'
import {mount} from 'enzyme'

import {Icon} from './Icon.component'

xdescribe('Icon component', () => {
  let wrapper
  const props = {
    icon: 'menu',
  }

  beforeEach(() => {
    wrapper = mount(<Icon {...props} />)
  })

  it('should render Icon component', () => {
    expect(wrapper).toHaveLength(1)
  })

  it('should render a svg tag', () => {
    expect(wrapper.find('svg')).toHaveLength(1)
  })

  it('should render nothing if icon props not identified', () => {
    wrapper.setProps({icon: 'blah'})
    expect(wrapper.find('svg')).toHaveLength(0)
  })

  it('should set default width to 24 pixel', () => {
    expect(wrapper.find('svg').props()).toHaveProperty('style')
    expect(wrapper.find('svg').props().style).toMatchObject({width: 24})
  })

  it('should set css var --icon-color from color prop', () => {
    wrapper.setProps({color: '#f00'})
    expect(wrapper.find('svg').props().style).toHaveProperty('--icon-color')
    expect(wrapper.find('svg').props().style['--icon-color']).toBe('#f00')
  })
})
