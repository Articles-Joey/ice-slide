import { degToRad } from "three/src/math/MathUtils";

const FlatRing = ({ args, color }) => {
    return (
        <mesh
            rotation={[degToRad(-90), 0, 0]}
            position={[0, 0.28, 0]}
            renderOrder={3}
            receiveShadow
        >
            <ringGeometry args={args} />{" "}
            {/* Inner radius, outer radius, segments */}
            <meshStandardMaterial
                color={color}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
            />
        </mesh>
    );
};

export default FlatRing;
