import React from 'react'
import {shallow} from 'enzyme'

import {Layout} from './Layout.component'

describe('Component: Layout', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Layout />)
  })

  it('should render Layout component', () => {
    expect(wrapper).toHaveLength(1)
  })

  it('should render Header and Main components', () => {
    expect(wrapper.find('Header')).toHaveLength(1)
    expect(wrapper.find('Main')).toHaveLength(1)
  })
})
