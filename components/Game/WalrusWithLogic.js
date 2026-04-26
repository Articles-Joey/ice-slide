import { useRef, useState, useEffect } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ModelWalrus } from "../Models/Walrus";
import { useStore } from "@/hooks/useStore";
import { ModelPluto } from "../Models/Pluto";

export default function WalrusWithLogic({ position }) {

    const toontownMode = useStore(state => state.toontownMode);
    const graphicsQuality = useStore(state => state.graphicsQuality);

    let nickname = "Wally the Walrus";
    if (toontownMode) {
        nickname = "Pluto";
    }

    const initialX = position?.[0] || 0;
    const initialZ = position?.[2] || 0;

    const groupRef = useRef();
    const [targetPos, setTargetPos] = useState(new THREE.Vector3(initialX, 0, initialZ));
    const [isMoving, setIsMoving] = useState(false);
    const currentPos = useRef(new THREE.Vector3(initialX, 0, initialZ));
    const targetRotation = useRef(0);

    useEffect(() => {
        if (graphicsQuality === 'Low') return;

        let timeout;
        const pickNewTarget = () => {
            const x = initialX + (Math.random() - 0.5) * 10;
            const z = initialZ + (Math.random() - 0.5) * 10;
            const newTarget = new THREE.Vector3(x, 0, z);

            setTargetPos(newTarget);
            setIsMoving(true);

            targetRotation.current = Math.atan2(
                newTarget.x - currentPos.current.x,
                newTarget.z - currentPos.current.z
            );
        };

        if (!isMoving) {
            const waitTime = Math.random() * 4000 + 1000;
            timeout = setTimeout(pickNewTarget, waitTime);
        }

        return () => clearTimeout(timeout);
    }, [isMoving, initialX, initialZ, graphicsQuality]);

    useFrame(() => {
        if (groupRef.current && graphicsQuality !== 'Low') {
            if (isMoving) {
                currentPos.current.lerp(targetPos, 0.05);
                groupRef.current.position.x = currentPos.current.x;
                groupRef.current.position.z = currentPos.current.z;

                groupRef.current.rotation.y = THREE.MathUtils.lerp(
                    groupRef.current.rotation.y,
                    targetRotation.current,
                    0.1
                );

                if (currentPos.current.distanceTo(targetPos) < 0.01) {
                    setIsMoving(false);
                }
            }
        }
    });

    return (
        <group
            ref={groupRef}
            position={graphicsQuality === 'Low' ? position : [currentPos.current.x, position?.[1] || 0, currentPos.current.z]}
        >
            <Billboard>
                <Text
                    position={[0, 5, 0]}
                    fontSize={0.5}
                    color="black"
                    scale={3}
                    anchorX="center"
                    anchorY="middle"
                >
                    {nickname}
                </Text>
            </Billboard>

            {!toontownMode && <ModelWalrus />}
            {toontownMode && <ModelPluto />}

        </group>
    );
}