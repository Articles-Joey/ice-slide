"use client";

import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { useEffect } from "react";

export default function LayoutClient({

}) {

    const theme = useIceSlideStore(state => state.theme);

    useEffect(() => {
        // document.body.className = theme === 'Dark' ? 'dark-theme' : 'light-theme';
        document.body.setAttribute('data-bs-theme', theme === 'Dark' ? 'dark' : 'light');
    }, [theme]);

    return (
        <>

        </>
    );
}
