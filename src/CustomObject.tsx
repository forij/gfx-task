import { DoubleSide, Uniform, Vector2 } from 'three'
import fragmentShader from './shader/fragment.glsl?raw'
import vertexShader from './shader/vertex.glsl?raw'
import { useState } from 'react'

export const CustomObject = () => {
  const [lineJoinType, setLineJoinType] = useState(1)

  return (
    <mesh>
      <planeGeometry
        attach={'geometry'}
        args={[10, 10, 256, 256]}
      />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        uniforms={{
          uPointA: new Uniform(new Vector2(0.1, 0.7)),
          uPointB: new Uniform(new Vector2(0.7, 0.7)),
          uPointC: new Uniform(new Vector2(0.1, 0.1)),
          uThickness: new Uniform(0.1),
          uLineJoinType: new Uniform(lineJoinType),
        }}
      />
    </mesh>
  )
}
