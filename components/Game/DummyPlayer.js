import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import { ModelWheel } from "../Models/Wheel";

function DummyPlayer({ position }) {

    const puckRef = useRef()

    const [ref, api] = useCylinder(() => ({
        mass: 10,
        // type: 'Dynamic',
        args: [3, 3, 1, 32],
        position: position,
        linearDamping: 0.2,
        angularDamping: 0.3,
        linearFactor: [1, 0, 1],   // prevent Y-axis launch on collision
        angularFactor: [0, 1, 0],  // prevent tumbling, only allow Y-axis spin
    }))

    useFrame(() => {

        if (puckRef.current) {
            // Get the current position of the cylinder from the physics API
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

                <cylinderGeometry args={[3, 3, 1, 32]} />
                <meshStandardMaterial color="red" />

            </mesh>

            <group ref={puckRef} rotation={[0, 0, 0]}>

                <ModelWheel
                    scale={10}
                    position={[0, -1.1, 0]}
                />

                {/* <mesh castShadow>
                    <cylinderGeometry args={[3, 3, 1]} />
                    <meshStandardMaterial color="black" />
                </mesh> */}

            </group>

        </group>
    )

}

export default DummyPlayer;
