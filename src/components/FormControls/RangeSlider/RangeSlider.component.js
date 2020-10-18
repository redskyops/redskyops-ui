import React, {useState, useRef, useEffect} from 'react'

import style from './RangeSlider.module.scss'

type TypeProps = {
  min: number,
  max: number,
  rangeMin: number,
  rangeMax: number,
  filteredMin: number,
  filteredMax: number,
  onChange: () => {},
}

const LEFT = 'L'
const RIGHT = 'R'
const BTN_WIDTH = 30

export const RangeSlider = (props: TypeProps) => {
  const {
    min,
    max,
    rangeMin,
    rangeMax,
    filteredMin,
    filteredMax,
    onChange,
  } = props
  const [isDragging, setIsSragging] = useState(null)
  const [mouseClickOffset, setMouseClickOffset] = useState(0)
  const [sliderRect, setSliderRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)
  const minRef = useRef(min)
  const maxRef = useRef(max)
  const leftRef = useRef()
  const rightRef = useRef()
  const sliderRef = useRef()
  const filteredRef = useRef()

  useEffect(() => {
    setSliderRect(sliderRef.current.getBoundingClientRect())
    return () => {
      document.removeEventListener('mouseup', dragEnd)
    }
  }, [])

  useEffect(() => {
    const rect = sliderRef.current.getBoundingClientRect()
    const width = rect.width
    const leftPos = (width * (min - rangeMin)) / (rangeMax - rangeMin)
    const rightPos = (width * (max - rangeMin)) / (rangeMax - rangeMin)
    leftRef.current.style.left = `${leftPos}px`
    rightRef.current.style.left = `${rightPos}px`
    _setMinValue(Math.round(min))
    _setMaxValue(Math.round(max))
  }, [min, max])

  useEffect(() => {
    const rect = sliderRef.current.getBoundingClientRect()
    const width = rect.width
    const leftPos = (width * (filteredMin - rangeMin)) / (rangeMax - rangeMin)
    const rightPos = (width * (filteredMax - rangeMin)) / (rangeMax - rangeMin)
    filteredRef.current.style.left = `${Math.round(leftPos)}px`
    filteredRef.current.style.width = `${Math.round(rightPos - leftPos)}px`
  }, [filteredMin, filteredMax])

  const dragStart = side => e => {
    setIsSragging(side)
    setMouseClickOffset(e.nativeEvent.offsetX)
    document.addEventListener('mouseup', dragEnd)
  }

  const dragEnd = () => {
    setIsSragging(null)
    document.removeEventListener('mouseup', dragEnd)
    onChange({min: minRef.current, max: maxRef.current})
  }

  const _setMinValue = _minValue => {
    minRef.current = _minValue
    setMinValue(_minValue)
  }

  const _setMaxValue = _maxValue => {
    maxRef.current = _maxValue
    setMaxValue(_maxValue)
  }

  const mouseMove = e => {
    if (isDragging === LEFT) {
      const rightXPos =
        window.scrollX +
        rightRef.current.getBoundingClientRect().x -
        sliderRect.x
      let xPos =
        window.scrollX + BTN_WIDTH + e.clientX - sliderRect.x - mouseClickOffset

      if (xPos < 0) {
        xPos = 0
      }

      if (xPos > rightXPos) {
        xPos = rightXPos
      }
      leftRef.current.style.left = `${xPos}px`
      const _minValue = Math.round(
        (rangeMax - rangeMin) * (xPos / sliderRect.width),
      )
      _setMinValue(_minValue)
    }

    if (isDragging === RIGHT) {
      const leftXPos =
        window.scrollX +
        leftRef.current.getBoundingClientRect().x +
        BTN_WIDTH -
        sliderRect.x
      let xPos = window.scrollX + e.clientX - sliderRect.x - mouseClickOffset
      if (xPos > sliderRect.width) {
        xPos = sliderRect.width
      }
      if (xPos < leftXPos) {
        xPos = leftXPos
      }
      rightRef.current.style.left = `${xPos}px`
      const _maxValue = Math.round(
        (rangeMax - rangeMin) * (xPos / sliderRect.width),
      )
      _setMaxValue(_maxValue)
    }
  }

  return (
    <div className={style.rangeSlider} onMouseMove={mouseMove}>
      <div className={style.sliderInner} ref={sliderRef}>
        <div className={style.line} />
        <div className={style.lineDark} ref={filteredRef} />
        <button
          className={`${style.btn} ${style.left}`}
          ref={leftRef}
          onMouseDown={dragStart(LEFT)}
        >
          <span className={style.valueLabel}>{minValue}</span>
          <span className={style.btnIconLine} />
          <span className={style.btnIconLine} />
          <span className={style.btnIconLine} />
        </button>
        <button
          className={`${style.btn} ${style.rigth}`}
          ref={rightRef}
          onMouseDown={dragStart(RIGHT)}
        >
          <span className={style.valueLabel}>{maxValue}</span>
          <span className={style.btnIconLine} />
          <span className={style.btnIconLine} />
          <span className={style.btnIconLine} />
        </button>
      </div>
    </div>
  )
}

export default RangeSlider
