import React from 'react'
import {shallow} from 'enzyme'

import {Tabs} from './Tabs.component'

describe('Component: Tabs', () => {
  let wrapper

  it('should render Tabs', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" title="two" />
      </Tabs>,
    )
    expect(wrapper).toHaveLength(1)
  })

  it('should render first tab by default', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" title="two" />
      </Tabs>,
    )
    expect(wrapper.find('div#one')).toHaveLength(1)
    expect(wrapper.find('div#two')).toHaveLength(0)
  })

  it('should render list of buttons to switch tabs', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" title="two" />
      </Tabs>,
    )
    expect(wrapper.find('button.button')).toHaveLength(2)
    wrapper.find('button.button').forEach((b, i) => {
      expect(b.text()).toBe(['one', 'two'][i])
    })
  })

  it('should set right css class to active button', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" title="two" />
      </Tabs>,
    )
    expect(
      wrapper
        .find('button.button')
        .first()
        .hasClass('active'),
    ).toBe(true)
    expect(wrapper.find('button.active')).toHaveLength(1)
    wrapper
      .find('button.button')
      .last()
      .simulate('click', {preventDefault: () => {}})
    expect(
      wrapper
        .find('button.button')
        .first()
        .hasClass('active'),
    ).toBe(false)
    expect(
      wrapper
        .find('button.button')
        .last()
        .hasClass('active'),
    ).toBe(true)
    expect(wrapper.find('button.active')).toHaveLength(1)
  })

  it('should render right tab content', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" title="two" />
      </Tabs>,
    )
    wrapper
      .find('button.button')
      .last()
      .simulate('click', {preventDefault: () => {}})
    expect(wrapper.find('div#one')).toHaveLength(0)
    expect(wrapper.find('div#two')).toHaveLength(1)
  })

  it('should render empty span in button if title is missing', () => {
    wrapper = shallow(
      <Tabs>
        <div id="one" title="one" />
        <div id="two" />
      </Tabs>,
    )
    expect(
      wrapper
        .find('button.button')
        .last()
        .text(),
    ).toBe('&sbsp;')
  })
})
