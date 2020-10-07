import React, {useState, useRef, useEffect} from 'react'

import style from './RangeSlider.module.scss'

type TypeProps = {
  min: number,
  max: number,
  rangeMin: number,
  rangeMax: number,
  onChange: () => {},
}

const LEFT = 'L'
const RIGHT = 'R'
const BTN_WIDTH = 30

export const RangeSlider = (props: TypeProps) => {
  const {min, max, rangeMin, rangeMax, onChange} = props
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

  useEffect(() => {
    setSliderRect(sliderRef.current.getBoundingClientRect())
    return () => {
      document.removeEventListener('mouseup', dragEnd)
    }
  }, [])

  useEffect(() => {
    const rect = sliderRef.current.getBoundingClientRect()
    const width = rect.width - BTN_WIDTH - BTN_WIDTH
    const leftPos = (width * (min - rangeMin)) / (rangeMax - rangeMin)
    const rightPos =
      BTN_WIDTH + (width * (max - rangeMin)) / (rangeMax - rangeMin)
    leftRef.current.style.left = `${leftPos}px`
    rightRef.current.style.left = `${rightPos}px`
    setMinValue(min)
    setMaxValue(max)
  }, [min, max])

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
        rightRef.current.getBoundingClientRect().x - sliderRect.x
      let xPos = e.screenX - sliderRect.x - mouseClickOffset

      if (xPos < 0) {
        xPos = 0
      }
      if (xPos > rightXPos - BTN_WIDTH) {
        xPos = rightXPos - BTN_WIDTH
      }
      leftRef.current.style.left = `${xPos}px`
      const _minValue = Math.round(
        (rangeMax - rangeMin) * (xPos / (sliderRect.width - BTN_WIDTH)),
      )
      _setMinValue(_minValue)
    }

    if (isDragging === RIGHT) {
      const leftXPos = leftRef.current.getBoundingClientRect().x - sliderRect.x
      let xPos = e.screenX - sliderRect.x - mouseClickOffset
      if (xPos > sliderRect.width - BTN_WIDTH) {
        xPos = sliderRect.width - BTN_WIDTH
      }
      if (xPos < leftXPos + BTN_WIDTH) {
        xPos = leftXPos + BTN_WIDTH
      }
      rightRef.current.style.left = `${xPos}px`
      const _maxValue = Math.round(
        (rangeMax - rangeMin) * (xPos / (sliderRect.width - BTN_WIDTH)),
      )
      _setMaxValue(_maxValue)
    }
  }

  return (
    <div className={style.rangeSlider} ref={sliderRef} onMouseMove={mouseMove}>
      <div className={style.line} />
      <button
        className={`${style.btn} ${style.left}`}
        ref={leftRef}
        onMouseDown={dragStart(LEFT)}
      >
        <span className={style.valueLabel}>{minValue}</span>
      </button>
      <button
        className={`${style.btn} ${style.rigth}`}
        ref={rightRef}
        onMouseDown={dragStart(RIGHT)}
      >
        <span className={style.valueLabel}>{maxValue}</span>
      </button>
    </div>
  )
}

export default RangeSlider
