import React from 'react'
import {shallow} from 'enzyme'

import {TrialsStatistics} from './TrialsStatistics.component'
import trialsStub from '../../../services/_stubs/trials-data'

describe('Component: TrialsStatistics', () => {
  let wrapper
  const props = {
    trials: trialsStub.trials,
    activeExperiment: {
      tab: 0,
      metricsList: ['cost', 'duration', 'cpu'],
      metricsRanges: {
        cost: {
          min: 0,
          max: 100,
          rangeMin: 0,
          rangeMax: 100,
          filteredMin: 0,
          filteredMax: 100,
        },
        duration: {
          min: 0,
          max: 200,
          rangeMin: 0,
          rangeMax: 200,
          filteredMin: 0,
          filteredMax: 200,
        },
        cpu: {
          min: 0,
          max: 500,
          rangeMin: 0,
          rangeMax: 400,
          filteredMin: 0,
          filteredMax: 400,
        },
        memory: {
          min: 0,
          max: 100,
          rangeMin: 0,
          rangeMax: 1000,
          filteredMin: 0,
          filteredMax: 1000,
        },
      },
      xAxisMetric: 'cost',
      yAxisMetric: 'duration',
      zAxisMetric: 'cpu',
    },
    onSliderChange: jest.fn(),
  }

  beforeEach(() => {
    props.onSliderChange.mockClear()
  })

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

  it('should render zero if no completed trials', () => {
    wrapper = shallow(<TrialsStatistics {...props} trials={[]} />)
    expect(
      wrapper.find('[data-dom-id="statistics-completed-text"]'),
    ).toHaveLength(1)
    expect(
      wrapper.find('[data-dom-id="statistics-completed-text"]').text(),
    ).toContain('Completed Trials')
    expect(wrapper.find('[data-dom-id="statistics-completed"]').text()).toBe(
      `0`,
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

  it('should render zero if no failed trials', () => {
    wrapper = shallow(<TrialsStatistics {...props} trials={[]} />)
    expect(wrapper.find('[data-dom-id="statistics-failed-text"]')).toHaveLength(
      1,
    )
    expect(
      wrapper.find('[data-dom-id="statistics-failed-text"]').text(),
    ).toContain('Unstable Configurations')
    expect(wrapper.find('[data-dom-id="statistics-failed"]').text()).toBe(`0`)
    wrapper.unmount()
  })

  it('should render sliders based on metricsList', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(
      props.activeExperiment.metricsList.length,
    )
    wrapper.find('RangeSlider').forEach((slider, index) => {
      expect(slider.props()).toMatchObject(
        props.activeExperiment.metricsRanges[
          props.activeExperiment.metricsList[index]
        ],
      )
      expect(typeof slider.prop('onChange')).toBe('function')
    })
    wrapper.unmount()
  })

  it('should render on slider if metrics list contains one slider', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsList: ['cost'],
      },
    }
    wrapper = shallow(<TrialsStatistics {...localProps} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render sliders based on metric parameter axis selection ', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        tab: 1,
        metricParameterChart: {
          metric: 'cost',
          parameter: 'cpu',
        },
      },
    }
    wrapper = shallow(<TrialsStatistics {...localProps} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(2)
    expect(
      wrapper
        .find('RangeSlider')
        .at(0)
        .props(),
    ).toMatchObject(
      props.activeExperiment.metricsRanges[
        localProps.activeExperiment.metricParameterChart.metric
      ],
    )
    expect(
      typeof wrapper
        .find('RangeSlider')
        .at(0)
        .prop('onChange'),
    ).toBe('function')
    expect(
      wrapper
        .find('RangeSlider')
        .at(1)
        .props(),
    ).toMatchObject(
      props.activeExperiment.metricsRanges[
        localProps.activeExperiment.metricParameterChart.parameter
      ],
    )
    expect(
      typeof wrapper
        .find('RangeSlider')
        .at(1)
        .prop('onChange'),
    ).toBe('function')
    wrapper.unmount()
  })

  it('should not render sliders if neither metric nor parameter selected', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        tab: 1,
        metricParameterChart: null,
      },
    }
    wrapper = shallow(<TrialsStatistics {...localProps} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(0)

    wrapper.unmount()
  })

  it('should render sliders for metrics with valid rangeMax and rangeMin', () => {
    const localProps = {
      ...props,
      activeExperiment: {
        ...props.activeExperiment,
        metricsRanges: {
          ...props.activeExperiment.metricsRanges,
          cost: {
            min: 0,
            max: 100,
            rangeMax: 100,
            filteredMin: 0,
            filteredMax: 100,
          },
          duration: {
            min: 0,
            max: 200,
            rangeMin: 0,
            filteredMin: 0,
            filteredMax: 200,
          },
        },
      },
    }
    delete localProps.activeExperiment.metricsRanges.cpu

    wrapper = shallow(<TrialsStatistics {...localProps} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should call onSliderChange', () => {
    wrapper = shallow(<TrialsStatistics {...props} />)
    expect(wrapper.find('RangeSlider')).toHaveLength(
      props.activeExperiment.metricsList.length,
    )
    wrapper
      .find('RangeSlider')
      .first()
      .prop('onChange')({min: 23, max: 208})
    expect(props.onSliderChange).toHaveBeenCalledTimes(1)
    expect(props.onSliderChange.mock.calls[0][0]).toEqual({
      metric: 'cost',
      range: {min: 23, max: 208},
    })

    wrapper
      .find('RangeSlider')
      .at(1)
      .prop('onChange')({min: 59, max: 98})
    expect(props.onSliderChange).toHaveBeenCalledTimes(2)
    expect(props.onSliderChange.mock.calls[1][0]).toEqual({
      metric: 'duration',
      range: {min: 59, max: 98},
    })
    wrapper.unmount()
  })
})
