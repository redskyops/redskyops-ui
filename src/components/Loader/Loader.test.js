import React from 'react'
import {shallow} from 'enzyme'

import {Loader} from './Loader.component'

describe('Loader component', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Loader />)
  })

  it('should render Loader component', () => {
    expect(wrapper).toHaveLength(1)
  })

  it('should render component out of app DOM hierarchy', () => {
    expect(wrapper.find('OverlayPortal')).toHaveLength(1)
  })

  it('should set the color as css var if passed in props', () => {
    wrapper.setProps({color: '#ff0'})
    expect(wrapper.find('[data-dom-id="app-loader"]').props()).toHaveProperty(
      'style',
    )
    expect(
      wrapper.find('[data-dom-id="app-loader"]').props().style,
    ).toMatchObject({'--loader-color': '#ff0'})
  })
})
