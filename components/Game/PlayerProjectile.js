import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import { MathUtils } from "three";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { ModelWheel } from "../Models/Wheel";

function PlayerProjectile() {

    const puckRef = useRef()

    const [ref, api] = useCylinder(() => ({
        mass: 10,
        // type: 'Dynamic',
        args: [3, 3, 1, 32],
        position: [-40, 1.5, -40],
        linearDamping: 0.2,
        angularDamping: 0.3,
        linearFactor: [1, 0, 1],   // prevent Y-axis launch on collision
        angularFactor: [0, 1, 0],  // prevent tumbling, only allow Y-axis spin
    }))

    const hitRotation = useIceSlideStore(state => state.hitRotation);
    const hitPower = useIceSlideStore(state => state.hitPower);
    const launchPlayer = useIceSlideStore(state => state.launchPlayer);
    const setLaunchPlayer = useIceSlideStore(state => state.setLaunchPlayer);

    // const {
    //     hitRotation,
    //     setHitRotation,
    //     hitPower,
    //     setHitPower
    // } = useIceSlideStore(state => ({
    //     hitRotation: state.hitRotation,
    //     setHitRotation: state.setHitRotation,
    //     hitPower: state.hitPower,
    //     setHitPower: state.setHitPower,
    // }));

    // const nudgePuck = () => {
    //     // Apply impulse or force to the ball
    //     api.applyImpulse([10, 0, 10], [0, 0, 0]); // Pushes the ball along the x-axis
    // };

    useEffect(() => {
        if (launchPlayer) {
            nudgePuck();
            setLaunchPlayer(false);
        }
    }, [launchPlayer])

    const nudgePuck = () => {
        // Convert hitRotation to radians
        const radians = MathUtils.degToRad(hitRotation);

        // Calculate impulse direction based on rotation
        const impulseX = Math.sin(radians) * (hitPower * 10); // Z-axis points forward in Three.js, so sin affects X
        const impulseZ = Math.cos(radians) * (hitPower * 10); // Cos affects Z

        // Apply impulse to the ball in the calculated direction
        api.applyImpulse([impulseX, 0, impulseZ], [0, 0, 0]); // Apply impulse at the center of the object
    };

    // Freeze when movement dies down
    // useEffect(() => {
    //     const unsubscribe = api.velocity.subscribe(([vx, vy, vz]) => {
    //         const speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
    //         if (speed < 2) {
    //             api.velocity.set(0, 0, 0);
    //             api.angularVelocity.set(0, 0, 0);
    //         }
    //     });

    //     return () => unsubscribe(); // Clean up subscription when the component unmounts
    // }, [api.velocity]); // Only re-run if api.velocity changes

    // Freeze when movement dies down
    useEffect(() => {

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

    }, [api.position]); // Only re-run if api.velocity changes

    useFrame(() => {

        // Causing lag, my guess is because it subscribes every frame, now in useEffect
        // if (puckRef.current) {
        //     // Get the current position of the sphere from the physics API
        //     api.position.subscribe((position) => {

        //         puckRef.current.position.set(...position);

        //         if (position[1] < -10) {
        //             console.log("Y position below 0. Stopping physics.");
        //             api.mass.set(0); // Set mass to 0 to deactivate physics
        //             api.velocity.set(0, 0, 0); // Stop all motion
        //             api.angularVelocity.set(0, 0, 0); // Stop rotation
        //         }

        //     });
        // }

        // if (ref.current) {
        //     // Monitor velocity of the sphere
        //     api.velocity.subscribe(([vx, vy, vz]) => {
        //         const speed = Math.sqrt(vx * vx + vy * vy + vz * vz); // Calculate total speed

        //         console.log("speed", speed)

        //         // Stop the sphere if its speed is below a threshold (e.g., 0.1)
        //         if (speed < 2) {
        //             console.log("Stopping sphere due to low velocity.");
        //             api.velocity.set(0, 0, 0); // Stop linear velocity
        //             api.angularVelocity.set(0, 0, 0); // Stop angular velocity
        //         }
        //     });
        // }

    })

    return (
        <group>

            <mesh ref={ref} castShadow>

                <cylinderGeometry args={[3, 3, 1, 32]} />
                <meshStandardMaterial color="red" />

            </mesh>

            <group ref={puckRef} rotation={[0, degToRad(hitRotation), 0]}>

                {/* <mesh castShadow>
                    <cylinderGeometry args={[3, 3, 1]} />
                    <meshStandardMaterial color="black" />
                </mesh> */}

                <ModelWheel 
                    scale={10}
                    position={[0, -1.1, 0]}
                />

                {/* Direction Arrow */}
                <mesh castShadow position={[0, 0, (hitPower / 2)]} rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry
                        args={[0.5, 0.5, hitPower]}
                    />
                    <meshStandardMaterial color="black" />

                    <mesh
                        castShadow
                        position={[0, -(hitPower / 2), 0]}
                        rotation={[0, 0, 0]}
                    >
                        <cylinderGeometry
                            args={[3, 0, 5]}
                        />
                        <meshStandardMaterial color="black" />
                    </mesh>

                </mesh>

            </group>

        </group>
    )

}

export default PlayerProjectile;
