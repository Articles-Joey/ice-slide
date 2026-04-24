import { useStore } from "@/hooks/useStore";
import { Image } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export default function LogoCube() {

    const graphicsQuality = useStore(state => state.graphicsQuality)

    const distance = 300
    const height = 60

    const sides = [
        { position: [distance, height, 0], rotation: [0, degToRad(-90), 0] },
        { position: [-distance, height, 0], rotation: [0, degToRad(90), 0] },
        { position: [0, height, distance], rotation: [0, degToRad(180), 0] },
        { position: [0, height, -distance], rotation: [0, degToRad(0), 0] },
    ]

    if (graphicsQuality === 'Low') return

    return (
        <group>
            {sides.map((side, index) => (
                <Image
                    key={index}
                    url="img/logo.png"
                    transparent={true}
                    scale={100}
                    rotation={side.rotation}
                    position={side.position}
                />
            ))}
        </group>
    )
}