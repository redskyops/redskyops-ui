import React from 'react'
import {shallow} from 'enzyme'

import {Page404} from './Page404.component'

describe('Component: Page404', () => {
  let wrapper

  it('should render Page404', () => {
    wrapper = shallow(<Page404 />)
    expect(wrapper).toHaveLength(1)
  })

  it('should render 404 content', () => {
    wrapper = shallow(<Page404 />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBeTruthy()
    expect(wrapper.find('p')).toHaveLength(1)
    expect(wrapper.find('p').text()).toBeTruthy()
  })
})
