import { useState } from "react";
import { useCylinder } from "@react-three/cannon";

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

export default Star;
