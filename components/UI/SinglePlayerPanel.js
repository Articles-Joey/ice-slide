"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import GameMenuPrimaryButtonGroup from "@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup";
import {
    PLAYER_ID,
    SINGLE_PLAYER_ROUNDS,
    singlePlayerActions,
    useSinglePlayerStore,
} from "@/hooks/useSinglePlayerStore";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import ArticlesButton from "./Button";

function startGame() {
    useSinglePlayerStore.getState().startGame(useStore.getState().nickname);
}

function restartGame() {
    useSinglePlayerStore.getState().createLobby(useStore.getState().nickname);
}

export function SinglePlayerMenu() {
    const status = useSinglePlayerStore((state) => state.status);
    const phase = useSinglePlayerStore((state) => state.phase);
    return (
        <Box sx={{ p: 1 }}>
            {/* <GameMenuPrimaryButtonGroup useStore={useStore} type="GameMenu" useRouter={useRouter} /> */}
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Single Player · Three rounds</Typography> */}
            <Box sx={{ display: "flex" }}>
                <ArticlesButton
                    sx={{ width: "50%", minWidth: 0 }}
                    disabled={status === "In Progress" || phase === "idle"}
                    onClick={startGame}
                >
                    Start Game
                </ArticlesButton>
                <ArticlesButton
                    sx={{ width: "50%", minWidth: 0 }}
                    onClick={restartGame}
                >
                    Restart Game
                </ArticlesButton>
            </Box>
        </Box>
    );
}

export default function SinglePlayerPanel() {
    const touchControlsEnabled = useTouchControlsStore(
        (state) => state.enabled,
    );
    const status = useSinglePlayerStore((state) => state.status);
    const phase = useSinglePlayerStore((state) => state.phase);
    const round = useSinglePlayerStore((state) => state.round);
    const timer = useSinglePlayerStore((state) => state.timer);
    const hitRotation = useSinglePlayerStore((state) => state.hitRotation);
    const hitPower = useSinglePlayerStore((state) => state.hitPower);
    const coins = useSinglePlayerStore((state) => state.coins);
    const rounds = useSinglePlayerStore((state) => state.rounds);
    const players = useSinglePlayerStore((state) => state.players);
    const setAim = useSinglePlayerStore((state) => state.setAim);
    const aiming = phase === "aiming";
    const inLobby = phase === "lobby";
    const canAim = inLobby || aiming;
    const lastRound = rounds.at(-1);
    const human = players.find((player) => player.id === PLAYER_ID);

    return (
        <Paper
            elevation={5}
            className="hidden-in-screenshot-mode"
            sx={{
                // position: "absolute",
                // top: 16,
                // right: 16,
                // zIndex: 1,
                // width: { xs: 240, sm: 290 },
                // maxWidth: "calc(100vw - 32px)",
                // maxHeight: touchControlsEnabled
                //     ? "calc(100dvh - 208px)"
                //     : "calc(100dvh - 32px)",
                // overflowY: "auto",
                p: 2,
                bgcolor: "game.card",
                border: 1,
                borderColor: "divider",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                }}
            >
                <Typography fontWeight={700}>
                    Round {round + 1} / {SINGLE_PLAYER_ROUNDS}
                </Typography>
                <Typography
                    role="timer"
                    aria-label="Seconds until launch"
                >
                    {aiming ? `${timer}s` : "You + 3 bots"}
                </Typography>
            </Box>
            <Typography
                variant="body2"
                sx={{ mt: 1, fontWeight: 700 }}
            >
                Status: {status}
            </Typography>
            {/* <Typography
                variant="body2"
                aria-live="polite"
                sx={{ my: 1 }}
            >
                {phase === "loading" || phase === "idle"
                    ? "Preparing the ice…"
                    : inLobby
                      ? "Adjust your aim, then Start Game for a countdown or Launch to start and shoot."
                      : aiming
                        ? "Aim for the center. Launch when ready."
                        : phase === "sliding"
                          ? "Sliding… waiting for all four tires to stop."
                          : phase === "round-over"
                            ? lastRound?.fellOff
                                ? "Off the ice. Next round…"
                                : `${lastRound?.distance.toFixed(2)} m from center. Next round…`
                            : "Three rounds complete."}
            </Typography> */}
            {!touchControlsEnabled && (
                <>
                    <Typography variant="body2">
                        Rotation: {hitRotation}°
                    </Typography>
                    <Slider
                        aria-label="Aim rotation"
                        min={0}
                        max={359}
                        step={1}
                        value={hitRotation}
                        disabled={!canAim}
                        onChange={(_, value) => setAim({ hitRotation: value })}
                    />
                    <Typography variant="body2">
                        Power: {hitPower} / 100
                    </Typography>
                    <Slider
                        aria-label="Launch power"
                        min={0}
                        max={100}
                        step={1}
                        value={hitPower}
                        disabled={!canAim}
                        onChange={(_, value) => setAim({ hitPower: value })}
                    />
                    <ArticlesButton
                        sx={{ width: "100%" }}
                        disabled={!canAim}
                        onClick={singlePlayerActions.launch}
                    >
                        {inLobby ? "Start & Launch" : "Ready — Launch"}
                    </ArticlesButton>
                    <Typography
                        variant="caption"
                        component="p"
                        sx={{ mt: 1 }}
                    >
                        ← → / A D: aim · ↑ ↓ / W S: power · Space / Enter:
                        launch
                    </Typography>
                </>
            )}
            <Typography
                variant="body2"
                sx={{ mt: 1 }}
            >
                Stars: {human?.coins || 0} total · {coins} this round
            </Typography>
            {rounds.map((result) => (
                <Typography
                    key={result.round}
                    variant="caption"
                    component="p"
                >
                    Round {result.round}:{" "}
                    {result.fellOff
                        ? "Off the ice"
                        : `${result.distance.toFixed(2)} m from center`}{" "}
                    · {result.coins} stars
                </Typography>
            ))}
            {/* <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: "divider" }}>
                {players
                    .filter((player) => player.isBot)
                    .map((player) => {
                        const lastFinish = player.rounds.at(-1);
                        return (
                            <Typography
                                key={player.id}
                                variant="caption"
                                component="p"
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        color: player.color,
                                        fontWeight: 700,
                                    }}
                                >
                                    {player.nickname}
                                </Box>
                                {lastFinish
                                    ? ` · Last finish: ${lastFinish.fellOff ? "off the ice" : `${lastFinish.distance.toFixed(2)} m`}`
                                    : " · Bot opponent"}
                            </Typography>
                        );
                    })}
            </Box> */}
            {phase === "complete" && (
                <ArticlesButton
                    sx={{ mt: 1 }}
                    onClick={startGame}
                >
                    Play Again
                </ArticlesButton>
            )}
        </Paper>
    );
}
