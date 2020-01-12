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
    setTempIndex(
      (found => (found && found.lenght > 0 ? found[0].index : -1))(
        filteredList.find(i => i.index === selectedIndex),
      ),
    )
    setTempSearch('')
    inputRef.current.value = ''
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
    }, 200)
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
            handelClick(e)
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
        onBlur={handelBlur}
        onClick={handelClick}
        onKeyUp={handelPress}
      />
      <button className={`material-icons ${style.icon}`} onClick={handelClick}>
        expand_more
      </button>
      {isOpen && (
        <div className={style.list}>
          <div className={style.listInner}>
            {filteredList.length > 0 &&
              filteredList.map((item, index) => {
                let css = style.item
                css += index === tempIndex ? ` ${style.active}` : ''
                css += item.index === selectedIndex ? ` ${style.selected}` : ''
                return (
                  <button
                    className={css}
                    id={`listSearch-${index}`}
                    key={`${item.index}-${item.value}`}
                    onClick={itemClick(item.index)}
                  >
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

export default ListSearch
