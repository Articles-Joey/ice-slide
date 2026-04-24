import { degToRad } from "three/src/math/MathUtils";

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

export default FlatRing;
