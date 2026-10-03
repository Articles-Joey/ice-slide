"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";

export default function IsDev({ className, noOutline, children, inline }) {
    const userReduxState = false;
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (children && userReduxState?.roles?.isDev && isMounted) {
        return (
            <Box className={className} sx={{
                display: inline ? "inline-block" : "block",
                outline: noOutline ? undefined : "1px dashed currentColor",
            }}>
                {children}
            </Box>
        );
    }
    return null;
}

