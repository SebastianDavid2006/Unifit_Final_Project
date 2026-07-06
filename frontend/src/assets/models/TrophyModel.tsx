import { useRef, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows, Environment, Center, useProgress, Html, Clone } from '@react-three/drei'
import { Group } from 'three'

function Loader() {
  const { progress } = useProgress()
  if (progress >= 100) return null
  return (
    <Html center>
      <div className="w-5 h-5 rounded-full" style={{
        border: '2px solid rgba(0,0,0,0.06)',
        borderTopColor: '#E63946',
        animation: 'spin 0.8s linear infinite',
      }} />
    </Html>
  )
}

function Model() {
  const ref = useRef<Group>(null)
  const { scene } = useGLTF('/models/trophy.glb')

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.75
  })

  return (
    <group ref={ref}>
      <Center>
        <Clone object={scene} />
      </Center>
    </group>
  )
}

function Scene() {
  return (
    <Suspense fallback={<Loader />}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} />
      <pointLight position={[0, 3, 2]} intensity={0.3} />
      <Model />
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.2}
        scale={5}
        blur={3}
        far={2}
      />
      <Environment preset="city" />
    </Suspense>
  )
}

export function TrophyView() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Scene />
    </Canvas>
  )
}
