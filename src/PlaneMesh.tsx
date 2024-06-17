import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
} from 'three'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import fragmentShader from './shader/fragment.glsl?raw'
import vertexShader from './shader/vertex.glsl?raw'

interface Props {
  position: Vector3
  lineJoinType: number
  scale?: Vector3
  color?: Vector3
}

export const PlaneMesh: React.FC<Props> = ({
  position,
  lineJoinType,
  scale,
  color,
}) => {
  const refShaderMaterial = useRef<ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uPointA: new Uniform(new Vector2(0.1, 0.7)),
      uPointB: new Uniform(new Vector2(0.7, 0.7)),
      uPointC: new Uniform(new Vector2(0.1, 0.1)),
      uThickness: new Uniform(0.1),
      uLineJoinType: new Uniform(lineJoinType),
      uColor: new Uniform(color ?? new Vector3(1, 0, 0)),
    }),
    []
  )

  if (refShaderMaterial.current) {
    refShaderMaterial.current.uniforms.uLineJoinType.value = lineJoinType
  }

  return (
    <mesh
      position={position}
      scale={scale ?? new Vector3(1, 1, 1)}
    >
      <planeGeometry
        attach={'geometry'}
        args={[10, 10, 256, 256]}
      />
      <shaderMaterial
        attach='material'
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        transparent
        blending={AdditiveBlending}
        ref={refShaderMaterial}
      />
    </mesh>
  )
}
