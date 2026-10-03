"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ReplayIcon from "@mui/icons-material/Replay";
import ArticlesButton from "./Button";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { useStore } from "@/hooks/useStore";

export default function DebugPanel() {
    const hitRotation = useIceSlideStore((state) => state.hitRotation);
    const hitPower = useIceSlideStore((state) => state.hitPower);
    const incSceneKey = useStore((state) => state.incSceneKey);

    return (
        <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Box sx={{ fontSize: "0.875em" }}>Debug Controls</Box>
                <Box sx={{ fontSize: "0.875em", border: 1, borderColor: "divider", p: 1 }}>
                    <Box>Rotation Angle: {hitRotation}</Box>
                    <Box>Power: {hitPower}/100</Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <ArticlesButton small sx={{ width: "50%" }} startIcon={<ReplayIcon />} onClick={() => incSceneKey()}>
                        Reload Game
                    </ArticlesButton>
                    <ArticlesButton small sx={{ width: "50%" }} startIcon={<ReplayIcon />} onClick={() => incSceneKey()}>
                        Reset Camera
                    </ArticlesButton>
                </Box>
            </CardContent>
        </Card>
    );
}

