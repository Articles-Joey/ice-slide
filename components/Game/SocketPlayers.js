import { useIceSlideStore } from "@/hooks/useIceSlideStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"
import DummyPlayer from "./DummyPlayer"
import { useGameStore } from "@/hooks/useGameStore"

export default function SocketPlayers() {

    const players = useGameStore(state => state.gameState.players)
    const gameStarted = useGameStore(state => state.gameState.gameStarted)
    const socket = useSocketStore(state => state.socket)

    const searchParams = useSearchParams()
    const { server } = Object.fromEntries(searchParams.entries())

    return (
        <group>
            {players?.length > 0 && players?.map((player) => (
                <group key={`${gameStarted || "lobby"}:${player.id}`} position={[0, 0, 0]}>
                    <DummyPlayer 
                        position={[player?.x || 0, 1.5, player?.z || 0]}
                        hitPower={player?.hitPower || 0}
                        hitRotation={player?.hitRotation || 0}
                        nickname={player?.nickname || "Player"}
                        socketId={socket?.id}
                        playerId={player.id}
                        server={server}
                    />
                </group>
            ))}
        </group>
    )

}
