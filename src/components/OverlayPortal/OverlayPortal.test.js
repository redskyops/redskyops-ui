import React from 'react'
import {mount} from 'enzyme'

import OverlayPortal from './OverlayPortal.component'

describe('Component: OverlayPortal', () => {
  let wrapper
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    ;(d => d && d.parentElement.removeChild(d))(
      document.getElementById('overlay'),
    )
  })

  fit('should render something in portal mount point', () => {
    const dev = document.createElement('div')
    dev.setAttribute('id', 'overlay')
    document.querySelector('body').appendChild(dev)

    wrapper = mount(
      <OverlayPortal>
        <div id="testDiv">test div</div>
      </OverlayPortal>,
    )
    expect(wrapper.find('#overlay')).toHaveLength(0)
    expect(wrapper.find('#testDiv')).toHaveLength(1)
  })

  fit('should return null if mounting point not found in dom', () => {
    wrapper = mount(
      <OverlayPortal>
        <div id="testDiv">test div</div>
      </OverlayPortal>,
    )
    expect(wrapper).toMatchObject({})
  })

  fit('should return error text node if mounting point not found in dom', () => {
    process.env.NODE_ENV = 'development'
    wrapper = mount(
      <OverlayPortal>
        <div id="testDiv">test div</div>
      </OverlayPortal>,
    )
    expect(wrapper.html()).toBe(
      'DOM element with id "overlay" not found to mount the portal',
    )
  })
})
