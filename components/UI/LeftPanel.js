"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import ArticlesButton from "./Button";
import GameDetailsPanel from "./GameDetailsPanel";
import DebugPanel from "./DebugPanel";

export default function LeftPanelContent() {
    const server = useSearchParams().get("server");
    const debug = useStore((state) => state.debug);
    const socket = useSocketStore((state) => state.socket);

    return (
        <Box sx={{ width: "100%" }}>
            <Card sx={{ bgcolor: "game.card", backgroundImage: "none", fontSize: "0.875rem", border: 1, borderColor: "divider" }}>
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                        <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>Server: {server}</Box>
                        <Box>Players: {0}/4</Box>
                    </Box>
                    {!socket?.connected && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>Not connected</Typography>
                            <ArticlesButton sx={{ width: "100%" }} onClick={() => socket?.connect()}>
                                Reconnect!
                            </ArticlesButton>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <GameDetailsPanel />
            {debug && <DebugPanel />}
        </Box>
    );
}

