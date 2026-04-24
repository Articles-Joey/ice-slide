import { useStore } from "@/hooks/useStore";
import { ModelPenguin } from "../Models/Penguin";
import { degToRad } from "three/src/math/MathUtils";

export default function Penguins() {

    const graphicsQuality = useStore(state => state.graphicsQuality)

    const spacingX = 4;
    const spacingZ = 4;
    
    // Bowling pin formation (1-2-3-4 layout)
    const penguinPositions = [
        [0, 0, 0],                             // Row 1 (Front pin)
        [-spacingX / 2, 0, spacingZ],          // Row 2
        [spacingX / 2, 0, spacingZ],           
        [-spacingX, 0, spacingZ * 2],          // Row 3
        [0, 0, spacingZ * 2],                  
        [spacingX, 0, spacingZ * 2],           
        [-spacingX * 1.5, 0, spacingZ * 3],    // Row 4
        [-spacingX / 2, 0, spacingZ * 3],
        [spacingX / 2, 0, spacingZ * 3],
        [spacingX * 1.5, 0, spacingZ * 3]
    ];

    if (graphicsQuality === 'Low') return null;

    const visiblePenguins = graphicsQuality === 'Medium' 
        ? penguinPositions.slice(0, 5) 
        : penguinPositions;

    return (
        <group position={[-100, 31.7, -6]}>
            {visiblePenguins.map((pos, index) => (
                <ModelPenguin
                    key={index}
                    position={pos}
                    scale={0.025}
                    rotation={[0, degToRad(90), 0]}
                />
            ))}
        </group>
    )
}