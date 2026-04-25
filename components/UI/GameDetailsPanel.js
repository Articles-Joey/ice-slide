import { useIceSlideStore } from "@/hooks/useIceSlideStore"

export default function GameDetailsPanel() {

    const players = useIceSlideStore(state => state.players)

    return (
        <div className="card game-details-panel">

            <div className="card-body">

                <div>Players</div>

                {players.map((player, index) => (
                    <div key={index} className="player-entry border border-white p-2">

                        {/* <div className="player-color" style={{ backgroundColor: player.color }}></div> */}

                        <div className="small">ID: {player.id}</div>
                        <div className="player-name">{player.nickname || "?"}</div>
                        <div className="player-name">Ready: {player.ready ? "Yes" : "No"}</div>

                        <div>X: {player?.x || 0} | Z: {player?.z || 0}</div>

                        {
                        // player.ready 
                        true
                        &&
                            <div className="">
                                <div>{player.hitPower}</div>
                                <div>{player.hitRotation}</div>
                            </div>
                        }
                    </div>
                ))}

            </div>

        </div>
    )
}