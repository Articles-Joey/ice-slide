import { useCylinder } from "@react-three/cannon";
import { ModelBarrel } from "../Models/Barrel";
import { useStore } from "@/hooks/useStore";

function Barrel({ position, args }) {

    const debug = useStore(state => state.debug);

    const [ref, api] = useCylinder(() => ({
        mass: 10,
        type: 'Static',
        args: args,
        position: position,
    }))

    return (
        <mesh ref={ref} castShadow>

            <ModelBarrel scale={17} position={[0, -1.25, 0]} />

            {debug &&
                <>
                    <cylinderGeometry args={args} />
                    <meshStandardMaterial color="red" />
                </>
            }


        </mesh>
    )

}

export default Barrel;
