import React from 'react'
import {shallow} from 'enzyme'
import {BrowserRouter, Switch} from 'react-router-dom'

import App from './App'
import Page404 from './components/Page404/Page404.component'
import Layout from './components/Layout/Layout.component'

describe('Component: App', () => {
  let wrapper
  it('renders without crashing', () => {
    wrapper = shallow(<App />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should include route for /', () => {
    wrapper = shallow(<App />)
    expect(wrapper.find(BrowserRouter)).toHaveLength(1)
    wrapper.unmount()
  })

  it('should set basname property for router', () => {
    wrapper = shallow(<App />)
    expect(wrapper.find(BrowserRouter).prop('basename')).toBe('/')
    wrapper.unmount()
  })

  it('should include route for /', () => {
    wrapper = shallow(<App />)
    const layout = wrapper.find('Route').findWhere(r => r.props().path === '/')
    expect(layout).toHaveLength(1)
    expect(layout.props()).toHaveProperty('component', Layout)
    wrapper.unmount()
  })

  it('should render Switch component', () => {
    wrapper = shallow(<App />)
    expect(wrapper.find(Switch)).toHaveLength(1)
    wrapper.unmount()
  })

  it('should include Route for 404', () => {
    wrapper = shallow(<App />)
    const route404 = wrapper
      .find('Route')
      .findWhere(r => r.props().path === '*')
    expect(route404).toHaveLength(1)
    expect(route404.props()).toHaveProperty('component', Page404)
    wrapper.unmount()
  })
})
