import {
  PlaneGeometry,
  TextureLoader,
  SRGBColorSpace,
  MeshPhongMaterial,
  DoubleSide,
  SkinnedMesh,
  Skeleton,
  Bone,
  Uint16BufferAttribute,
  Float32BufferAttribute,
  SplineCurve,
  Vector2,
} from 'three'
import { Spring } from '../lib/Spring.js'
import { clamp, remap } from '../lib/math.js'

const TWO_PI = Math.PI * 2

// Single booklet page (original `ep`): a SkinnedMesh with a bone skeleton
// that curls/flips the page.
export class Page {
  constructor(frontImage, opts) {
    this.frontImage = frontImage
    this.index = opts.index
    this.width = opts.width
    this.height = opts.height
    this.widthSegments = opts.widthSegments || 20
    this.heightSegments = opts.heightSegments || 8
    this.zOffset = opts.zOffset || 0.006
    this.curlBiasDisplacement = 0.4
    this.totalPages = opts.totalPages

    this.geometry = new PlaneGeometry(this.width, this.height, this.widthSegments, this.heightSegments)
    this.frontPageTexture = new TextureLoader().load(frontImage)
    this.frontPageTexture.colorSpace = SRGBColorSpace
    this.frontPageTexture.anisotropy = 4
    this.material = new MeshPhongMaterial({
      map: this.frontPageTexture,
      side: DoubleSide,
      reflectivity: 0.1,
      flatShading: false,
    })
    this.pageMesh = new SkinnedMesh(this.geometry, this.material)
    this.pageMesh.castShadow = true
    this.pageMesh.receiveShadow = true
    this.positionAttribute = this.geometry.getAttribute('position')
    this.bones = []
    this.configureBones()
    this.skeleton = new Skeleton(this.bones)
    this.pageMesh.add(this.bones[0])
    this.pageMesh.bind(this.skeleton)
    this.configureSkeleton()

    this.pageTurnSpring = new Spring(0, 0, { stiffness: 0.4 })
    this.turnCurve = new SplineCurve([
      new Vector2(0, 0),
      new Vector2(0.48549107142857145, 0.37087599544937433),
      new Vector2(1, 0),
    ])
    this.curlCurve = new SplineCurve([
      new Vector2(0, 0.9863481228668942),
      new Vector2(0.4546130952380953, 0),
      new Vector2(1, 0),
    ])
  }

  configureBones() {
    const root = new Bone()
    root.position.x = -this.width / 2 - 0.04
    root.name = 'Bone_Root'
    this.bones.push(root)
    // top edge chain
    for (let n = 0; n <= this.widthSegments; n += 1) {
      const b = new Bone()
      if (n === 0) {
        b.position.x = 0.04
        b.position.y = this.height / 2
      } else {
        b.position.x = 1 / (this.widthSegments / this.width)
      }
      this.bones.push(b)
      this.bones[n].add(b)
    }
    // bottom edge chain
    for (let n = 0; n <= this.widthSegments; n += 1) {
      const b = new Bone()
      if (n === 0) {
        b.position.x = 0.04
        b.position.y = -this.height / 2
      } else {
        b.position.x = 1 / (this.widthSegments / this.width)
      }
      this.bones.push(b)
      if (n === 0) this.bones[n].add(b)
      else this.bones[this.widthSegments + 1 + n].add(b)
    }
  }

  configureSkeleton() {
    const skinIndices = []
    const skinWeights = []
    for (let r = 0; r < this.positionAttribute.count; r += 1) {
      const x = this.positionAttribute.getX(r)
      const y = this.positionAttribute.getY(r)
      const col = Math.round(remap(x, -this.width / 2, this.width / 2, 0, this.widthSegments)) + 1
      const s = remap(y, -this.height / 2, this.height / 2, 0, 1)
      skinIndices.push(col, col + this.widthSegments + 1, 0, 0)
      skinWeights.push(s, 1 - s, 0, 0)
    }
    this.geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4))
    this.geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4))
  }

  update(dt, pageTurn, turnDirection, roundedIndex, isDragging, curlBias, isHovered) {
    const l = this.index - roundedIndex
    const active = isDragging && (turnDirection === 'forward' ? l === 0 : l === -1)
    if (active) this.pageTurnSpring.setTarget(pageTurn)
    else if (isHovered && l === 0) this.pageTurnSpring.setTarget(0.02)
    else if (l >= 0) this.pageTurnSpring.setTarget(0)
    else this.pageTurnSpring.setTarget(1)
    this.pageTurnSpring.update(dt)

    const f = this.pageTurnSpring.value
    const h = clamp(f, 0, 1)
    const c = this.turnCurve.getPoint(h).y
    const p = clamp(remap(h * h, 0, 0.1, 1, 0), 0, 1)

    this.skeleton.bones.forEach((bone, v) => {
      if (v === 0) {
        bone.rotation.y = remap(f, 0, 1, 0, 1) * -TWO_PI
      } else if (v < this.widthSegments + 1) {
        const m = remap(curlBias, 0, 1, this.curlBiasDisplacement, -this.curlBiasDisplacement)
        const x = this.curlCurve.getPoint(h).y * v * v * v * 5e-4
        bone.rotation.y = c * (-x + m * p)
      } else {
        const m2 = v - (this.widthSegments + 1)
        const x2 = remap(curlBias, 0, 1, -this.curlBiasDisplacement, this.curlBiasDisplacement)
        const w = this.curlCurve.getPoint(h).y * m2 * m2 * m2 * 5e-4
        bone.rotation.y = c * (-w + x2 * p)
      }
    })

    if (active || l === 0) {
      this.pageMesh.position.z = remap(h, 0, 1, 0, -this.zOffset * this.totalPages)
    } else if (l > 0) {
      this.pageMesh.position.z = l * -this.zOffset
    } else {
      this.pageMesh.position.z = (this.totalPages + l + 4) * -this.zOffset
    }
  }
}
