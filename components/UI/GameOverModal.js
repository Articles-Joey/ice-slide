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
    const setGameState = useGameStore((state) => state.setGameState);
    const searchParams = useSearchParams();
    const server = searchParams.get("server");
    const local_play = searchParams.get("local_play");

    return (
        <ArticlesModal show={show} setShow={setShow} title="Game Over" sx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton component={Link} href="/" variant="outline-dark" onClick={() => setOpen(false)}>
                        Close
                    </ArticlesButton>
                    <ArticlesButton variant="outline-dark" onClick={() => {
                        if (server) {
                            socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:start-game`, {
                                server_id: server, status: "In Lobby",
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
                    The winner was <b>{show?.winner?.nickname || "Unknown"}</b> with a distance of <b>{show?.winner?.distance?.toFixed(2) || 0}</b> meters!
                </Box>
                <Box sx={{ mb: 1 }}>Here is how everyone else did:</Box>
                {show?.rankings?.map((player, index) => (
                    <Box key={player.id || index}>
                        <b>{player.nickname || "Unknown"}</b>: {player.distance?.toFixed(2) || 0} meters
                    </Box>
                ))}
            </Box>
        </ArticlesModal>
    );
}

