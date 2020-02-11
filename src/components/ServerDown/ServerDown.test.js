import React from 'react'
import {shallow} from 'enzyme'

import {ServerDown} from './ServerDown.component'

describe('Component: ServerDown', () => {
  let wrapper

  it('should render ServerDown', () => {
    wrapper = shallow(<ServerDown />)
    expect(wrapper).toHaveLength(1)
  })

  it('should render 404 content', () => {
    wrapper = shallow(<ServerDown />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBeTruthy()
    expect(wrapper.find('p')).toHaveLength(1)
    expect(wrapper.find('p').text()).toBeTruthy()
  })
})
