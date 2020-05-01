import React from 'react'
import {StaticRouter as Router} from 'react-router-dom'
import {shallow, mount} from 'enzyme'

import {Layout} from './Layout.component'

import Header from '../Header/Header.component'
import Main from '../Main/Main.component'
import LeftPanel from '../LeftPanel/LeftPanel.component'

describe('Component: Layout', () => {
  let wrapper

  beforeEach(() => {})

  it('should render Layout component', () => {
    wrapper = shallow(<Layout />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render Header and Main components', () => {
    wrapper = mount(
      <Router>
        <Layout />
      </Router>,
    )
    expect(wrapper.find(Header)).toHaveLength(1)
    expect(wrapper.find(Main)).toHaveLength(1)
    expect(wrapper.find(LeftPanel)).toHaveLength(1)
    wrapper.unmount()
  })
})
