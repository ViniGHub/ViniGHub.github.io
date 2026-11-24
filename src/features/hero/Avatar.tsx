import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/** Where the pointer is on the whole window, from -1 to 1. Shared by the scene and the coordinates label. */
export const pointer = { x: 0, y: 0 }

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

/** The 3D viewport of the hero. Loaded on its own, after the text, because three.js is heavy. */
export default function Avatar() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1))
      pointer.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1))
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      flat
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 30, position: [0, -0.35, 7.4] }}
      onCreated={({ camera }) => camera.lookAt(0, -0.45, 0)}
      aria-label="Avatar 3D provisório; a cabeça acompanha o mouse"
    >
      {/* three.js measures light physically, so these are about π times the old "legacy" values. */}
      <ambientLight intensity={1} />
      <directionalLight position={[3, 2, 4]} intensity={2.5} />
      <directionalLight position={[-4, 2, -3]} intensity={4.4} color="#c6f35e" />
      <Bust />
    </Canvas>
  )
}
