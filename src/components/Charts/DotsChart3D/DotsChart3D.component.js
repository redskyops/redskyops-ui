import React from 'react'
import * as d3 from 'd3'
import * as THREE from 'three'

import ChartPropsType from '../ChartProps.type'
import style from '../Charts.module.scss'

const NORMAL_COLOR = 0x7b8bde
const BEST_COLOR = 0xfe6f9c

export class DotsChart3D extends React.Component<ChartPropsType> {
  renderer = null
  scene = null
  camera = null
  cube = null
  size = 1.7
  width = 1024
  height = 600
  scales = null
  completedTrials = []
  filteredTrials = []
  font = null
  isDragging = false
  prevMouse = null
  deltaX = 1
  deltaY = 1
  dots = []
  raycaster = null

  initThree = () => {
    const {size} = this

    const loader = new THREE.FontLoader()
    loader.load('/fonts/helvetiker_regular.typeface.json', this.fontLoaded)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000,
    )

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.width, this.height)
    document.getElementById('chart').appendChild(this.renderer.domElement)

    const xPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const xPlane = new THREE.Mesh(xPlaneGeo, this.getMaterial(0xcccccc))
    this.scene.add(xPlane)
    xPlane.position.x = 0
    xPlane.position.y = size / 2
    xPlane.position.z = -size / 2

    const yPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const yPlane = new THREE.Mesh(yPlaneGeo, this.getMaterial(0xcccccc))
    this.scene.add(yPlane)
    yPlane.rotation.y = Math.PI / 2
    yPlane.position.x = -size / 2
    yPlane.position.y = size / 2

    const zPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const zPlane = new THREE.Mesh(zPlaneGeo, this.getMaterial(0xcccccc))
    this.scene.add(zPlane)
    zPlane.rotation.x = Math.PI / 2

    this.camera.position.z = 2
    this.camera.position.y = 1.5
    this.camera.rotation.x = -0.4

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    hemiLight.color.setHSL(0.6, 1, 0.6)
    hemiLight.groundColor.setHSL(0.095, 1, 0.75)
    hemiLight.position.set(0, -size * 3, 0)
    this.scene.add(hemiLight)

    this.scene.rotation.y = -Math.PI / 4

    document
      .getElementsByTagName('canvas')[0]
      .addEventListener('click', this.canvasClick)
    this.raycaster = new THREE.Raycaster()

    this.animate()
  }

  canvasClick = event => {
    // convert x, y to normalized coordinates -1 -> 1
    var mouse = new THREE.Vector2()
    mouse.x = (event.offsetX / this.width) * 2 - 1
    mouse.y = -((event.offsetY / this.height) * 2) + 1
    this.raycaster.setFromCamera(mouse, this.camera)
    var intersects = this.raycaster.intersectObjects(this.dots)

    if (intersects.length > 0) {
      const selectedObject = intersects[0]
      const dataPoint = this.completedTrials.find(
        t => t.index === selectedObject.object.dataIndex,
      )
      this.props.selectTrialHandler({
        index: dataPoint.index,
        trial: dataPoint,
      })
    }
  }

  getMaterial = color => {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 0.6,
    })
  }

  animate = () => {
    requestAnimationFrame(this.animate)

    // this.scene.rotation.y = rotationY
    // this.scene.rotation.y -= 0.008

    this.renderer.render(this.scene, this.camera)
  }

  getText = (message, translate) => {
    const textColor = 0x006699
    const matDark = new THREE.LineBasicMaterial({
      color: textColor,
      side: THREE.DoubleSide,
    })

    const shapes = this.font.generateShapes(String(message), 0.05)
    const geometry = new THREE.ShapeBufferGeometry(shapes)
    geometry.computeBoundingBox()
    if (translate === 'right') {
      const yMid =
        -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y)
      geometry.translate(-geometry.boundingBox.max.x, yMid, 0)
    }

    if (translate === 'center') {
      const xMid =
        -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
      const yMid =
        -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y)
      geometry.translate(xMid, yMid, 0)
    }

    const text = new THREE.Mesh(geometry, matDark)
    return text
  }

  addGridLines(ticks) {
    const {size} = this
    const mid = size / 2
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    })

    const step = size / ticks
    const numFormat = d3.format('.1f')

    for (let x = 1; x <= ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const xPos = -mid + x * step
      geometry.vertices.push(
        new THREE.Vector3(xPos, 0, mid),
        new THREE.Vector3(xPos, 0, -mid),
        new THREE.Vector3(xPos, size, -mid),
      )
      const line = new THREE.Line(geometry, lineMaterial)
      this.scene.add(line)
      const xVal = this.scales[0].scale.invert(xPos)
      const label = this.getText(numFormat(xVal), 'right')

      label.position.x = xPos
      label.position.y = 0
      label.position.z = mid + 0.02
      label.rotation.x = -Math.PI / 2
      label.rotation.z = Math.PI / 2

      this.scene.add(label)
    }

    for (let x = 1; x <= ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const zPos = -mid + x * step
      geometry.vertices.push(
        new THREE.Vector3(mid, 0, zPos),
        new THREE.Vector3(-mid, 0, zPos),
        new THREE.Vector3(-mid, size, zPos),
      )
      const line = new THREE.Line(geometry, lineMaterial)
      this.scene.add(line)

      const zVal = this.scales[2].scale.invert(zPos)
      const label = this.getText(numFormat(zVal))

      label.position.x = mid + 0.02
      label.position.y = 0
      label.position.z = zPos
      label.rotation.x = -Math.PI / 2

      this.scene.add(label)
    }

    for (let x = 1; x <= ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const yPos = 0 + x * step
      geometry.vertices.push(
        new THREE.Vector3(mid, yPos, -mid),
        new THREE.Vector3(-mid, yPos, -mid),
        new THREE.Vector3(-mid, yPos, mid),
      )
      const line = new THREE.Line(geometry, lineMaterial)
      this.scene.add(line)

      const yVal = this.scales[1].scale.invert(yPos)
      const label = this.getText(numFormat(yVal), 'right')

      label.position.x = -mid
      label.position.y = yPos
      label.position.z = mid + 0.02
      label.rotation.y = Math.PI / 2

      this.scene.add(label)
    }

    const xLabel = this.getText(this.scales[0].name, 'center')
    xLabel.position.z = mid + 0.25
    xLabel.rotation.x = -Math.PI / 2
    this.scene.add(xLabel)

    const yLabel = this.getText(this.scales[1].name, 'center')
    yLabel.position.x = -mid
    yLabel.position.y = mid
    yLabel.position.z = mid + 0.3
    yLabel.rotation.y = Math.PI / 2
    yLabel.rotation.z = Math.PI / 2
    this.scene.add(yLabel)

    const zLabel = this.getText(this.scales[2].name, 'center')
    zLabel.position.x = mid + 0.35
    zLabel.rotation.z = Math.PI / 2
    zLabel.rotation.x = -Math.PI / 2
    this.scene.add(zLabel)
  }

  setScales = () => {
    const {size} = this

    const xValueName = this.props.xAxisMetricName
    const yValueName = this.props.yAxisMetricName
    const zValueName = this.props.zAxisMetricName

    this.completedTrials = this.props.trials
      .map((t, index) => ({...t, index}))
      .filter(t => t.status === 'completed')

    this.filteredTrials = this.completedTrials.filter(
      ({labels}) =>
        this.props.labelsFilter.length === 0 ||
        this.props.labelsFilter.reduce((acc, l) => acc || l in labels, false),
    )

    const maxCost = d3.max(
      this.completedTrials.map(
        v => v.values.filter(c => c.metricName === xValueName)[0].value,
      ),
    )
    const [minDuration, maxDuration] = d3.extent(
      this.completedTrials.map(v => {
        return v.values.filter(c => c.metricName === yValueName)[0].value
      }),
    )
    const [minThroughput, maxThroughput] = d3.extent(
      this.completedTrials.map(v => {
        return v.values.filter(c => c.metricName === zValueName)[0].value
      }),
    )

    const xScale = d3
      .scaleLinear()
      .domain([0, maxCost])
      .range([-size / 2, size / 2])

    const yScale = d3
      .scaleLinear()
      .domain([minDuration, maxDuration])
      .range([0, size])

    const zScale = d3
      .scaleLinear()
      .domain([minThroughput, maxThroughput])
      .range([-size / 2, size / 2])

    this.scales = [
      {
        name: xValueName,
        min: 0,
        max: maxCost,
        scale: xScale,
      },
      {
        name: yValueName,
        min: minDuration,
        max: maxDuration,
        scale: yScale,
      },
      {
        name: zValueName,
        min: minThroughput,
        max: maxThroughput,
        scale: zScale,
      },
    ]
  }

  buildChart = () => {
    this.dots = []
    this.filteredTrials.forEach(d => {
      const [xPoint, yPoint, zPoint] = d.values.reduce((acc, v) => {
        if (v.metricName === this.scales[0].name) acc[0] = v
        if (v.metricName === this.scales[1].name) acc[1] = v
        if (v.metricName === this.scales[2].name) acc[2] = v
        return acc
      }, [])

      const color = d.labels && d.labels.best ? BEST_COLOR : NORMAL_COLOR
      const material = new THREE.MeshLambertMaterial({
        color,
        // emissive: color,
      })

      const sphereRadis = 0.015
      const geometry = new THREE.SphereGeometry(sphereRadis, 32, 32)

      const dot = new THREE.Mesh(geometry, material)
      dot.position.x = this.scales[0].scale(xPoint.value)
      dot.position.y = this.scales[1].scale(yPoint.value)
      dot.position.z = this.scales[2].scale(zPoint.value)
      dot.dataIndex = d.index
      this.scene.add(dot)
      this.dots.push(dot)
    })
  }

  fontLoaded = font => {
    this.font = font
    this.addGridLines(10)
  }

  clearChart = () => {
    document.getElementById('chart').innerHTML = ''
  }

  componentDidMount() {
    this.setScales()
    this.initThree()
    this.buildChart()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTrial !== this.props.activeTrial) {
      this.dots.forEach(dot => {
        const scale =
          this.props.activeTrial &&
          dot.dataIndex === this.props.activeTrial.index
            ? 2
            : 1

        dot.scale.set(scale, scale, scale)
      })
      return
    }
    if (
      prevProps.trials !== this.props.trials ||
      prevProps.labelsFilter !== this.props.labelsFilter ||
      prevProps.xAxisMetricName !== this.props.xAxisMetricName ||
      prevProps.yAxisMetricName !== this.props.yAxisMetricName ||
      prevProps.zAxisMetricName !== this.props.zAxisMetricName
    ) {
      this.clearChart()
      this.setScales()
      this.initThree()
      this.buildChart()
    }
  }

  mouseDown = () => {
    this.isDragging = true
    document.removeEventListener('mouseup', this.mouseUp)
    document.addEventListener('mouseup', this.mouseUp)
  }

  mouseUp = () => {
    this.isDragging = false
    document.removeEventListener('mouseup', this.mouseUp)
  }

  mouseMove = e => {
    if (!this.isDragging) {
      return
    }

    if (this.prevMouse) {
      this.deltaX =
        (e.clientX - this.prevMouse.x) / Math.abs(e.clientX - this.prevMouse.x)
      this.deltaY =
        (e.clientY - this.prevMouse.y) / Math.abs(e.clientY - this.prevMouse.y)

      let rotationY =
        this.scene.rotation.y +
        (this.isDragging && this.deltaX ? this.deltaX * 0.03 : 0)
      if (rotationY <= -Math.PI / 2) {
        rotationY = -Math.PI / 2
      }
      if (rotationY >= 0) {
        rotationY = 0
      }

      let rotationX =
        this.scene.rotation.x +
        (this.isDragging && this.deltaY ? this.deltaY * 0.03 : 0)
      if (rotationX >= Math.PI / 2) {
        rotationX = Math.PI / 2
      }
      if (rotationX <= 0) {
        rotationX = 0
      }

      this.scene.rotation.x = rotationX
      this.scene.rotation.y = rotationY
    }
    this.prevMouse = {x: e.clientX, y: e.clientY}
  }

  render() {
    return (
      <div className={style.trials}>
        <div
          id="chart"
          role="button"
          tabIndex={-1}
          className={`${style.chart3d} ${style.grab}`}
          onMouseDown={this.mouseDown}
          onMouseMove={this.mouseMove}
        />
      </div>
    )
  }
}

export default DotsChart3D
