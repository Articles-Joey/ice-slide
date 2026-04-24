import { ModelKennyNLGraveyardRocksTall } from "@/components/Models/rocks-tall";

function Rocks() {

    return (
        <group>
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[0, 0, -100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[0, 0, 100]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[-100, 0, 0]}
            />
            <ModelKennyNLGraveyardRocksTall
                scale={50}
                position={[100, 0, 0]}
            />
        </group>
    )

}

export default Rocks;
