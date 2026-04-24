import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";

function DummyPlayer({ position }) {

    const puckRef = useRef()

    const [ref, api] = useSphere(() => ({
        mass: 10,
        // type: 'Dynamic',
        args: [1, 1, 1],
        position: position,
    }))

    useFrame(() => {

        if (puckRef.current) {
            // Get the current position of the sphere from the physics API
            api.position.subscribe((position) => {

                puckRef.current.position.set(...position);

                if (position[1] < -10) {
                    console.log("Y position below 0. Stopping physics.");
                    api.mass.set(0); // Set mass to 0 to deactivate physics
                    api.velocity.set(0, 0, 0); // Stop all motion
                    api.angularVelocity.set(0, 0, 0); // Stop rotation
                }

            });
        }

    })

    return (
        <group>

            <mesh ref={ref} castShadow>

                <sphereGeometry args={[1, 10, 10]} />
                <meshStandardMaterial color="red" />

            </mesh>

            <group ref={puckRef} rotation={[0, 0, 0]}>
                <mesh castShadow>
                    <cylinderGeometry args={[3, 3, 1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>

        </group>
    )

}

export default DummyPlayer;
