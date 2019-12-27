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
  size = 1.8
  scales = null
  filteredTrials = []

  initThree = () => {
    const width = 1024
    const height = 600
    const {size} = this

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

    this.addGridLines(10)

    this.camera.position.z = 2
    this.camera.position.y = 1.7
    this.camera.rotation.x = -0.4

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
    this.scene.rotation.y -= 0.01

    this.renderer.render(this.scene, this.camera)
  }

  addGridLines(ticks) {
    const {size} = this
    const mid = size / 2
    var material = new THREE.LineBasicMaterial({
      color: 0,
      transparent: true,
      opacity: 0.3,
    })

    const step = size / ticks

    for (let x = 0; x < ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const xPos = -mid + x * step
      geometry.vertices.push(
        new THREE.Vector3(xPos, 0, mid),
        new THREE.Vector3(xPos, 0, -mid),
        new THREE.Vector3(xPos, size, -mid),
      )
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
    }

    for (let x = 0; x < ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const zPos = -mid + x * step
      geometry.vertices.push(
        new THREE.Vector3(mid, 0, zPos),
        new THREE.Vector3(-mid, 0, zPos),
        new THREE.Vector3(-mid, size, zPos),
      )
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
    }

    for (let x = 0; x < ticks; x += 1) {
      const geometry = new THREE.Geometry()
      const yPos = 0 + x * step
      geometry.vertices.push(
        new THREE.Vector3(mid, yPos, -mid),
        new THREE.Vector3(-mid, yPos, -mid),
        new THREE.Vector3(-mid, yPos, mid),
      )
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
    }
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
      const geometry = new THREE.CircleGeometry(0.02, 32)
      const dot = new THREE.Mesh(geometry, this.getMaterial(0xffff00))
      dot.position.x = this.scales[0].scale(xPoint.value)
      dot.position.y = this.scales[1].scale(yPoint.value)
      dot.position.z = this.scales[2].scale(zPoint.value)
      this.scene.add(dot)
    })
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
