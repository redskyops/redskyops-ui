import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'

import {ListSearchMulti} from './ListSearchMulti.component'

describe('ListSearchMulti component', () => {
  let wrapper
  let props = {
    value: [],
    itemsList: [
      {label: 'one', value: 1},
      {label: 'two', value: 2},
      {label: 'three', value: 3},
    ],
    onChange: jest.fn(),
    placeholder: 'placeholder_test',
  }

  beforeEach(() => {
    props.onChange.mockClear()
  })

  it('should render Dropdown component', () => {
    wrapper = mount(<ListSearchMulti {...props} />)
    expect(wrapper).toHaveLength(1)
    wrapper.unmount()
  })

  it('should render text box to hold selected item', () => {
    wrapper = mount(<ListSearchMulti {...props} />)
    expect(wrapper.find('input[type="text"]')).toHaveLength(1)
    wrapper.unmount()
  })

  it('should set text value to placeholder', () => {
    const localProps = {
      ...props,
      value: 3,
    }
    wrapper = mount(<ListSearchMulti {...localProps} />)
    expect(wrapper.find('input[type="text"]').props().defaultValue).toBe(
      'placeholder_test',
    )
    wrapper.unmount()
  })

  it('should show dropdown menu on focus', () => {
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('input[type="text"]')
      .first()
      .simulate('focus')
    expect(wrapper.find('button.item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should show dropdown menu on icon click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('should toggle menu on/off on icon click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    expect(wrapper.find('button.item')).toHaveLength(0)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(3)

    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('button.item')).toHaveLength(0)

    wrapper.unmount()
  })

  it('should call onChange on item click', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    const menuItems = wrapper.find('button.item')
    expect(menuItems).toHaveLength(3)

    menuItems.at(2).simulate('click', event)
    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange.mock.calls[0][0]).toMatchObject({
      indexs: [2],
      items: [{label: 'three', value: 3}],
    })
    wrapper.unmount()
  })

  it('should right css class on selected item', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} value={[1, 3]} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)

    const menuItems = wrapper.find('button.item')
    expect(menuItems.at(0).hasClass('selected')).toBe(true)
    expect(menuItems.at(1).hasClass('selected')).toBe(false)
    expect(menuItems.at(2).hasClass('selected')).toBe(true)
    wrapper.unmount()
  })

  it('should add label div to show placholder text', () => {
    wrapper = mount(<ListSearchMulti {...props} value="three" />)
    expect(wrapper.find('[data-dom-id="label"]')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="label"]').text()).toBe(
      'placeholder_test',
    )
    wrapper.unmount()
  })

  it('should show menu on label click and hide label', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} value="three" />)
    wrapper.find('[data-dom-id="label"]').simulate('click', event)
    expect(wrapper.find('.list')).toHaveLength(1)
    expect(wrapper.find('[data-dom-id="label"]')).toHaveLength(0)
    wrapper.unmount()
  })

  it('should clear input text if menu is open', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)

    expect(wrapper.find('input').text()).toBe('')
    wrapper.unmount()
  })

  it('should show filtered item if user type in input box', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)

    const input = wrapper.find('input[type="text"]')
    input.simulate('change', {target: {value: 'two'}})
    expect(wrapper.find('button.item')).toHaveLength(1)
    expect(
      wrapper
        .find('button.item')
        .at(0)
        .text(),
    ).toBe('two')
    wrapper.unmount()
  })

  it('should not close menu if user click element inside it', done => {
    const eventsMap = {}
    const docAddEventSpy = jest.spyOn(document, 'addEventListener')
    docAddEventSpy.mockImplementation((event, callback) => {
      eventsMap[event] = callback
    })
    const clickEvent = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }

    wrapper = mount(<ListSearchMulti {...props} />)
    const containsSpy = jest
      .spyOn(
        wrapper
          .find('div')
          .first()
          .getDOMNode(),
        'contains',
      )
      .mockReturnValue(true)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', clickEvent)

    expect(wrapper.find('button.item')).toHaveLength(3)

    act(() => {
      eventsMap.click({target: null})

      setImmediate(() => {
        wrapper.update()
        expect(wrapper.find('button.item')).toHaveLength(3)

        docAddEventSpy.mockRestore()
        containsSpy.mockRestore()
        wrapper.unmount()
        done()
      })
    })
  })

  it('close menu if user click outside component', done => {
    const eventsMap = {}
    const docAddEventSpy = jest.spyOn(document, 'addEventListener')
    docAddEventSpy.mockImplementation((event, callback) => {
      eventsMap[event] = callback
    })
    const clickEvent = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    wrapper = mount(<ListSearchMulti {...props} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', clickEvent)
    expect(wrapper.find('.list')).toHaveLength(1)

    const containsSpy = jest
      .spyOn(
        wrapper
          .find('div')
          .first()
          .getDOMNode(),
        'contains',
      )
      .mockReturnValue(false)
    act(() => {
      eventsMap.click({target: null})

      setImmediate(() => {
        wrapper.update()
        expect(wrapper.find('.list')).toHaveLength(0)

        docAddEventSpy.mockRestore()
        containsSpy.mockRestore()
        wrapper.unmount()
        done()
      })
    })
  })

  it('should render ListSearchMulti with default props values', () => {
    const localProps = {...props}
    delete localProps.value
    delete localProps.onChange
    delete localProps.placeholder
    wrapper = mount(<ListSearchMulti {...localProps} />)
    expect(wrapper.find('[data-dom-id="label"]').text()).toBe('')
    wrapper.unmount()
  })

  it('should send empty array in indexs and items if values props contains invalid value', () => {
    const event = {
      preventDefault: () => {},
      nativeEvent: {
        stopImmediatePropagation: () => {},
      },
    }
    const localProps = {
      ...props,
      value: [1, 1000],
    }
    wrapper = mount(<ListSearchMulti {...localProps} />)
    wrapper
      .find('button.icon')
      .first()
      .simulate('click', event)
    expect(wrapper.find('.list')).toHaveLength(1)
    expect(wrapper.find('.item')).toHaveLength(3)
    expect(
      wrapper
        .find('.item')
        .first()
        .hasClass('selected'),
    ).toBe(true)
    wrapper
      .find('.item')
      .first()
      .simulate('click')
    expect(props.onChange).toHaveBeenCalledTimes(1)
    expect(props.onChange.mock.calls[0][0]).toMatchObject({
      indexs: [],
      items: [],
    })
    wrapper.unmount()
  })
})
