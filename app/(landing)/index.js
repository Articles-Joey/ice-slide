"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import PageTemplateLandingPage from "@articles-media/articles-dev-box/PageTemplateLandingPage";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import RotatingMascot from "@/components/UI/RotatingMascot";

const LandingBackgroundAnimation = dynamic(
    () => import("@/components/Game/LandingBackgroundAnimation"),
    { ssr: false, loading: () => <p>Loading...</p> },
);

export default function IceSlideLobbyPage() {
    const toontownMode = useStore((state) => state.toontownMode);
    const darkMode = useStore((state) => state.darkMode);

    return (
        <Box sx={{
            position: "relative",
            isolation: "isolate",
            "& .landing-page": {
                flexGrow: 1, display: "flex", justifyContent: "center",
                alignItems: "center", minHeight: "100vh",
            },
            "& .servers": {
                display: "grid", gap: "5px", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            },
            "& .server": {
                p: "0.5rem", border: "1px solid rgba(0,0,0,0.25)",
                display: "flex", flexDirection: "column", alignItems: "center",
            },
            "& .ad-wrap": {
                mt: "1rem",
                "@media (min-width: 992px)": {
                    mt: 0, display: "block", position: "absolute",
                    right: "1rem", top: "50%", transform: "translateY(-50%)",
                },
            },
            "& .background-wrap": {
                position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1,
                "& img": { filter: "blur(2px)", opacity: darkMode === false ? 1 : 0.25 },
            },
            "& .card, & .MuiCard-root, & .ad-wrap": {
                boxShadow: darkMode === false ? undefined : "0px 0px 34px -10px #a7eefc",
            },
        }}>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                useRouter={useRouter}
                LandingBackgroundAnimation={<LandingBackgroundAnimation />}
                heroOverride={
                    <Box sx={{ position: "relative" }}>
                        {toontownMode && (
                            <Box component="img" src="/img/toontown-icon.webp" alt="Toontown"
                                sx={{
                                    position: "absolute", zIndex: 2, bottom: 0, left: "50%",
                                    transform: "translateX(-50%)", objectFit: "contain", width: "100px",
                                }}
                            />
                        )}
                        <Box component="img" src="/img/logo.png" alt="Ice Slide"
                            sx={{ width: "100%", position: "relative", zIndex: 1, m: "0 auto" }}
                        />
                    </Box>
                }
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Ice Slide/ice-slide-background.jpg`}
                multiplayerConfig={{
                    type: "WebSocket", defaultServers: 2, onlinePlayersTemplate: "2.0",
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        { label: "Players Hit", key: "score", format: (value) => `${value} m` },
                        { label: "Games Won", key: "games_won", format: (value) => `${value} m` },
                    ],
                }}
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== "true"}
            />
        </Box>
    );
}

