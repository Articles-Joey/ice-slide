import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import { ModelWheel } from "../Models/Wheel";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";

function DummyPlayer({ position, hitPower, hitRotation }) {

    const launchPlayers = useIceSlideStore(state => state.launchPlayers)

    const puckRef = useRef()
    const launched = useRef(false)

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

    useEffect(() => {

        console.log("Player detected launchPlayers change")

        if (launchPlayers && !launched.current) {

            console.log("Launching player with hitPower:", hitPower, "and hitRotation:", hitRotation)

            launched.current = true;
            const angle = (hitRotation * Math.PI) / 180;
            const vx = Math.sin(angle) * hitPower;
            const vz = Math.cos(angle) * hitPower;
            api.velocity.set(vx, 0, vz);
        }

        if (!launchPlayers) {
            launched.current = false;
        }

    }, [launchPlayers])

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
