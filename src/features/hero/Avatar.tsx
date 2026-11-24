import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { profile } from '@/content/profile'
import { pointer, trackPointer } from '@/lib/pointer'

const COLORS = { skin: '#7b8189', hair: '#2a2d31', shirt: '#1b1e22', dark: '#0c0d0f' }

/**
 * Placeholder bust until Vinicius's own model exists: faceted (low-poly), lit by the accent from behind.
 * The head follows the pointer, the body breathes and the eyes blink now and then.
 */
function Bust() {
  const inner = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const shoulders = useRef<THREE.Mesh>(null!)
  const eyes = useRef<THREE.Mesh[]>([])
  const nextBlink = useRef(2)

  const m = useMemo(() => {
    const make = (color: string, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true })
    return { skin: make(COLORS.skin), hair: make(COLORS.hair, 0.95), shirt: make(COLORS.shirt, 0.9), dark: make(COLORS.dark, 0.4) }
  }, [])
  useEffect(() => () => Object.values(m).forEach((mat) => mat.dispose()), [m])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    head.current.rotation.y += (pointer.x * 0.55 - head.current.rotation.y) * 0.08
    head.current.rotation.x += (pointer.y * 0.28 - head.current.rotation.x) * 0.08
    body.current.rotation.y += (pointer.x * 0.12 - body.current.rotation.y) * 0.05
    shoulders.current.scale.y = 0.95 + Math.sin(t * 1.7) * 0.012
    inner.current.position.y = Math.sin(t * 1.7) * 0.012
    if (t > nextBlink.current) {
      const k = Math.min(1, (t - nextBlink.current) / 0.14)
      const open = k < 0.5 ? 1 - k * 1.8 : 0.1 + (k - 0.5) * 1.8
      eyes.current.forEach((eye) => (eye.scale.y = Math.max(0.1, Math.min(1, open))))
      if (k >= 1) nextBlink.current = t + 2.5 + Math.random() * 3
    }
  })

  return (
    <group ref={inner}>
      <group ref={body}>
        <mesh ref={shoulders} position={[0, -1.65, 0]} scale={[1.45, 0.95, 0.75]} material={m.shirt}>
          <sphereGeometry args={[1, 9, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, -0.74, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.shirt}>
          <torusGeometry args={[0.27, 0.05, 8, 10]} />
        </mesh>
        <mesh position={[0, -0.45, 0]} material={m.skin}>
          <cylinderGeometry args={[0.22, 0.25, 0.62, 8]} />
        </mesh>
      </group>
      <group ref={head} position={[0, 0.35, 0]}>
        <mesh scale={[1, 1.12, 1.02]} material={m.skin}>
          <sphereGeometry args={[0.62, 9, 7]} />
        </mesh>
        <mesh position={[0, 0.03, -0.02]} rotation={[-0.22, 0, 0]} scale={[1, 1.12, 1.04]} material={m.hair}>
          <sphereGeometry args={[0.665, 9, 7, 0, Math.PI * 2, 0, Math.PI * 0.43]} />
        </mesh>
        <mesh position={[0.12, 0.5, 0.42]} rotation={[0, 0, -0.25]} scale={[1.5, 0.45, 0.8]} material={m.hair}>
          <sphereGeometry args={[0.3, 7, 5]} />
        </mesh>
        {[-1, 1].map((side, i) => (
          <group key={side}>
            <mesh position={[side * 0.61, -0.02, 0]} scale={[0.5, 1, 0.8]} material={m.skin}>
              <sphereGeometry args={[0.12, 6, 5]} />
            </mesh>
            <mesh position={[side * 0.21, 0.19, 0.6]} rotation={[0, 0, side * -0.08]} material={m.hair}>
              <boxGeometry args={[0.19, 0.035, 0.04]} />
            </mesh>
            <mesh ref={(el) => { if (el) eyes.current[i] = el }} position={[side * 0.21, 0.07, 0.6]} material={m.dark}>
              <sphereGeometry args={[0.055, 6, 5]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.06, 0.66]} scale={[0.85, 1.1, 1]} material={m.skin}>
          <sphereGeometry args={[0.085, 6, 5]} />
        </mesh>
        <mesh position={[0, -0.25, 0.6]} rotation={[0, 0, Math.PI]} material={m.dark}>
          <torusGeometry args={[0.11, 0.018, 6, 20, Math.PI]} />
        </mesh>
      </group>
    </group>
  )
}

/** Where the camera looks; the middle of the frame. */
const LOOK_Y = -0.45
/**
 * How a model sits in the frame, as fractions of the visible area: its base rests at BASE (from the top),
 * where the frame's mask has already faded it out, and it fills at most FILL_H of the height and FILL_W of the width.
 */
const FRAME = { BASE: 0.86, FILL_H: 0.74, FILL_W: 0.9 }

/** A node whose name ends in "head" (Meshy and Mixamo rigs call the bone Head or mixamorig:Head). */
function findHead(root: THREE.Object3D) {
  let head: THREE.Object3D | null = null
  root.traverse((node) => {
    if (!head && /head$/i.test(node.name)) head = node
  })
  return head as THREE.Object3D | null
}

/** How far the head turns toward the pointer, in radians: sideways and up/down. */
const HEAD_TURN = { YAW: 0.45, PITCH: 0.18 }

/**
 * Finds the neck of a bust that is a single mesh (no skeleton). Going up from the base, the collar is the
 * first slice narrower than half the shoulders; the beard and chin start just above it, so the turn must be
 * complete a few percent higher. (The narrowest slice is no good: on a bearded bust it is the chin.)
 * Works in the geometry's own space, the one the vertex shader sees.
 */
function findNeck(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute('position')
  geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const height = box.max.y - box.min.y
  const BINS = 80
  const min = Array.from({ length: BINS }, () => new THREE.Vector3(Infinity, 0, Infinity))
  const max = Array.from({ length: BINS }, () => new THREE.Vector3(-Infinity, 0, -Infinity))
  for (let i = 0; i < position.count; i++) {
    const bin = Math.min(BINS - 1, Math.floor(((position.getY(i) - box.min.y) / height) * BINS))
    min[bin].x = Math.min(min[bin].x, position.getX(i))
    max[bin].x = Math.max(max[bin].x, position.getX(i))
    min[bin].z = Math.min(min[bin].z, position.getZ(i))
    max[bin].z = Math.max(max[bin].z, position.getZ(i))
  }
  const width = (bin: number) => max[bin].x - min[bin].x
  const shoulders = Math.max(...min.map((_, bin) => (Number.isFinite(width(bin)) ? width(bin) : 0)))
  let collar = -1
  for (let bin = Math.floor(BINS * 0.15); bin < BINS * 0.7; bin++) {
    if (Number.isFinite(width(bin)) && width(bin) < shoulders * 0.5) {
      collar = bin
      break
    }
  }
  if (collar < 0) return null
  const neck = Math.min(BINS - 1, collar + 1)
  const from = box.min.y + ((collar + 1) / BINS) * height
  return {
    // Pivot in the middle of the neck, a little above the collar.
    pivot: new THREE.Vector3((min[neck].x + max[neck].x) / 2, from + height * 0.02, (min[neck].z + max[neck].z) / 2),
    // No turn at the collar, the whole turn just below the beard: the shirt stays, the chin goes with the head.
    from,
    to: from + height * 0.04,
  }
}

/** Rotation of the head in the vertex shader: full above the neck, none below, blended across it. */
const NECK_GLSL = /* glsl */ `
uniform vec2 uTurn;
uniform vec3 uPivot;
uniform vec2 uNeck;
mat3 turnHead(float y) {
  float w = smoothstep(uNeck.x, uNeck.y, y);
  float cy = cos(uTurn.x * w), sy = sin(uTurn.x * w);
  float cp = cos(uTurn.y * w), sp = sin(uTurn.y * w);
  return mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cp, sp, 0.0, -sp, cp);
}
`

/**
 * Lets only the head of a single-mesh bust follow the pointer, by bending its vertices around the neck in
 * the shader. Returns the turn (yaw, pitch) to drive every frame, or null if the mesh does not fit.
 */
function bendAtNeck(mesh: THREE.Mesh) {
  const material = mesh.material
  if (Array.isArray(material)) return null
  // Done once per material: React may run this twice (StrictMode, remounts), and the shader keeps the first turn.
  if (material.userData.headTurn) return material.userData.headTurn as THREE.Vector2
  const neck = findNeck(mesh.geometry)
  if (!neck) return null
  const turn = new THREE.Vector2()
  material.userData.headTurn = turn
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTurn = { value: turn }
    shader.uniforms.uPivot = { value: neck.pivot }
    shader.uniforms.uNeck = { value: new THREE.Vector2(neck.from, neck.to) }
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', `${NECK_GLSL}\nvoid main() {`)
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n  mat3 headTurn = turnHead(position.y);\n  objectNormal = headTurn * objectNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n  transformed = headTurn * (transformed - uPivot) + uPivot;')
  }
  material.customProgramCacheKey = () => 'bend-at-neck'
  material.needsUpdate = true
  return turn
}

/**
 * The person's own model (a GLB). A bust is shown whole; a standing character is framed from the chest
 * up. Only the head follows the pointer: through its bone when the model is rigged, otherwise by bending
 * the mesh at the neck. If neither works, the model stays still.
 */
function Model({ url }: { url: string }) {
  // The model is compressed with meshopt (see docs/gerar-avatar.md), so the loader needs its decoder.
  const gltf = useLoader(GLTFLoader, url, (loader) => loader.setMeshoptDecoder(MeshoptDecoder))
  const breathing = useRef<THREE.Group>(null!)
  const view = useThree((state) => state.viewport)

  const bent = useMemo(() => {
    if (findHead(gltf.scene)) return null
    let mesh: THREE.Mesh | null = null
    gltf.scene.traverse((node) => {
      if (!mesh && (node as THREE.Mesh).isMesh) mesh = node as THREE.Mesh
    })
    return mesh ? bendAtNeck(mesh) : null
  }, [gltf])

  // Only numbers are computed here; the loaded scene itself is never moved, the groups around it are.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const standing = size.y > size.x * 1.6
    const shown = standing ? size.y * 0.32 : size.y
    const byHeight = (view.height * FRAME.FILL_H) / shown
    // A bust is as wide as it is tall, so it must also fit across; a standing body is cropped at the chest.
    const scale = standing ? byHeight : Math.min(byHeight, (view.width * FRAME.FILL_W) / size.x)
    const baseY = LOOK_Y + view.height * (0.5 - FRAME.BASE)
    const head = findHead(gltf.scene)
    return {
      scale,
      offset: [-center.x, baseY / scale - (box.max.y - shown), -center.z] as [number, number, number],
      head,
      headRest: head ? head.rotation.clone() : null,
    }
  }, [gltf, view.width, view.height])

  useFrame(({ clock }) => {
    const { head, headRest } = fit
    if (head && headRest) {
      head.rotation.y += (headRest.y + pointer.x * HEAD_TURN.YAW - head.rotation.y) * 0.08
      head.rotation.x += (headRest.x + pointer.y * HEAD_TURN.PITCH - head.rotation.x) * 0.08
    } else if (bent) {
      bent.x += (pointer.x * HEAD_TURN.YAW - bent.x) * 0.08
      bent.y += (pointer.y * HEAD_TURN.PITCH - bent.y) * 0.08
    }
    breathing.current.position.y = Math.sin(clock.elapsedTime * 1.7) * 0.015
  })

  return (
    <group ref={breathing}>
      <group scale={fit.scale}>
        <group position={fit.offset}>
          <primitive object={gltf.scene} />
        </group>
      </group>
    </group>
  )
}

/** The 3D viewport of the hero. Loaded on its own, after the text, because three.js is heavy. */
export default function Avatar() {
  useEffect(trackPointer, [])

  return (
    // The mask fades the bottom of the scene, so the cut at the base of a bust never shows.
    <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_68%,transparent_86%)]">
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 30, position: [0, -0.35, 7.4] }}
        onCreated={({ camera }) => camera.lookAt(0, LOOK_Y, 0)}
        aria-label="Avatar 3D de Vinicius; a cabeça acompanha o mouse"
      >
        {/* three.js measures light physically, so these are about π times the old "legacy" values. */}
        <ambientLight intensity={1} />
        <directionalLight position={[3, 2, 4]} intensity={2.5} />
        <directionalLight position={[-4, 2, -3]} intensity={4.4} color="#c6f35e" />
        {profile.avatarModel ? (
          <Suspense fallback={null}>
            <Model url={profile.avatarModel} />
          </Suspense>
        ) : (
          <Bust />
        )}
      </Canvas>
    </div>
  )
}
