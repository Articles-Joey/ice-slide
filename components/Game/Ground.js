import { useBox } from "@react-three/cannon";

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

export default Ground;
