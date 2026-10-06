"use client";

import Box from "@mui/material/Box";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import ArticlesButton from "./Button";
import ArticlesModal from "./ArticlesModal";

export default function GameOverModal({ show, setShow }) {
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
                    <ArticlesButton component={Link} href="/" variant="outline-dark" onClick={() => setOpen(false)}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton variant="outline-dark" disabled={Boolean(server && !connected)} onClick={() => {
                        if (server) {
                            socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:start-game`, {
                                server_id: server,
                            });
                        }
                        if (local_play === "true") {
                            setGameState({
                                ...useGameStore.getState().gameState,
                                status: "In Lobby",
                                timer: 0,
                                positions: Array.from({ length: 23 }, (_, player_i) => ({
                                    player_index: player_i, x: 0, y: player_i * 3,
                                    newX: Math.floor(Math.random() * 6) + 5,
                                })),
                            });
                        }
                    }}>
                        Play Again
                    </ArticlesButton>
                </>
            )}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    {winner ? (
                        <>The winner was <b>{winner.nickname || "Unknown"}</b> with a distance of <b>{winner.distance.toFixed(2)}</b> meters!</>
                    ) : (
                        "No player positions were available to determine a winner."
                    )}
                </Box>
                <Box sx={{ mb: 1 }}>Here is how everyone else did:</Box>
                {rankings?.filter((player) => player.id !== winner?.id).map((player, index) => (
                    <Box key={player.id || index}>
                        <b>{player.nickname || "Unknown"}</b>: {player.distance.toFixed(2)} meters
                    </Box>
                ))}
            </Box>
        </ArticlesModal>
    );
}
