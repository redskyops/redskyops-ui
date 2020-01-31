import React, {useState, useEffect, useRef} from 'react'

import style from './ListSearchMulti.module.scss'
import Icon from '../../Icon/Icon.component'

type Props = {
  value?: Array<string | number>,
  itemsList: Array<{label: string, value: any}>,
  placeholder: string,
  onChange: (val: Object) => any,
}

const mapValuesToIndex = (value, itemsList) => {
  /* eslint-disable indent */
  return Array.isArray(value) && value.length > 0
    ? value
        .map(val => itemsList.findIndex(item => item.value === val))
        .filter(i => i >= 0)
    : []
  /* eslint-enable indent */
}

export const ListSearchMulti = (props: Props) => {
  const {value = [], itemsList, placeholder, onChange} = props
  const initialIndex = mapValuesToIndex(value, itemsList)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [tempIndex, setTempIndex] = useState(0)
  const [tempSearch, setTempSearch] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  let blurInterval

  const filteredList = (itemsList || [])
    .map((i, index) => ({...i, index}))
    .filter(item => {
      return item.label.match(new RegExp(`${tempSearch}`, 'ig'))
    })

  const openMenu = () => {
    clearTimeout(blurInterval)
    setIsOpen(true)
    setTempIndex(0)
    setTempSearch('')
    inputRef.current.value = ''
    document.removeEventListener('click', documentClick)
    document.addEventListener('click', documentClick)
  }

  const closeMenu = () => {
    clearTimeout(blurInterval)
    setIsOpen(false)
    setTempIndex(0)
    setTempSearch('')
    document.removeEventListener('click', documentClick)
  }

  const handelFocus = () => {
    openMenu()
  }

  const handelClick = shouldClose => e => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    if (isOpen) {
      shouldClose && closeMenu()
      return
    }
    openMenu()
  }

  const setValue = index => {
    setTempSearch('')
    const newValue = [...selectedIndex]
    const indexOfItem = newValue.indexOf(index)
    if (indexOfItem > -1) {
      newValue.splice(indexOfItem, 1)
    } else {
      newValue.push(index)
    }
    setSelectedIndex(newValue)
    inputRef.current.value = ''

    onChange({indexs: newValue, items: newValue.map(i => itemsList[i])})
  }

  const itemClick = index => () => {
    setValue(index)
    // closeMenu()
  }

  const documentClick = e => {
    if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
      return
    }
    closeMenu()
  }

  const handelPress = e => {
    if (!isOpen) {
      return
    }
    let nextIndex = tempIndex
    switch (e.key) {
      case 'ArrowDown':
        nextIndex += 1
        break
      case 'ArrowUp':
        nextIndex -= 1
        break
      case 'Enter':
        setValue(filteredList[tempIndex].index)
        closeMenu()
        return
      case 'Escape':
        e.preventDefault()
        closeMenu()
        return
      default:
        setTempSearch(e.target.value)
        return
    }
    if (nextIndex < 0) nextIndex = 0
    if (nextIndex > filteredList.length - 1) nextIndex = filteredList.length - 1
    setTempIndex(nextIndex)

    const targetItem = document.querySelector(`#listSearch-${nextIndex}`)
    if (targetItem) targetItem.scrollIntoView()
  }

  useEffect(() => {
    setSelectedIndex(initialIndex)
    return () => {
      // eslint-disable-next-line
      clearTimeout(blurInterval)
      // eslint-disable-next-line
      document.removeEventListener('click', documentClick)
    }
  }, [value])

  let textToShow = placeholder
  if (!textToShow) {
    textToShow = placeholder
  }
  if (isOpen) {
    textToShow = ''
  }

  return (
    <div className={style.listSearch} ref={wrapperRef}>
      {!isOpen && (
        <div // eslint-disable-line
          data-dom-id="label"
          className={style.valuePlacehoder}
          onClick={e => {
            inputRef.current.focus()
            handelClick(false)(e)
          }}
        >
          {textToShow}
        </div>
      )}
      <input
        type="text"
        ref={inputRef}
        defaultValue={textToShow}
        className={style.input}
        onFocus={handelFocus}
        // onBlur={handelBlur}
        onClick={handelClick(false)}
        onKeyUp={handelPress}
      />
      <button className={style.icon} onClick={handelClick(true)}>
        <Icon
          icon={isOpen ? 'circleX' : 'arrowDown'}
          width={isOpen ? 17 : 14}
        />
      </button>
      {isOpen && (
        <div className={style.list}>
          <div className={style.listInner}>
            {filteredList.length > 0 &&
              filteredList.map((item, index) => {
                let css = style.item
                css += index === tempIndex ? ` ${style.active}` : ''
                css +=
                  selectedIndex.indexOf(index) > -1 ? ` ${style.selected}` : ''
                return (
                  <button
                    className={css}
                    id={`listSearch-${index}`}
                    key={`${item.index}-${item.value}`}
                    onClick={itemClick(item.index)}
                  >
                    <span className={style.circle} />
                    {item.label}
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ListSearchMulti
