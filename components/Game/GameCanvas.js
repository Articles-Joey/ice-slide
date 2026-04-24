import { memo } from "react";

import { Canvas } from "@react-three/fiber"
import { Sky, OrbitControls, Stats, Image } from "@react-three/drei";

import { Debug, Physics } from "@react-three/cannon";
import { degToRad } from "three/src/math/MathUtils";
import WaterPlane from "./WaterPlane";
import { ModelGoogleIglooOpen } from "@/components/Models/Igloo Open";
import { ModelKennyNLMiniGolfFlagRed } from "@/components/Models/flag-red";
import Icebergs from "./Icebergs";
// import GrassPlane from "./GrassPlane";
import FlatRing from "./FlatRing";
import Ground from "./Ground";
import Rocks from "./Rocks";
import Walls from "./Walls";
import PlayerProjectile from "./PlayerProjectile";
import DummyPlayer from "./DummyPlayer";
import Barrel from "./Barrel";
import Star from "./Star";
import LogoCube from "./LogoCube";
import { useStore } from "@/hooks/useStore";
import { ModelBear } from "../Models/Bear";
import Penguins from "./Penguins";
import { ModelWalrus } from "../Models/Walrus";
import { ModelSnowman } from "../Models/Snowman";

function GameCanvas(props) {

    const debug = useStore(state => state.debug);

    return (
        <Canvas camera={{ position: [-10, 40, 40], fov: 50 }}>

            {process.env.NODE_ENV === 'development' &&
                <>
                    <axesHelper args={[50]} />
                    <Stats />
                </>
            }

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

            <LogoCube />

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

            <Icebergs />

            <Rocks />

            <ModelGoogleIglooOpen
                position={[100, 29.5, 0]}
                scale={3}
                rotation={[0, degToRad(-55), 0]}
            />

            <ModelKennyNLMiniGolfFlagRed
                position={[100, 30, 10]}
                scale={10}
                rotation={[0, degToRad(-90), 0]}
            />

            <ModelBear
                position={[100, 31.25, 8]}
                scale={0.025}
                rotation={[0, degToRad(-90), 0]}
            />

            <Penguins />

            <ModelWalrus
                position={[0, 31.25, 100]}
                scale={0.01}
            />

            <ModelSnowman
                position={[0, 31.25, -100]}
            />

            <Physics>

                <Debug color="black" scale={debug ? 1 : 0}>

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
                        position={[40, 1.5, -40]}
                    />

                    <DummyPlayer
                        position={[40, 1.5, 40]}
                    />

                    <DummyPlayer
                        position={[-40, 1.5, 40]}
                    />

                    <Ground />

                    <Walls />

                </Debug>

            </Physics>

        </Canvas>
    )
}

export default memo(GameCanvas)
