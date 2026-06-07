import {
  Scene,
  WebGLRenderer,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Group,
  TorusGeometry,
  Mesh,
  MeshPhongMaterial,
  AmbientLight,
  PointLight,
  Vector3,
} from 'three'
import { Page } from './Page.js'
import { Spring } from '../lib/Spring.js'
import { clamp, remap } from '../lib/math.js'
import { playRandomSound } from '../audio/sounds.js'

// The 3D booklet controller (original `np`).
export class Booklet {
  constructor(canvas, pageMeta) {
    this.pageIndexSubscribers = new Set()

    // --- pan / interaction handlers ---
    this.handleMouseEnter = () => {
      this.isHovered = true
    }
    this.handleMouseLeave = () => {
      this.isHovered = false
    }
    this.handlePanStart = (offsetX) => {
      if (offsetX > 0) {
        this.turnDirection = 'backward'
        if (this.pageIndex === 0) return
        this.pageTurn = 0.7
        if (this.isOpen) playRandomSound(['slide2', 'slide3'], remap(Math.random(), 0, 1, 0.7, 1))
      } else {
        this.turnDirection = 'forward'
        this.pageTurn = 0
        if (this.isOpen) playRandomSound(['slide1', 'slide2', 'slide4'], remap(Math.random(), 0, 1, 0.7, 1))
      }
      this.isDragging = true
    }
    this.handlePan = (deltaX, curl) => {
      if (this.pageIndex === 0 && this.turnDirection === 'backward') {
        this.manualTurn += -deltaX / 600
      } else if (this.pageIndex === this.pages.length - 1 && this.turnDirection === 'forward') {
        this.manualTurn += -deltaX / 600
      } else {
        this.manualTurn += -deltaX / 1200
        this.pageTurn = clamp(this.pageTurn + -deltaX / 600, 0, 1)
      }
      this.curlBias = curl
      this.manualSpring.setTarget(this.manualTurn)
    }
    this.handlePanEnd = () => {
      if (this.turnDirection === 'forward' && this.pageTurn > 0.1) {
        if (this.pageIndex < this.pages.length - 1 && this.isOpen)
          playRandomSound(['flip1', 'flip2'], remap(Math.random(), 0, 1, 0.6, 1.2))
        this.pageIndex = clamp(this.pageIndex + 1, 0, this.pages.length - 1)
      } else if (this.turnDirection === 'backward' && this.pageTurn < 0.7) {
        if (this.pageIndex > 0 && this.isOpen)
          playRandomSound(['flip1', 'flip2'], remap(Math.random(), 0, 1, 0.6, 1.2))
        this.pageIndex = clamp(this.pageIndex - 1, 0, this.pages.length - 1)
      } else if (this.isOpen) {
        playRandomSound(['flip1', 'flip2'], remap(Math.random(), 0, 1, 0.6, 1.2))
      }
      this.pageIndexSubscribers.forEach((cb) => cb(this.pageIndex))
      this.pageIndexSpring.skipToTarget(this.pageIndex)
      this.curlBias = 0.5
      this.manualTurn = 0
      this.manualSpring.setTarget(this.manualTurn)
      this.isDragging = false
    }
    this.setPageIndex = (target) => {
      const n = target - this.pageIndex
      if (this.isOpen) {
        if (n === 1) playRandomSound(['turn3', 'turn4'], remap(Math.random(), 0, 1, 1.3, 1.8))
        else if (n === -1) playRandomSound(['turn3', 'turn2'], remap(Math.random(), 0, 1, 0.7, 0.9))
        else if (n > 1 && n < 5) playRandomSound(['shuffleShort1', 'shuffleShort3'], remap(Math.random(), 0, 1, 1.4, 1.8))
        else if (n < -1 && n > -5) playRandomSound(['shuffleShort1', 'shuffleShort3'], remap(Math.random(), 0, 1, 0.8, 1.2))
        else if (n > 5) playRandomSound(['shuffleLong1'], 1 / n + 0.9)
        else if (n < -5) playRandomSound(['shuffleLong1'], 1 / -n + 0.6)
      }
      this.pageIndex = target
      this.pageIndexSpring.setTarget(target)
    }
    this.onPageIndexChange = (cb) => {
      this.pageIndexSubscribers.add(cb)
      return () => this.pageIndexSubscribers.delete(cb)
    }
    this.setIsOpen = (open) => {
      this.isOpen = open
      this.openSpring.setTarget(open ? 0 : 1)
    }

    this.draw = (now) => {
      const dt = (now - this.lastTime) / 1000
      this.openSpring.update(dt)
      this.manualSpring.update(dt)
      this.pageIndexSpring.update(dt)
      this.pages.forEach((page) => {
        const i = Math.round(this.pageIndexSpring.value)
        page.update(dt, this.pageTurn, this.turnDirection, i, this.isDragging, this.curlBias, this.isHovered)
      })
      this.manual.position.x = this.manualOrigin.x
      this.manual.position.y = this.manualOrigin.y + this.openSpring.value * -7
      this.manual.position.z = this.manualOrigin.z
      this.manual.rotation.x = this.openSpring.value * -1.5
      this.manual.rotation.y = this.openSpring.value * -1.3 + this.manualSpring.value * -0.5
      this.manual.rotation.z = this.openSpring.value * -0.4
      this.renderer.render(this.scene, this.camera)
      this.rafId = requestAnimationFrame(this.draw)
      this.lastTime = now
    }

    this.init = () => {
      window.addEventListener('resize', this.resize)
      this.rafId = requestAnimationFrame(this.draw)
      this.resize()
    }
    this.destroy = () => {
      this.renderer.dispose()
      if (this.rafId) cancelAnimationFrame(this.rafId)
      window.removeEventListener('resize', this.resize)
    }
    this.resize = () => {
      this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight)
      const aspect = document.documentElement.clientWidth / window.innerHeight
      const n = window.innerHeight / 900
      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
      this.camera.position.z = 21 - (1 * (document.documentElement.clientWidth - 375)) / 1353
      if (aspect < 1) this.camera.position.x = 0
      else this.camera.position.x = -aspect * 3.45 + 1.65 + 0.06 / n
    }

