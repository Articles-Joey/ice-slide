import { useBox } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";

function Wall({ args, position, rotation }) {

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: args,
        position: position,
        rotation: rotation
    }))

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={args} />
            {/* <BeachBall /> */}
            <meshStandardMaterial color="gray" />
        </mesh>
    )

}

function Walls() {

    return (
        <group>

            {/* Top */}
            <Wall
                args={[20, 2, 1]}
                position={[-40, 1, -50]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[40, 1, -50]}
            />

            {/* Bottom */}
            <Wall
                args={[20, 2, 1]}
                position={[-40, 1, 50]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[40, 1, 50]}
            />

            {/* Left */}
            <Wall
                args={[20, 2, 1]}
                position={[-50, 1, 40]}
                rotation={[0, degToRad(90), 0]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[-50, 1, -40]}
                rotation={[0, degToRad(90), 0]}
            />

            {/* Right */}
            <Wall
                args={[20, 2, 1]}
                position={[50, 1, 40]}
                rotation={[0, degToRad(90), 0]}
            />
            <Wall
                args={[20, 2, 1]}
                position={[50, 1, -40]}
                rotation={[0, degToRad(90), 0]}
            />

        </group>
    )

}

export default Walls;
