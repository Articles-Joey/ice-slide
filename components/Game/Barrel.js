import { useCylinder } from "@react-three/cannon";

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

export default Barrel;
