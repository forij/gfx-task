import { Vector3 } from 'three'
import { useControls } from 'leva'
import { PlaneMesh } from './PlaneMesh'

const NUM_OBJECT = 1000

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
  })

  return (
    <>
      <PlaneMesh
        position={new Vector3(controls.renderManyObjects ? -5 : 0, 0, 0)}
        lineJoinType={controls.lineJoinType}
        animate={controls.animate}
      />

      {controls.renderManyObjects &&
        Array.from({ length: NUM_OBJECT }).map((_, index) => {
          return (
            <PlaneMesh
              key={index}
              position={
                new Vector3(
                  3 + Math.random() * 10,
                  Math.random() * 10 - 5,
                  Math.random()
                )
              }
              scale={new Vector3(0.1, 0.1, 1)}
              lineJoinType={controls.lineJoinType}
              color={new Vector3(Math.random(), Math.random(), Math.random())}
            />
          )
        })}
    </>
  )
}
