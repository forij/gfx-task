import { Vector3, Uniform, Vector2, DoubleSide, AdditiveBlending } from 'three'
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
        uniforms={{
          uPointA: new Uniform(new Vector2(0.1, 0.7)),
          uPointB: new Uniform(new Vector2(0.7, 0.7)),
          uPointC: new Uniform(new Vector2(0.1, 0.1)),
          uThickness: new Uniform(0.1),
          uLineJoinType: new Uniform(lineJoinType),
          uColor: new Uniform(color ?? new Vector3(1, 0, 0)),
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        transparent
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
