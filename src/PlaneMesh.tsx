import {
  AdditiveBlending,
  DoubleSide,
  Mesh,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import fragmentShader from "./shader/fragment.glsl?raw";
import vertexShader from "./shader/vertex.glsl?raw";

interface Props {
  position: Vector3;
  lineJoinType: number;
  animate?: boolean;
  scale?: Vector3;
  color?: Vector3;
}

export const PlaneMesh: React.FC<Props> = ({
  position,
  lineJoinType,
  scale,
  color,
  animate,
}) => {
  const refShaderMaterial = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uPointA: new Uniform(new Vector2(0.1, 0.7)),
      uPointB: new Uniform(new Vector2(0.5, 0.5)),
      uPointC: new Uniform(new Vector2(0.1, 0.1)),
      uThickness: new Uniform(0.1),
      uLineJoinType: new Uniform(lineJoinType),
      // I try to use some nice colors as default https://colorhunt.co/palette/211951836fff15f5baf0f3ff
      uJointColor: new Uniform(color ?? new Vector3(21 / 255, 245 / 255, 186 / 255)),
      uColor: new Uniform(color ?? new Vector3(33 / 255, 25 / 255, 81 / 255)),
    }),
    [],
  );

  if (refShaderMaterial.current) {
    refShaderMaterial.current.uniforms.uLineJoinType.value = lineJoinType;
  }

  useFrame(() => {
    if (!refShaderMaterial.current) return;
    if (!animate) return;

    refShaderMaterial.current.uniforms.uPointC.value.x =
      Math.sin(Date.now() / 1000) * 0.3 + 0.5;
    refShaderMaterial.current.uniforms.uPointC.value.y =
      Math.cos(Date.now() / 1000) * 0.3 + 0.5;
  });

  return (
    <mesh
      position={position}
      scale={scale ?? new Vector3(1, 1, 1)}
    >
      <planeGeometry
        attach={"geometry"}
        args={[10, 10, 256, 256]}
      />
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        transparent
        blending={AdditiveBlending}
        ref={refShaderMaterial}
      />
    </mesh>
  );
};
