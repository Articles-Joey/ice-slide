"use client";

import Box from "@mui/material/Box";
import ArticlesModal from "./ArticlesModal";

export default function GameInfoModal({ show, setShow }) {
    return (
        <ArticlesModal show={show} setShow={setShow} title="Game Info" sx={{ p: 0 }}>
            <Box sx={{ aspectRatio: "16 / 9" }}>
                <Box component="img" src="/img/game-preview.webp" alt="Ice Slide game preview"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </Box>
            <Box sx={{ p: 2 }}>
                Get your tire as close to the target in the center as possible. Watch out for other players and obstacles. Collect the barrels to earn bonus points!
            </Box>
        </ArticlesModal>
    );
}

