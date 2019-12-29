import React from 'react'
import * as d3 from 'd3'
import * as THREE from 'three'

import ChartPropsType from '../ChartProps.type'
import style from '../Charts.module.scss'

export class DotsChart3D extends React.Component<ChartPropsType> {
  renderer = null
  scene = null
  camera = null
  cube = null
  size = 1.7
  scales = null
  filteredTrials = []
  font = null

  initThree = () => {
    const width = 1024
    const height = 600
    const {size} = this

    const loader = new THREE.FontLoader()
    loader.load('/fonts/helvetiker_regular.typeface.json', this.fontLoaded)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(width, height)
    document.getElementById('chart').appendChild(this.renderer.domElement)

    const xPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const xPlane = new THREE.Mesh(xPlaneGeo, this.getMaterial(0xff0000))
    this.scene.add(xPlane)
    xPlane.position.x = 0
    xPlane.position.y = size / 2
    xPlane.position.z = -size / 2

    const yPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const yPlane = new THREE.Mesh(yPlaneGeo, this.getMaterial(0x00ff00))
    this.scene.add(yPlane)
    yPlane.rotation.y = Math.PI / 2
    yPlane.position.x = -size / 2
    yPlane.position.y = size / 2

    const zPlaneGeo = new THREE.PlaneGeometry(size, size, size)
    const zPlane = new THREE.Mesh(zPlaneGeo, this.getMaterial(0x0000ff))
    this.scene.add(zPlane)
    zPlane.rotation.x = Math.PI / 2

    this.camera.position.z = 2
    this.camera.position.y = 1.5
    this.camera.rotation.x = -0.4

    var light = new THREE.AmbientLight(0x404040) // soft white light
    light.position.y = 1
    this.scene.add(light)

    this.animate()
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

    // this.scene.rotation.y = -Math.PI / 4
    this.scene.rotation.y -= 0.008

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
      // const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
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
      color: 0,
      transparent: true,
      opacity: 0.3,
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

    this.filteredTrials = this.props.trials
      .map((t, index) => ({...t, index}))
      .filter(t => t.status === 'completed')

    const [minCost, maxCost] = d3.extent(
      this.filteredTrials.map(
        v => v.values.filter(c => c.metricName === xValueName)[0].value,
      ),
    )
    const [minDuration, maxDuration] = d3.extent(
      this.filteredTrials.map(v => {
        return v.values.filter(c => c.metricName === yValueName)[0].value
      }),
    )
    const [minThroughput, maxThroughput] = d3.extent(
      this.filteredTrials.map(v => {
        return v.values.filter(c => c.metricName === zValueName)[0].value
      }),
    )

    const xScale = d3
      .scaleLinear()
      .domain([minCost, maxCost])
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
        min: minCost,
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
    this.filteredTrials.forEach(d => {
      const [xPoint, yPoint, zPoint] = d.values.reduce((acc, v) => {
        if (v.metricName === this.scales[0].name) acc[0] = v
        if (v.metricName === this.scales[1].name) acc[1] = v
        if (v.metricName === this.scales[2].name) acc[2] = v
        return acc
      }, [])

      const geometry = new THREE.SphereGeometry(0.015, 32, 32)
      // const material = new THREE.MeshBasicMaterial({color: 0xffff00})
      const material = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        roughness: 0.5,
      })
      //   const material = new THREE.MeshPhongMaterial({
      //     color: 0x996633,
      // // envMap: envMap, // optional environment map
      // specular: 0x050505,
      // shininess: 100
      //   })
      const dot = new THREE.Mesh(geometry, material)
      dot.position.x = this.scales[0].scale(xPoint.value)
      dot.position.y = this.scales[1].scale(yPoint.value)
      dot.position.z = this.scales[2].scale(zPoint.value)
      this.scene.add(dot)
    })
  }

  fontLoaded = font => {
    this.font = font
    this.addGridLines(10)
  }

  componentDidMount() {
    this.setScales()
    this.initThree()
    this.buildChart()
  }

  componentDidUpdate() {
    // this.buildChart()
  }

  render() {
    return (
      <div className={style.trials}>
        <div id="chart" />
      </div>
    )
  }
}

export default DotsChart3D
