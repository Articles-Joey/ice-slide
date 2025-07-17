import { createContext, createRef, forwardRef, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sky, useDetectGPU, useTexture, OrbitControls, Cylinder, QuadraticBezierLine, Text } from "@react-three/drei";

import { NearestFilter, RepeatWrapping, TextureLoader, Vector3 } from "three";
// import GameGrid from "./GameGrid";
// import Tree from "@/components/Games/Epcot/Tree";
// import Witch from "../Race Game/PlayerModels/Witch";
// import Duck from "../Race Game/PlayerModels/Duck";
// import { Star } from "../Race Game/Star";

// import Sand from '../USA Tycoon/Floors/Sand';
// import { Cannon } from "./Models/Cannon";
// import { PaintBucket } from "./Models/PaintBucket";
// import { Farm } from "./Models/Farm";
import { Physics, useBox, useCylinder, useSphere } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import WaterPlane from "./WaterPlane";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { ModelKennyNLGraveyardRocksTall } from "@/components/Models/rocks-tall";
import { useHotkeys } from "react-hotkeys-hook";
import { MathUtils } from "three";
import { ModelGoogleIglooOpen } from "@/components/Models/Igloo Open";
import { ModelKennyNLMiniGolfFlagRed } from "@/components/Models/flag-red";

const texture = new TextureLoader().load(`${process.env.NEXT_PUBLIC_CDN}games/Race Game/grass.jpg`)

const GrassPlane = () => {

    const width = 110; // Set the width of the plane
    const height = 170; // Set the height of the plane

    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 5)

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry attach="geometry" args={[width, height]} />
                <meshStandardMaterial attach="material" map={texture} />
            </mesh>
        </>
    );
};

function GameCanvas(props) {

    // const GPUTier = useDetectGPU()

    // const {
    //     playerRotation,
    //     setPlayerRotation
    // } = useCannonStore(state => ({
    //     playerRotation: state.playerRotation,
    //     setPlayerRotation: state.setPlayerRotation
    // }));

    const {
        handleCameraChange,
        gameState,
        players,
        move,
        cameraInfo,
        server
    } = props;

    const [[a, b, c, d, e]] = useState(() => [...Array(5)].map(createRef))

    return (
        <Canvas camera={{ position: [-10, 40, 40], fov: 50 }}>

            <OrbitControls
            // autoRotate={gameState?.status == 'In Lobby'}
            />

            <Sky
                // distance={450000}
                sunPosition={[0, 10, 0]}
            // inclination={0}
            // azimuth={0.25}
            // {...props} 
            />

            <ambientLight intensity={5} />
            <spotLight intensity={30000} position={[-50, 100, 50]} angle={5} penumbra={1} />

            {/* <pointLight position={[-10, -10, -10]} /> */}

            <FlatRing
                args={[3, 5, 32]}
                color={"gold"}
            />

            <FlatRing
                args={[6, 8, 32]}
                color={"white"}
            />

            <WaterPlane
                position={[0, 0, 0]}
            />

            <Rocks />

            <ModelGoogleIglooOpen
                position={[100, 30, 0]}
                scale={3}
                rotation={[0, degToRad(-55), 0]}
            />

            <ModelKennyNLMiniGolfFlagRed
                position={[100, 30, 10]}
                scale={10}
                rotation={[0, degToRad(-90), 0]}
            />

            <Physics>

                <PlayerProjectile />

                <Barrel
                    position={[20, 1, -10]}
                    args={[2, 2, 6, 10]}
                />

                <Star
                    position={[-20, 1, 10]}
                    args={[2, 2, 6, 10]}
                />

                <DummyPlayer
                    position={[40, 5, -40]}
                />

                <DummyPlayer
                    position={[40, 5, 40]}
                />

                <DummyPlayer
                    position={[-40, 5, 40]}
                />

                <Ground />

                <Walls />

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)

const FlatRing = ({ args, color }) => {
    return (
        <mesh
            rotation={[degToRad(-90), 0, 0]}
            position={[0, 0.28, 0]}
        >
            <ringGeometry args={args} /> {/* Inner radius, outer radius, segments */}
            <meshStandardMaterial color={color} /> {/* side={2} makes it visible on both sides */}
        </mesh>
    );
};

function Ground() {

    const [ref, api] = useBox(() => ({
        mass: 0,
        type: 'Static',
        args: [100, 0.5, 100],
        position: [0, 0, 0],
    }))

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[100, 0.5, 100]} />
            {/* <BeachBall /> */}
            <meshStandardMaterial color="#08e8de" />
        </mesh>
    )

}

function Rocks() {

    return (
        <group>
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[0, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[0, 0, 100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[-100, 0, 0]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[100, 0, 0]}
            />
        </group>
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

function PlayerProjectile() {

    const puckRef = useRef()

    const [ref, api] = useSphere(() => ({
        mass: 10,
        // type: 'Dynamic',
        args: [1, 1, 1],
        position: [-40, 5, -40],
    }))

    const {
        hitRotation,
        setHitRotation,
        hitPower,
        setHitPower
    } = useIceSlideStore(state => ({
        hitRotation: state.hitRotation,
        setHitRotation: state.setHitRotation,
        hitPower: state.hitPower,
        setHitPower: state.setHitPower,
    }));

    // const nudgePuck = () => {
    //     // Apply impulse or force to the ball
    //     api.applyImpulse([10, 0, 10], [0, 0, 0]); // Pushes the ball along the x-axis
    // };

    const nudgePuck = () => {
        // Convert hitRotation to radians
        const radians = MathUtils.degToRad(hitRotation);

        // Calculate impulse direction based on rotation
        const impulseX = Math.sin(radians) * hitPower; // Z-axis points forward in Three.js, so sin affects X
        const impulseZ = Math.cos(radians) * hitPower; // Cos affects Z

        // Apply impulse to the ball in the calculated direction
        api.applyImpulse([impulseX, 0, impulseZ], [0, 0, 0]); // Apply impulse at the center of the object
    };

    useHotkeys(['Enter'], () => {
        console.log("Launch?")
        nudgePuck()
    });

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

                <sphereGeometry args={[1, 10, 10]} />
                <meshStandardMaterial color="red" />

            </mesh>

            <group ref={puckRef} rotation={[0, degToRad(hitRotation), 0]}>

                <mesh castShadow>
                    <cylinderGeometry args={[3, 3, 1]} />
                    <meshStandardMaterial color="black" />
                </mesh>

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

function Barrel({ position, args }) {

    const [ref, api] = useCylinder(() => ({
        mass: 10,
        type: 'Static',
        args: args,
        position: position,
    }))

    return (
        <mesh ref={ref} castShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial color="red" />
        </mesh>
    )

}

function Star({ position, args }) {

    const [collected, setCollected] = useState(false);

    const [ref, api] = useCylinder(() => ({
        // mass: 10,
        // type: 'Static',
        isTrigger: true,
        args: args,
        position: position,
        onCollide: () => {
            console.log("Star was collected!")
            setCollected(true)
        }
    }))

    return (
        <mesh ref={ref} castShadow>
            <cylinderGeometry args={args} />
            <meshStandardMaterial 
                color="gold" 
                transparent={true}
                opacity={collected ? 0 : 1}
            />
        </mesh>
    )

}