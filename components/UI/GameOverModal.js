"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import ArticlesButton from "./Button";
import ArticlesModal from "./ArticlesModal";

function SinglePlayerResults({ result }) {
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
                <b>{result.nickname}</b>, you completed all three rounds!
            </Box>
            {result.winner && (
                <Box sx={{ mb: 2 }}>
                    <b>
                        {result.winner.isBot
                            ? `${result.winner.nickname} wins!`
                            : "You won!"}
                    </b>{" "}
                    Closest final finish: {result.winner.distance.toFixed(2)}{" "}
                    meters.
                </Box>
            )}
            <Box sx={{ mb: 2 }}>
                {result.finalDistance === null ? (
                    "Your final shot went off the ice. Try a little less power."
                ) : (
                    <>
                        You finished{" "}
                        <b>{result.finalDistance.toFixed(2)} meters</b> from the
                        center.
                    </>
                )}
            </Box>
            {result.rounds.map((round) => (
                <Box
                    key={round.round}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        py: 1,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Box>Round {round.round}</Box>
                    <Box>
                        {round.fellOff
                            ? "Off the ice"
                            : `${round.distance.toFixed(2)} m`}{" "}
                        · {round.coins} stars
                    </Box>
                </Box>
            ))}
            <Box sx={{ mt: 2 }}>
                Stars collected: <b>{result.coins}</b>
            </Box>
            {result.bestDistance !== null && (
                <Box sx={{ mt: 1 }}>
                    Closest round: {result.bestDistance.toFixed(2)} meters
                </Box>
            )}
            {result.rankings && (
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ fontWeight: 700, mb: 1 }}>Final standings</Box>
                    {result.rankings.map((player) => (
                        <Box
                            key={player.id}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 1,
                                py: 0.5,
                            }}
                        >
                            <Box sx={{ color: player.color }}>
                                {player.rank}.{" "}
                                {player.isBot
                                    ? player.nickname
                                    : `${player.nickname} (You)`}
                            </Box>
                            <Box>
                                {player.distance === null
                                    ? "Off the ice"
                                    : `${player.distance.toFixed(2)} m`}{" "}
                                · {player.coins} stars
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default function GameOverModal({
    show,
    setShow,
    singlePlayerResult,
    onPlayAgain,
}) {
    const socket = useSocketStore((state) => state.socket);
    const connected = useSocketStore((state) => state.connected);
    const winner = useGameStore((state) => state.gameState.winner);
    const rankings = useGameStore((state) => state.gameState.rankings);
    const setGameState = useGameStore((state) => state.setGameState);
    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const local_play = searchParams.get("local_play");

    return (
        <ArticlesModal
            show={show}
            setShow={setShow}
            title="Game Over"
            sx={{ p: 0 }}
            maxWidth="xs"
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton
                        component={Link}
                        href="/"
                        variant="outline-dark"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </ArticlesButton>
                    <ArticlesButton
                        variant="outline-dark"
                        disabled={
                            !singlePlayerResult && Boolean(server && !connected)
                        }
                        onClick={() => {
                            if (singlePlayerResult) {
                                onPlayAgain?.();
                                return;
                            }
                            if (server) {
                                socket.emit(
                                    `game:${process.env.NEXT_PUBLIC_GAME_KEY}:start-game`,
                                    {
                                        server_id: server,
                                    },
                                );
                            }
                            if (local_play === "true") {
                                setGameState({
                                    ...useGameStore.getState().gameState,
                                    status: "In Lobby",
                                    timer: 0,
                                    positions: Array.from(
                                        { length: 23 },
                                        (_, player_i) => ({
                                            player_index: player_i,
                                            x: 0,
                                            y: player_i * 3,
                                            newX:
                                                Math.floor(Math.random() * 6) +
                                                5,
                                        }),
                                    ),
                                });
                            }
                        }}
                    >
                        Play Again
                    </ArticlesButton>
                </>
            )}
        >
            {singlePlayerResult && (
                <SinglePlayerResults result={singlePlayerResult} />
            )}
            {!singlePlayerResult && (
                <Box sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        {winner ? (
                            <>
                                The winner was{" "}
                                <b>{winner.nickname || "Unknown"}</b> with a
                                distance of <b>{winner.distance.toFixed(2)}</b>{" "}
                                meters!
                            </>
                        ) : (
                            "No player positions were available to determine a winner."
                        )}
                    </Box>
                    <Box sx={{ mb: 1 }}>Here is how everyone else did:</Box>
                    {rankings
                        ?.filter((player) => player.id !== winner?.id)
                        .map((player, index) => (
                            <Box key={player.id || index}>
                                <b>{player.nickname || "Unknown"}</b>:{" "}
                                {player.distance.toFixed(2)} meters
                            </Box>
                        ))}
                </Box>
            )}
        </ArticlesModal>
    );
}
