import { useIceSlideStore } from "@/hooks/useIceSlideStore"
import DummyPlayer from "./DummyPlayer"

export default function SocketPlayers() {

    const players = useIceSlideStore(state => state.players)

    return (
        <group>
            {players.map((player, index) => (
                <group key={index} position={[0, 0, 0]}>
                    <DummyPlayer 
                        position={[player?.x || 0, 1.5, player?.z || 0]}
                        hitPower={player?.hitPower || 0}
                        hitRotation={player?.hitRotation || 0}
                        nickname={player?.nickname || "Player"}
                    />
                </group>
            ))}
        </group>
    )

}