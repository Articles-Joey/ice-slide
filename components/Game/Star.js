import { useState } from "react";
import { useCylinder } from "@react-three/cannon";
import { ModelCoin } from "../Models/Coin";
import { useStore } from "@/hooks/useStore";

function Star({ position, args, onCollect }) {

    const debug = useStore(state => state.debug);

    const [collected, setCollected] = useState(false);

    const [ref, api] = useCylinder(() => ({
        // mass: 10,
        // type: 'Static',
        isTrigger: true,
        args: args,
        position: position,
        onCollide: () => {
            if (!collected) {
                console.log("Star was collected!")
                setCollected(true)
                if (onCollect) onCollect()
            }
        }
    }))

    return (
        <mesh ref={ref} castShadow>

            <ModelCoin 
                scale={5}
                position={[0, 2, 0]}
            />

            {debug &&
                <>
                    <cylinderGeometry args={args} />
                    <meshStandardMaterial 
                        color="gold" 
                        transparent={true}
                        opacity={collected ? 0 : 0.5}
                    />
                </>
            }

        </mesh>
    )

}

export default Star;
