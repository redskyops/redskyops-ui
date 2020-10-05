import React, {useState, useRef} from 'react'

import style from './RageSlider.module.scss'

type TypeProps = {
  min: number,
  max: number,
  onChange: () => {},
}

const LEFT = 'L'
const RIGHT = 'R'

export const RangeSlider = (props: TypeProps) => {
  console.log(props)
  const [isDragging, setIsSragging] = useState(null)
  const leftRef = useRef()

  const dragStart = side => () => {
    setIsSragging(side)
    document.addEventListener('mouseup', dragEnd)
  }

  const dragEnd = () => {
    setIsSragging(null)
    document.removeEventListener('mouseup', dragEnd)
  }

  const mouseMove = e => {
    if (isDragging === LEFT) {
      console.log(e.screenX)
      leftRef.current.style.left = `${e.clientX}px`
    }
  }

  return (
    <div className={style.rangeSlider} onMouseMove={mouseMove}>
      <div className={style.line} />
      <button
        className={`${style.btn} ${style.left}`}
        ref={leftRef}
        onMouseDown={dragStart(LEFT)}
        // onMouseUp={dragEnd}
      />
      <button
        className={`${style.btn} ${style.rigth}`}
        onMouseDown={dragStart(RIGHT)}
        // onMouseUp={dragEnd}
      />
    </div>
  )
}

export default RangeSlider
