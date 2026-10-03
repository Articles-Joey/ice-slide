"use client";

import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useGameControls, useHeldAction } from "@/hooks/useGameControls";
import ArticlesButton from "./Button";

export default function TouchControls({ server }) {
    const enabled = useTouchControlsStore((state) => state.enabled);
    const actions = useGameControls({ server });
    const leftProps = useHeldAction(actions.rotateLeft);
    const rightProps = useHeldAction(actions.rotateRight);
    const powerUpProps = useHeldAction(actions.powerUp);
    const powerDownProps = useHeldAction(actions.powerDown);

    return (
        <Box sx={{
            position: "fixed", bottom: "50px", left: 0, right: 0, height: "50px", zIndex: 1,
            bgcolor: "rgba(0,0,0,0.5)", touchAction: "none", userSelect: "none",
            display: enabled ? "flex" : "none", justifyContent: "space-between", alignItems: "center",
            "@media (min-width: 992px)": {
                bottom: "1rem", height: "150px", p: "1rem", left: "calc(300px + 2rem)", right: "1rem",
            },
            "& button": {
                bgcolor: "yellow !important", color: "black !important", fontWeight: 900,
                touchAction: "none", userSelect: "none",
            },
        }}>
            <ArticlesButton large {...leftProps} startIcon={<ArrowBackIcon />}>Left</ArticlesButton>
            <ArticlesButton large {...powerUpProps} startIcon={<ArrowUpwardIcon />} aria-label="Increase power">
                <Box component="span" sx={{ display: "none", "@media (min-width: 992px)": { display: "inline" } }}>Power +</Box>
            </ArticlesButton>
            <ArticlesButton large onClick={actions.launch} startIcon={<RocketLaunchIcon />}>Launch</ArticlesButton>
            <ArticlesButton large {...powerDownProps} startIcon={<ArrowDownwardIcon />} aria-label="Decrease power">
                <Box component="span" sx={{ display: "none", "@media (min-width: 992px)": { display: "inline" } }}>Power -</Box>
            </ArticlesButton>
            <ArticlesButton large {...rightProps} startIcon={<ArrowForwardIcon />}>Right</ArticlesButton>
        </Box>
    );
}

