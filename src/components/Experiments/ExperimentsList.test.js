import React from 'react'
import {mount} from 'enzyme'

import {ExperimentsList} from './ExperimentsList.component'
import expStub from '../../services/_stubs/exp-data'
import {ExperimentsService} from '../../services/ExperimentsService'
import {HttpService} from '../../services/HttpService'

jest.mock('../../services/HttpService', () =>
  jest.requireActual('../../services/__mocks__/HttpService'),
)
// jest.mock('../../services/ExperimentsService', () => jest.requireActual('../../services/__mocks__/ExperimentsService'))

describe('Component: ExperimentList', () => {
  const expService = new ExperimentsService()
  const http = new HttpService()

  let wrapper
  const props = {
    experiments: {
      list: [],
    },
    activExperiment: null,
    updateState: jest.fn(),
  }

  beforeEach(() => {
    http.get.mockReset()
    props.updateState.mockClear()
  })

  it('should render ExperimentsList component', () => {
    http.get.mockImplementationOnce(() => [
      () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(expStub),
        }),
      () => {},
    ])
    wrapper = mount(<ExperimentsList {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should load experiments on mount', () => {
    http.get.mockImplementationOnce(() => [
      () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(expStub),
        }),
      () => {},
    ])
    wrapper = mount(<ExperimentsList {...props} />)
    expect(http.get).toHaveBeenCalledTimes(1)
    expect(http.get.mock.calls[0][0]).toHaveProperty('url', '/api/experiments/')
  })

  it('should update state after loading speriments', async done => {
    http.get.mockImplementationOnce(() => [
      () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(expStub),
        }),
      () => {},
    ])
    wrapper = await mount(<ExperimentsList {...props} />)

    setImmediate(() => {
      expect(props.updateState).toHaveBeenCalledTimes(1)
      expect(props.updateState.mock.calls[0][0]).toHaveProperty('experiments')
      expect(props.updateState.mock.calls[0][0].experiments).toMatchObject({
        list: expService.addIdsToExperments(expStub).experiments,
      })
      done()
    })
  })

  it('should render ListSearch with right props', () => {
    http.get.mockImplementationOnce(() => [
      () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(expStub),
        }),
      () => {},
    ])
    wrapper = mount(<ExperimentsList {...props} />)
    expect(wrapper.find('ListSearch')).toHaveLength(1)
    const listProps = wrapper.find('ListSearch').props()
    expect(typeof listProps.onSelect).toBe('function')
    expect(Array.isArray(listProps.itemsList)).toBe(true)
  })

  it('should render number of experiments loaded', () => {
    http.get.mockImplementationOnce(() => [
      () =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(expStub),
        }),
      () => {},
    ])
    const localProps = {
      ...props,
      experiments: {
        list: expService.addIdsToExperments(expStub).experiments,
      },
    }
    wrapper = mount(<ExperimentsList {...localProps} />)
    expect(wrapper.find('[data-dom-id="experiments-num"]').text()).toBe(
      `${localProps.experiments.list.length}`,
    )
  })
})
