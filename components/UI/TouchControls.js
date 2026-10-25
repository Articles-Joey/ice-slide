"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useSearchParams } from "next/navigation";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useGameControls, useHeldAction } from "@/hooks/useGameControls";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import {
    singlePlayerActions,
    useSinglePlayerStore,
} from "@/hooks/useSinglePlayerStore";
import { useStore } from "@/hooks/useStore";

function HoldButton({ action, disabled, icon, label, ariaLabel }) {
    const heldProps = useHeldAction(action, { disabled });
    return (
        <Button
            {...heldProps}
            type="button"
            variant="outlined"
            disabled={disabled}
            aria-label={ariaLabel}
            disableRipple
            onContextMenu={(event) => event.preventDefault()}
            sx={{
                flex: 1,
                minWidth: 0,
                minHeight: { xs: 56, sm: 64 },
                p: 0.5,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                color: "#eefaff",
                bgcolor: "rgba(141, 207, 244, 0.12)",
                borderColor: "rgba(168, 223, 255, 0.24)",
                touchAction: "none",
                textTransform: "none",
                "&:hover": {
                    bgcolor: "rgba(141, 207, 244, 0.22)",
                    borderColor: "#81d6f5",
                },
                "&:active": {
                    bgcolor: "rgba(141, 207, 244, 0.32)",
                    transform: "scale(0.96)",
                },
                "&.Mui-focusVisible": {
                    outline: "2px solid #b7f0ff",
                    outlineOffset: 2,
                },
                "&.Mui-disabled": {
                    color: "#7c95a5",
                    borderColor: "rgba(168, 223, 255, 0.1)",
                },
            }}
        >
            {icon}
            <Typography
                component="span"
                sx={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}
            >
                {label}
            </Typography>
        </Button>
    );
}

