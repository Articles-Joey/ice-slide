import { useGameStore } from "@/hooks/useGameStore"
import { useIceSlideStore } from "@/hooks/useIceSlideStore"

export default function GameDetailsPanel() {

    const players = useGameStore(state => state.gameState.players)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                <div className="h6 mb-2 d-flex justify-content-between">
                    <RoundAndTimer />
                </div>

                <div>Players</div>

                {players?.map((player, index) => (
                    <div key={index} className="player-entry border p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="" style={{ fontSize: "0.6rem" }}>ID: {player.id}</div>

                        <div className="player-name d-flex align-items-center">
                            <span
                                className={`badge ${player.ready ? 'bg-success' : 'bg-danger'} me-1`}
                                style={{
                                    fontSize: "0.6rem"
                                }}
                            >
                                {player.ready ? "Ready" : "Not Ready"}
                            </span>
                            {player.nickname || "?"}
                        </div>

                        {/* <div className="player-name">Ready: {player.ready ? "Yes" : "No"}</div> */}

                        <div className="d-flex justify-content-between">

                            <div>X: {player?.position?.x?.toFixed(2) || 0} | Z: {player?.position?.z?.toFixed(2) || 0}</div>

                            <div className="d-flex">
                                <div className="me-2">
                                    <i className="fad fa-rocket"></i>
                                    {player.hitPower}
                                </div>
                                <div>
                                    <i className="fad fa-undo"></i>
                                    {player.hitRotation}
                                </div>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

function RoundAndTimer() {

    const gameState = useGameStore(state => state.gameState)

    return (
        <div className="w-100">

            <div className="d-flex align-items-center w-100 justify-content-between">
                <div>Round: {gameState?.round + 1 || 0}</div>
                <div>Time: {gameState?.timer || 0}</div>
            </div>

            <div className="small">Status: {gameState?.status || 0}</div>

        </div>
    )
}