    // --- scene / renderer setup ---
    this.scene = new Scene()
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
    this.lastTime = performance.now()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(document.documentElement.clientWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.camera = new PerspectiveCamera(20, document.documentElement.clientWidth / window.innerHeight, 0.1, 1000)
    this.camera.updateProjectionMatrix()

    const aspect = document.documentElement.clientWidth / window.innerHeight
    const n = window.innerHeight / 900
    this.camera.position.z = 21 - (1 * (document.documentElement.clientWidth - 375)) / 1353
    if (aspect < 1) this.camera.position.x = 0
    else this.camera.position.x = -aspect * 3.5 + 1.64 + 0.06 / n
    this.manual = new Group()

    const width = 3.3
    const height = 6
    const shared = { width, height, totalPages: 21 }
    this.pages = pageMeta.map((m, i) => new Page(m.texture, { ...shared, index: i }))
    this.pages.forEach((p) => this.manual.add(p.pageMesh))
    this.rings = []

    const ringCount = 40
    const padding = 0.1
    const ringRadius = 0.12
    const ringSpan = height - 2 * padding
    for (let m = 0; m < ringCount; m += 1) {
      const geo = new TorusGeometry(ringRadius, 0.01, 8, 16)
      const mat = new MeshPhongMaterial({ color: 0x333333, reflectivity: 0.6 })
      const mesh = new Mesh(geo, mat)
      mesh.rotation.x = Math.PI / 2
      mesh.position.x = -ringRadius - width / 2 + 0.08
      mesh.position.y = m * (ringSpan / ringCount) - ringSpan / 2 + padding + (m % 2 === 0 ? 0.05 : -0.05)
      mesh.position.z = pageMeta.length * -0.002
      mesh.castShadow = true
      this.rings.push(mesh)
    }
    this.rings.forEach((m) => this.manual.add(m))
    this.scene.add(this.manual)

    const ambient = new AmbientLight(0xffffff, 1.5)
    this.scene.add(ambient)
    const fill = new PointLight(0xccffff, 3, 0, 0.4)
    fill.position.set(-5, 0.5, 20)
    this.scene.add(fill)
    const key = new PointLight(0xffffff, 2, 0, 0.4)
    key.position.set(4, -1, 10)
    key.castShadow = true
    const shadowSize = Math.ceil(window.innerHeight * 1.5)
    key.shadow.mapSize.width = shadowSize
    key.shadow.mapSize.height = shadowSize
    key.shadow.bias = -1e-5
    key.shadow.intensity = 1.5
    key.shadow.radius = 4
    key.shadow.blurSamples = 3
    this.scene.add(key)

    this.pageIndex = 0
    this.pageIndexSpring = new Spring(0, 0, { stiffness: 0.4 })
    this.pageTurn = 0
    this.turnDirection = 'forward'
    this.isDragging = false
    this.curlBias = 0.5
    this.rafId = 0
    this.frameRate = 60
    this.isHovered = false
    this.manualTurn = 0
    this.manualSpring = new Spring(0, 0, { stiffness: 1 })
    this.manualOrigin = new Vector3(0, 0, 0)
    this.isOpen = true
    this.openSpring = new Spring(1, 1, { stiffness: 0.7 })

    if (import.meta.env.DEV) window.__bk = this
  }
}
