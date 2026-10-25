"use client";
import { useEffect } from "react";
import { useGameControls } from "@/hooks/useGameControls";
import { useSearchParams } from "next/navigation";

export default function ControlsHandler({ actions: localActions } = {}) {
    const searchParams = useSearchParams();
    const { server } = Object.fromEntries(searchParams.entries());

    const multiplayerActions = useGameControls({ server });
    const actions = localActions || multiplayerActions;

    useEffect(() => {
        const heldKeys = new Set();
        let rafId = null;

        const keyActions = {
            arrowright: actions.rotateRight,
            d: actions.rotateRight,
            arrowleft: actions.rotateLeft,
            a: actions.rotateLeft,
            arrowup: actions.powerUp,
            w: actions.powerUp,
            arrowdown: actions.powerDown,
            s: actions.powerDown,
        };

        const loop = () => {
            if (heldKeys.size === 0) {
                rafId = null;
                return;
            }
            heldKeys.forEach((key) => keyActions[key]?.());
            rafId = requestAnimationFrame(loop);
        };

        const onKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (localActions) {
                if (
                    e.target.isContentEditable ||
                    e.target.closest?.(
                        "input, textarea, select, [role='slider']",
                    )
                )
                    return;
                if (
                    (key === "enter" || key === " ") &&
                    e.target.closest?.("button")
                )
                    return;
            }
            if (key === "enter" || key === " ") {
                if (localActions) {
                    e.preventDefault();
                    if (e.repeat) return;
                }
                actions.launch();
                return;
            }
            if (key in keyActions) {
                e.preventDefault();
                heldKeys.add(key);
                if (!rafId) rafId = requestAnimationFrame(loop);
            }
        };

        const onKeyUp = (e) => {
            heldKeys.delete(e.key.toLowerCase());
        };

        const onBlur = () => {
            heldKeys.clear();
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", onBlur);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", onBlur);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [actions, localActions]);

    return <></>;
}
