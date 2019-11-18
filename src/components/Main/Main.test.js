import React from 'react'
import {shallow} from 'enzyme'

import {Main} from './Main.component'
import Page404 from '../Page404/Page404.component'

describe('Component: Main', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Main />)
  })

  it('should render Main component', () => {
    expect(wrapper).toHaveLength(1)
  })

  it('should render <main> tag', () => {
    expect(wrapper.find('main')).toHaveLength(1)
  })

  it('should Switch tag for different routers', () => {
    expect(wrapper.find('Switch')).toHaveLength(1)
  })

  it('should include Route for /', () => {
    expect(
      wrapper.find('Route').findWhere(r => r.props().path === '/'),
    ).toHaveLength(1)
  })

  it('should include Route for 404', () => {
    const route404 = wrapper
      .find('Route')
      .findWhere(r => r.props().path === '*')
    expect(route404).toHaveLength(1)
    expect(route404.props()).toHaveProperty('component', Page404)
  })
})
