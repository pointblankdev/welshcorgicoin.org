'use client'

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

export const Logo = ({ route = '/blob', ...props }) => {
  const welsh = useGLTF('/welsh3.glb')
  const { gl, camera } = useThree()
  const raycaster = new THREE.Raycaster()
  const initialPosition = useRef(new THREE.Vector3())
  const time = useRef(0)
  const spinTime = useRef(0)
  const spinAxis = useRef(new THREE.Vector3(0, 1, 0))
  const spinDuration = useRef(0)
  const nextSpinTimeout = useRef(0) as any

  const easeOutCubic = (t) => {
    t = t - 1
    return t * t * t + 1
  }

  const handlePointerDown = (e) => {
    const mouse = new THREE.Vector2(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
    )
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([welsh.scene], true)
    if (intersects.length > 0) {
      // Spin or scale the object
      scheduleNextSpin(0.1)
    }
  }

  const scheduleNextSpin = (delay = null) => {
    nextSpinTimeout.current = setTimeout(() => {
      const randomAxis = Math.random() > 0.5 ? 0 : 1
      spinAxis.current.set(randomAxis === 0 ? 1 : 0, randomAxis === 1 ? 1 : 0, 0)
      spinDuration.current = Math.random() * 0.5 + 0.5
      spinTime.current = 0
      scheduleNextSpin()
    }, delay || (Math.random() * 15 + 5) * 1000)
  }

  useEffect(() => {
    // Set the Welsh scene position and scale
    welsh.scene.position.copy(initialPosition.current)
    welsh.scene.scale.multiplyScalar(1)

    scheduleNextSpin()

    return () => {
      clearTimeout(nextSpinTimeout.current)
    }
  }, [welsh.scene])

  useFrame((state, delta) => {
    // Face the Welsh scene toward the camera
    welsh.scene.lookAt(camera.position)

    // Update time
    time.current += delta

    // Update the Welsh scene position using sinusoidal motion
    welsh.scene.position.set(
      initialPosition.current.x + Math.sin(time.current) * 0.05,
      initialPosition.current.y + Math.sin(time.current * 1.5) * 0.05 - 0.3,
      initialPosition.current.z + Math.sin(time.current * 2) * 0.05,
    )

    // Update the Welsh scene rotation for a decelerating spin
    if (spinTime.current < spinDuration.current) {
      spinTime.current += delta
      const spinProgress = spinTime.current / spinDuration.current
      const easedProgress = easeOutCubic(spinProgress)
      welsh.scene.rotateOnAxis(spinAxis.current, easedProgress * Math.PI * 2)
    }
  })

  return (
    <>
      <primitive object={welsh.scene} {...props} onPointerDown={handlePointerDown} />
    </>
  )
}
