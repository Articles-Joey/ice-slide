import { ModelIceberg } from "../Models/Iceberg";

export default function Icebergs() {

    return (
        <>
            <ModelIceberg
                position={[-60, 0, -60]}
                scale={0.05}
            />
            <ModelIceberg
                position={[60, 0, 60]}
                scale={0.05}
            />
            <ModelIceberg
                position={[-60, 0, 60]}
                scale={0.05}
            />
            <ModelIceberg
                position={[60, 0, -60]}
                scale={0.05}
            />
        </>
    )
}