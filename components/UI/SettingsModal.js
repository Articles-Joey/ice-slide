"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ArticlesButton from "./Button";
import ArticlesModal from "./ArticlesModal";

export default function IceSlideSettingsModal({ show, setShow }) {
    const [tab, setTab] = useState("Controls");

    return (
        <ArticlesModal show={show} setShow={setShow} title="Game Settings" centered={false} sx={{ p: 0 }}
            footerOverride={(setOpen) => (
                <Box sx={{ display: "flex", gap: 2 }}>
                    <ArticlesButton variant="outline-dark" onClick={() => setOpen(false)}>Close</ArticlesButton>
                    <ArticlesButton variant="outline-danger" onClick={() => setOpen(false)}>Reset</ArticlesButton>
                </Box>
            )}
        >
            <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Settings categories">
                {["Controls", "Audio", "Chat"].map((item) => <Tab key={item} label={item} value={item} />)}
            </Tabs>
            <Divider />
            <Box role="tabpanel" sx={{ p: 1 }}>
                {tab === "Controls" && (
                    <Box>
                        {[
                            { action: "Rotate Left", defaultKeyboardKey: "A" },
                            { action: "Rotate Right", defaultKeyboardKey: "D" },
                            { action: "Launch", defaultKeyboardKey: "Space" },
                        ].map((control) => (
                            <Box key={control.action} sx={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                borderBottom: 1, borderColor: "divider", pb: 0.5, mb: 0.5,
                            }}>
                                <Box>{control.action}</Box>
                                <Box>
                                    <Chip label={control.defaultKeyboardKey} size="small" sx={{ mr: 0.5 }} />
                                    <ArticlesButton small>Change Key</ArticlesButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                {tab === "Audio" && (
                    <>
                        <Typography id="game-volume-label">Game Volume</Typography>
                        <Slider aria-labelledby="game-volume-label" defaultValue={50} min={0} max={100} />
                        <Typography id="music-volume-label">Music Volume</Typography>
                        <Slider aria-labelledby="music-volume-label" defaultValue={50} min={0} max={100} />
                    </>
                )}
                {tab === "Chat" && (
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <FormControlLabel control={<Switch />} label="Game chat panel" />
                        <FormControlLabel control={<Switch />} label="Censor chat" />
                        <FormControlLabel control={<Switch />} label="Game chat speech bubbles" />
                    </Box>
                )}
            </Box>
        </ArticlesModal>
    );
}

