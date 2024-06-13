import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import '@/App.css'
import { StrictMode } from 'react'
import { CustomObject } from './CustomObject'

function App() {
  return (
    <StrictMode>
      <Canvas
        className='r3f'
        flat
        gl={{
          antialias: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6],
        }}
        shadows
      >
        <OrbitControls />
        <CustomObject />
      </Canvas>
    </StrictMode>
  )
}

export default App
