import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { Water } from 'three-stdlib'
import { useStore } from '@/hooks/useStore'

extend({ Water })

const link = `${process.env.NEXT_PUBLIC_CDN}games/Race Game/waternormals.jpeg`

export default function WaterPlane(props) {

    const ref = useRef()
    const gl = useThree((state) => state.gl)

    const waterNormals = useLoader(THREE.TextureLoader, link)

    const graphicsQuality = useStore(state => state.graphicsQuality)
    const darkMode = useStore(state => state.darkMode)

    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geom = useMemo(() => {
        let size = 1000
        if (graphicsQuality === 'Low') size = 250
        if (graphicsQuality === 'Medium') size = 500
        return new THREE.PlaneGeometry(size, size)
    }, [graphicsQuality])
    const config = useMemo(
        () => ({
            textureWidth: 512,
            textureHeight: 512,
            waterNormals,
            sunDirection: [1000, 10, 0],
            sunColor: darkMode ? 0x222222 : 0xffffff,
            waterColor: darkMode ? 0x011111 : 0x00aaff,
            distortionScale: 3.7,
            fog: false,
            format: gl.encoding
        }),
        [waterNormals, darkMode]
    )
    useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
    return <water ref={ref} args={[geom, config]} {...props} rotation-x={-Math.PI / 2} />
}