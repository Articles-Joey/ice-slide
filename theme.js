"use client";

import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { bootstrapCompatibilityTheme } from "@articles-media/articles-dev-box/bootstrapCompatibilityTheme";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export function createAppTheme(mode = "dark") {

    const cardBackground = mode === "dark" ? "#013d67" : "#0073c3";

    return createTheme({
        cssVariables: true,
        palette: {
            mode,
            primary: { main: "#f9edcd" },
            background: { 
                default: cardBackground, 
                paper: cardBackground 
            },
            text: { primary: "#fff", secondary: "rgba(255,255,255,0.7)" },
            game: { card: cardBackground },
        },
        typography: { fontFamily: roboto.style.fontFamily },
        components: {
            MuiButton: {
                styleOverrides: { root: { fontSize: "0.75rem" } },
            },
            MuiAlert: {
                styleOverrides: {
                    root: {
                        variants: [{
                            props: { severity: "info" },
                            style: { backgroundColor: "#60a5fa" },
                        }],
                    },
                },
            },
            MuiCssBaseline: {
                // Dev-box still uses these compatibility utilities internally.
                styleOverrides: (muiTheme) => {
                    const compatibility = bootstrapCompatibilityTheme.MuiCssBaseline.styleOverrides(muiTheme);
                    return {
                        ...compatibility,
                        ":root": {
                            ...compatibility[":root"],
                            "--card-background-override": cardBackground,
                            "--articles-card-font-color": "#fff",
                            "--articles-button-background-color": "#0977c6",
                            "--articles-button-color": "#fff",
                        },
                        ".stats-overlay": {
                            position: "fixed",
                            top: 0,
                            right: "0 !important",
                            left: "initial !important",
                            zIndex: 4,
                        },
                    };
                },
            },
        },
    });
}

export default createAppTheme();
