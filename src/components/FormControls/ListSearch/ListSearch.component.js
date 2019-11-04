import React, {useState, useEffect, useRef} from 'react'

import style from './ListSearch.module.scss'

type Props = {
  value: string,
  itemsList: Array<{label: string, value: any}>,
  onSelect: (val: Object) => any,
}

export const ListSearch = (props: Props) => {
  const {value, itemsList, onSelect} = props
  const initialIndex = value
    ? itemsList.findIndex(item => item.value === value)
    : -1
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [tempIndex, setTempIndex] = useState(selectedIndex)
  const [tempSearch, setTempSearch] = useState('')
  const wrapperRef = useRef(null)
  let blurInterval

  const openMenu = () => {
    clearTimeout(blurInterval)
    setIsOpen(true)
    setTempIndex(selectedIndex)
    setTempSearch('')
    document.removeEventListener('click', documentClick)
    document.addEventListener('click', documentClick)
  }

  const closeMenu = () => {
    clearTimeout(blurInterval)
    setIsOpen(false)
    setTempIndex(selectedIndex)
    setTempSearch('')
    document.removeEventListener('click', documentClick)
  }

  const handelFocus = () => {
    openMenu()
  }

  const handelBlur = () => {
    clearTimeout(blurInterval)
    blurInterval = setTimeout(() => {
      closeMenu()
    }, 100)
  }

  const handelClick = e => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    if (isOpen) {
      return
    }
    openMenu()
  }

  const setValue = index => {
    setTempSearch('')
    setSelectedIndex(index)

    onSelect({
      index,
      item: itemsList[index],
    })
  }

  const itemClick = index => () => {
    setValue(index)
    closeMenu()
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
        setValue(tempIndex)
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
    if (nextIndex > itemsList.length - 1) nextIndex = itemsList.length - 1
    setTempIndex(nextIndex)
  }

  useEffect(
    () => () => {
      // eslint-disable-next-line
      clearTimeout(blurInterval)
      // eslint-disable-next-line
      document.removeEventListener('click', documentClick)
    },
    [],
  )

  let textToShow = selectedIndex >= 0 ? itemsList[selectedIndex].label : value

  return (
    <div className={style.listSearch} ref={wrapperRef}>
      <input
        type="text"
        defaultValue={textToShow}
        className={style.input}
        onFocus={handelFocus}
        onBlur={handelBlur}
        onClick={handelClick}
        onKeyUp={handelPress}
      />
      <button className={`material-icons ${style.icon}`} onClick={handelClick}>
        expand_more
      </button>
      {isOpen && (
        <div className={style.list}>
          {itemsList
            .map((i, index) => ({...i, index}))
            .filter(item => {
              return item.label.match(new RegExp(`${tempSearch}`, 'ig'))
            })
            .map((item, index) => {
              let css = style.item
              css += index === tempIndex ? ` ${style.active}` : ''
              css += item.index === selectedIndex ? ` ${style.selected}` : ''
              return (
                <button
                  className={css}
                  key={`${item.index}-${item.value}`}
                  onClick={itemClick(item.index)}
                >
                  {item.label}
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default ListSearch
