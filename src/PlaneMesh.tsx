import {
  AdditiveBlending,
  DoubleSide,
  Matrix4,
  Object3D,
  Quaternion,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import fragmentShader from "./shader/fragment.glsl?raw";
import vertexShader from "./shader/vertex.glsl?raw";

export interface IInstanceData {
  matrix: Matrix4;
  color?: Vector3;
}

interface Props {
  position?: Vector3;
  lineJoinType: number;
  animate?: boolean;
  scale?: Vector3;
  color?: Vector3;

  // For instanced mesh
  instancesAmount?: number;
  instancesData?: IInstanceData[];
}

export const PlaneInstancedMesh: React.FC<Props> = ({
  position,
  lineJoinType,
  scale,
  color,
  animate,
  instancesData,
  instancesAmount,
}) => {
  const defaultMatrix = new Matrix4().compose(
    position ?? new Vector3(),
    new Quaternion(),
    scale ?? new Vector3(1, 1, 1),
  );
  const joinColor = color ?? new Vector3(21 / 255, 245 / 255, 186 / 255);
  color = color ?? new Vector3(33 / 255, 25 / 255, 81 / 255);
  instancesData = instancesData ?? [{ matrix: defaultMatrix, color }];
  instancesAmount = instancesAmount ?? 1;

  const refShaderMaterial = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uPointA: new Uniform(new Vector2(0.1, 0.7)),
      uPointB: new Uniform(new Vector2(0.5, 0.5)),
      uPointC: new Uniform(new Vector2(0.1, 0.1)),
      uThickness: new Uniform(0.1),
      uLineJoinType: new Uniform(lineJoinType),
      // I try to use some nice colors as default https://colorhunt.co/palette/211951836fff15f5baf0f3ff
      uJointColor: new Uniform(joinColor),
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

  const refInstancedMesh = useRef<any>(null);

  useEffect(() => {
    if (!refInstancedMesh.current) return;

    for (let i = 0; i < instancesAmount; i++) {
      refInstancedMesh.current.setMatrixAt(i, instancesData[i].matrix);
      refInstancedMesh.current.setColorAt(i, instancesData[i].color);
    }

    refInstancedMesh.current.instanceMatrix.needsUpdate = true;
    refInstancedMesh.current.instanceColor.needsUpdate = true;
  }, [instancesData]);

  return (
    <instancedMesh
      // @ts-ignore - some problem with ts annotation in of doc example with null as args
      // https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#instancing
      args={[null, null, instancesAmount]}
      ref={refInstancedMesh}
    >
      <planeGeometry
        attach={"geometry"}
        args={[10, 10, 1, 1]}
      />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={DoubleSide}
        transparent
        blending={AdditiveBlending}
        ref={refShaderMaterial}
      />
    </instancedMesh>
  );
};
