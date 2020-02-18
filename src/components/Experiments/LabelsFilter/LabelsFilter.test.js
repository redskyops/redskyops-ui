import React from 'react'
import {shallow} from 'enzyme'

import {LabelsFilter} from './LabelsFilter.component'

describe('Component: LabelsFilter', () => {
  let wrapper
  let props = {
    labelsList: ['cost', 'duration', 'throughput'],
    selectedValues: ['duration'],
    onChange: jest.fn(),
  }

  beforeEach(() => {
    props.onChange.mockClear()
  })

  it('should render LabelsFilter', () => {
    wrapper = shallow(<LabelsFilter {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render ListSearchMulti with right props', () => {
    wrapper = shallow(<LabelsFilter {...props} />)
    expect(wrapper.find('ListSearchMulti')).toHaveLength(1)
    expect(wrapper.find('ListSearchMulti').prop('value')).toBe(
      props.selectedValues,
    )
    expect(
      Array.isArray(wrapper.find('ListSearchMulti').prop('itemsList')),
    ).toBe(true)
    expect(wrapper.find('ListSearchMulti').prop('itemsList')).toEqual(
      props.labelsList.map(value => ({label: value.toUpperCase(), value})),
    )
    expect(wrapper.find('ListSearchMulti').prop('onChange')).toBe(
      props.onChange,
    )
    wrapper.unmount()
  })

  it('should render clear button if there is selected label', () => {
    wrapper = shallow(<LabelsFilter {...props} />)
    expect(wrapper.find('button.btn')).toHaveLength(1)
    expect(wrapper.find('Icon')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render icon if there are not selected labels', () => {
    let localProps = {
      ...props,
      selectedValues: [],
    }
    wrapper = shallow(<LabelsFilter {...localProps} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
    expect(wrapper.find('button.btn')).toHaveLength(0)

    localProps = {
      ...props,
    }
    delete localProps.selectedValues
    wrapper = shallow(<LabelsFilter {...localProps} />)
    expect(wrapper.find('Icon')).toHaveLength(1)
    expect(wrapper.find('button.btn')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should call onChange if clear button clicked', () => {
    wrapper = shallow(<LabelsFilter {...props} />)
    wrapper.find('button.btn').simulate('click', {preventDefault: () => {}})
    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange.mock.calls[0][0]).toMatchObject({
      indexs: [],
      items: [],
    })
    wrapper.unmount()
  })
})
