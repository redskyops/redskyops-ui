import React from 'react'
import {shallow} from 'enzyme'

import {TrialsStatistics} from './TrialsStatistics.component'
import trialsStub from '../../../services/_stubs/trials-data'

describe('Component: TrialsStatistics', () => {
  let wrapper
  const props = {
    trials: trialsStub.trials,
  }

  it('should render TrailsStatistics', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render three icons', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('Icon')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should render text labels', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('.icon')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should render total number of trials', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('[data-dom-id="statistics-total-text"]')).toHaveLength(
      1,
    )
    expect(
      wrapper.find('[data-dom-id="statistics-total-text"]').text(),
    ).toContain('Total Trials')
    expect(wrapper.find('[data-dom-id="statistics-total"]').text()).toBe(
      `${props.trials.length}`,
    )
    wrapper.unmount()
  })

  it('should render number of completed trials', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(
      wrapper.find('[data-dom-id="statistics-completed-text"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('[data-dom-id="statistics-completed-text"]').text(),
    ).toContain('Completed Trials')
    expect(wrapper.find('[data-dom-id="statistics-completed"]').text()).toBe(
      `38`,
    )
    wrapper.unmount()
  })

  it('should render number of failed trials', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('[data-dom-id="statistics-failed-text"]')).toHaveLength(
      1,
    )
    expect(
      wrapper.find('[data-dom-id="statistics-failed-text"]').text(),
    ).toContain('Unstable Configurations')
    expect(wrapper.find('[data-dom-id="statistics-failed"]').text()).toBe(`2`)
    wrapper.unmount()
  })
})
