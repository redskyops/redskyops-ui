import React from 'react'
import {mount} from 'enzyme'

import {Icon} from './Icon.component'

describe('Icon component', () => {
  let wrapper
  const props = {
    icon: 'search',
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
    const errorSpy = jest.spyOn(console, 'error')
    errorSpy.mockImplementation(() => '')
    wrapper.setProps({icon: 'blah'})
    expect(wrapper.find('svg')).toHaveLength(0)
    expect(errorSpy).toHaveBeenCalledTimes(1)
    errorSpy.mockRestore()
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

  it('should set alt property if passed as prop', () => {
    wrapper.setProps({alt: 'test_alt'})
    expect(wrapper.find('svg').props().alt).toBe('test_alt')
  })
})