function TouchControlsLayout({
    actions,
    hitRotation,
    hitPower,
    status,
    disabled = false,
    launchLabel = "Launch",
}) {
    const sidebar = useStore((state) => state.sidebar);
    const power = Math.max(0, Math.min(100, Math.round(hitPower || 0)));
    return (
        <Paper
            className="hidden-in-screenshot-mode"
            role="group"
            aria-label="Game touch controls"
            elevation={8}
            sx={{
                position: "fixed",
                bottom: "max(12px, env(safe-area-inset-bottom))",
                left: "max(8px, env(safe-area-inset-left))",
                right: "max(8px, env(safe-area-inset-right))",
                maxWidth: 720,
                mx: "auto",
                p: { xs: 1, sm: 1.5 },
                zIndex: 5,
                color: "#eefaff",
                bgcolor: "rgba(10, 32, 49, 0.95)",
                border: "1px solid rgba(168, 223, 255, 0.24)",
                borderRadius: 3,
                backdropFilter: "blur(12px)",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                "@media (min-width: 992px)": {
                    left: sidebar
                        ? "calc(300px + 24px)"
                        : "max(16px, env(safe-area-inset-left))",
                    right: "max(16px, env(safe-area-inset-right))",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1,
                }}
            >
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                    Aim & power
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#a9dcef" }}>
                    {status}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                    gap: { xs: 1, sm: 2 },
                    alignItems: "end",
                }}
            >
                <Box
                    role="group"
                    aria-label="Rotation controls"
                    sx={{ minWidth: 0 }}
                >
                    <Box sx={{ minHeight: 44, mb: 0.75, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: "#a9c9db",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                            }}
                        >
                            Rotation
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: 20, sm: 24 },
                                fontWeight: 800,
                                lineHeight: 1.2,
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {Math.round(hitRotation || 0) % 360}°
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.75 }}>
                        <HoldButton
                            action={actions.rotateLeft}
                            disabled={disabled}
                            icon={<ArrowBackIcon />}
                            label="Left"
                            ariaLabel="Rotate left"
                        />
                        <HoldButton
                            action={actions.rotateRight}
                            disabled={disabled}
                            icon={<ArrowForwardIcon />}
                            label="Right"
                            ariaLabel="Rotate right"
                        />
                    </Box>
                </Box>
                <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    disabled={disabled}
                    onClick={actions.launch}
                    aria-label={
                        launchLabel === "Launch"
                            ? "Ready and launch"
                            : launchLabel
                    }
                    sx={{
                        width: { xs: 76, sm: 100 },
                        minWidth: 0,
                        minHeight: { xs: 108, sm: 116 },
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                        color: "#09263b",
                        bgcolor: "#79e0f2",
                        fontWeight: 900,
                        fontSize: { xs: 13, sm: 15 },
                        textTransform: "none",
                        touchAction: "none",
                        "&:hover": { bgcolor: "#a5effb" },
                        "&:active": {
                            bgcolor: "#53cde5",
                            transform: "scale(0.97)",
                        },
                        "&.Mui-focusVisible": {
                            outline: "2px solid white",
                            outlineOffset: 2,
                        },
                        "&.Mui-disabled": {
                            bgcolor: "#254456",
                            color: "#8faab9",
                        },
                    }}
                >
                    <RocketLaunchIcon sx={{ fontSize: 30 }} />
                    {launchLabel}
                </Button>
                <Box
                    role="group"
                    aria-label="Power controls"
                    sx={{ minWidth: 0 }}
                >
                    <Box sx={{ minHeight: 44, mb: 0.75, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: "#a9c9db",
                                textTransform: "uppercase",
                                letterSpacing: 1,
                            }}
                        >
                            Power
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: { xs: 20, sm: 24 },
                                fontWeight: 800,
                                lineHeight: 1.2,
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {power}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={power}
                            aria-label="Launch power"
                            sx={{
                                height: 3,
                                mt: 0.25,
                                borderRadius: 1,
                                bgcolor: "#2d4d62",
                                "& .MuiLinearProgress-bar": {
                                    bgcolor: "#79e0f2",
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.75 }}>
                        <HoldButton
                            action={actions.powerDown}
                            disabled={disabled}
                            icon={<RemoveIcon />}
                            label="Less"
                            ariaLabel="Decrease power"
                        />
                        <HoldButton
                            action={actions.powerUp}
                            disabled={disabled}
                            icon={<AddIcon />}
                            label="More"
                            ariaLabel="Increase power"
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}

function SinglePlayerTouchControls() {
    const phase = useSinglePlayerStore((state) => state.phase);
    const timer = useSinglePlayerStore((state) => state.timer);
    const hitRotation = useSinglePlayerStore((state) => state.hitRotation);
    const hitPower = useSinglePlayerStore((state) => state.hitPower);
    const inLobby = phase === "lobby";
    const status = inLobby
        ? "In Lobby · Launch to start"
        : phase === "aiming"
          ? `Launch in ${timer}s`
          : phase === "sliding"
            ? "Tires are sliding"
            : phase === "round-over"
              ? "Next round…"
              : phase === "complete"
                ? "Game Over"
                : "Preparing…";
    return (
        <TouchControlsLayout
            actions={singlePlayerActions}
            hitRotation={hitRotation}
            hitPower={hitPower}
            status={status}
            disabled={!inLobby && phase !== "aiming"}
            launchLabel={inLobby ? "Start & Launch" : "Launch"}
        />
    );
}

function MultiplayerTouchControls({ server }) {
    const actions = useGameControls({ server });
    const hitRotation = useIceSlideStore((state) => state.hitRotation);
    const hitPower = useIceSlideStore((state) => state.hitPower);
    return (
        <TouchControlsLayout
            actions={actions}
            hitRotation={hitRotation}
            hitPower={hitPower}
            status="Hold to adjust"
        />
    );
}

export default function TouchControls() {
    const server = useSearchParams().get("server");
    const enabled = useTouchControlsStore((state) => state.enabled);
    if (!enabled) return null;
    return server ? (
        <MultiplayerTouchControls
            key={server}
            server={server}
        />
    ) : (
        <SinglePlayerTouchControls />
    );
}
