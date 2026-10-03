"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UndoIcon from "@mui/icons-material/Undo";
import { useGameStore } from "@/hooks/useGameStore";

export default function GameDetailsPanel() {
    const players = useGameStore((state) => state.gameState.players);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", border: 1, borderColor: "divider" }}>
            <CardContent>
                <Box sx={{ fontSize: "1rem", mb: 1, display: "flex", justifyContent: "space-between" }}>
                    <RoundAndTimer />
                </Box>
                <Box>Players</Box>
                {players?.map((player, index) => (
                    <Box key={player.id || index} sx={{ border: 1, borderColor: "divider", p: 1 }}>
                        <Box sx={{ fontSize: "0.6rem" }}>ID: {player.id}</Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Chip label={player.ready ? "Ready" : "Not Ready"} color={player.ready ? "success" : "error"}
                                size="small" sx={{ mr: 0.5, height: 18, fontSize: "0.6rem" }}
                            />
                            {player.nickname || "?"}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box>X: {player?.position?.x?.toFixed(2) || 0} | Z: {player?.position?.z?.toFixed(2) || 0}</Box>
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ mr: 1, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                    <RocketLaunchIcon fontSize="small" />{player.hitPower}
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                    <UndoIcon fontSize="small" />{player.hitRotation}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
}

function RoundAndTimer() {
    const gameState = useGameStore((state) => state.gameState);
    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                <Box>Round: {gameState?.round + 1 || 0}</Box>
                <Box>Time: {gameState?.timer || 0}</Box>
            </Box>
            <Box sx={{ fontSize: "0.875em" }}>Status: {gameState?.status || 0}</Box>
        </Box>
    );
}

