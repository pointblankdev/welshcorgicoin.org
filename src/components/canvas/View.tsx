'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import { EffectComposer, Bloom, Glitch, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'

const PerspectiveCameraX: any = PerspectiveCamera

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={0.5} />
    <pointLight position={[20, 30, 10]} intensity={1} />
    <pointLight position={[-10, -10, -10]} color='blue' />
    <PerspectiveCameraX makeDefault fov={40} position={[0, 0, 6]} />
    <EffectComposer>
      <Bloom
        luminanceThreshold={10.1}
        luminanceSmoothing={1.1}
        height={300}
        opacity={0.2}
        blendFunction={THREE.AdditiveBlending}
      />
      <Glitch delay={[3, 5]} duration={[1, 2]} strength={[0.1, 0.5]} ratio={1.8} />
    </EffectComposer>
  </Suspense>
)

const View = forwardRef<any, any>(({ children, orbit, ...props }, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
