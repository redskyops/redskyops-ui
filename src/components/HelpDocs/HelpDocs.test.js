import React from 'react'
import {shallow} from 'enzyme'

import {HelpDocs} from './HelpDocs.component'

describe('HelpDocs component', () => {
  let wrapper

  it('should render HelpDocs', () => {
    wrapper = shallow(<HelpDocs />)
    expect(wrapper).toHaveLength(1)
  })

  it('should render title', () => {
    wrapper = shallow(<HelpDocs />)
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBeTruthy()
  })

  it('should render link to general infomation page', () => {
    wrapper = shallow(<HelpDocs />)
    expect(wrapper.find('a')).toHaveLength(2)
    expect(
      wrapper
        .find('a')
        .first()
        .prop('target'),
    ).toBe('_blank')
    expect(
      wrapper
        .find('a')
        .first()
        .prop('href'),
    ).toBe('//redskyops.dev/docs/')
  })

  it('should render link to recipes page', () => {
    wrapper = shallow(<HelpDocs />)
    expect(wrapper.find('a')).toHaveLength(2)
    expect(
      wrapper
        .find('a')
        .last()
        .prop('target'),
    ).toBe('_blank')
    expect(
      wrapper
        .find('a')
        .last()
        .prop('href'),
    ).toBe('//github.com/redskyops/redskyops-recipes')
  })
})
