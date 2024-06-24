import { Matrix4, Quaternion, Vector3 } from "three";
import { useControls } from "leva";
import { PlaneInstancedMesh, IInstanceData } from "./PlaneMesh";

const NUM_OBJECT = 100000;

export const CustomObjects = () => {
  const controls = useControls({
    lineJoinType: {
      options: {
        Round: 1,
        Miter: 2,
        Bevel: 3,
      },
    },
    renderManyObjects: false,
    animate: true,
  });

  const instancesData: IInstanceData[] = [];

  if (controls.renderManyObjects) {
    for (let i = 0; i < NUM_OBJECT; i++) {
      const matrix = new Matrix4().compose(
        new Vector3(
          3 + Math.random() * 10,
          Math.random() * 10 - 5,
          Math.random(),
        ),
        new Quaternion(),
        new Vector3(0.1, 0.1, 1),
      );
      const color = new Vector3(Math.random(), Math.random(), Math.random());
      instancesData.push({matrix, color});
    }
  }

  return (
    <>
      <PlaneInstancedMesh
        position={new Vector3(controls.renderManyObjects ? -5 : 0, 0, 0)}
        lineJoinType={controls.lineJoinType}
        animate={controls.animate}
      />

      {controls.renderManyObjects &&
        (
          <PlaneInstancedMesh
            lineJoinType={controls.lineJoinType}
            animate={controls.animate}
            instancesData={instancesData}
            instancesAmount={NUM_OBJECT}
          />
        )}
    </>
  );
};
