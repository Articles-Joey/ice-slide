"use client";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from '@/hooks/useStore';
import { useGameStore } from '@/hooks/useGameStore';
import { useIceSlideStore } from '@/hooks/useIceSlideStore';

import ReusedSocketLogicHandler from '@articles-media/articles-dev-box/ReusedSocketLogicHandler';

export default function SocketLogicHandler(props) {
    const _hasHydrated = useStore((state) => state._hasHydrated);

    // const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const lastLogTime = useRef(0);
    const lastLaunchTime = useRef(0);
    const lastGameStarted = useRef(null);

    if (!_hasHydrated) return null;

    return <>
        <ReusedSocketLogicHandler
            pathname={pathname}
            useStore={useStore}
            useGameStore={useGameStore}
            useSocketStore={useSocketStore}
            debugConfig={{
                enabled: true,
                // autoHide: true,
                autoHideDelay: 5000,
            }}
            landingConfig={{
                handleLandingDetails: true,
                onLandingDetails: (data) => {
                    console.log("[SocketLogicHandler] onLandingDetails", data)
                }
            }}
            gameConfig={{
                handleGameUpdates: true,
                onGameUpdate: (data) => {

                    const gameState = data?.gameState || data;
                    if (gameState?.gameStarted !== lastGameStarted.current) {
                        useIceSlideStore.getState().setLaunchPlayers(false);
                        lastLaunchTime.current = 0;
                        lastGameStarted.current = gameState?.gameStarted;
                    }

                    const lastLaunchStr = gameState?.status === "In Progress" && gameState?.lastLaunch;
                    if (lastLaunchStr) {
                        const lastLaunchTimeMs = new Date(lastLaunchStr).getTime();
                        
                        if (!isNaN(lastLaunchTimeMs) && lastLaunchTimeMs > lastLaunchTime.current) {
                            console.log("[SocketLogicHandler] Detected new launch event", { 
                                lastLaunchStr, 
                                lastLaunchTimeMs, 
                                previous: lastLaunchTime.current 
                            });

                            const setLaunchPlayers = useIceSlideStore.getState().setLaunchPlayers;
                            // Set to the timestamp instead of just true/false to ensure uniqueness
                            setLaunchPlayers(lastLaunchTimeMs);
                            lastLaunchTime.current = lastLaunchTimeMs;
                        }
                    }

                    const now = Date.now();

                    if (now - lastLogTime.current >= 1000) {
                        console.log("[SocketLogicHandler] onGameUpdate (throttled)", data);
                        lastLogTime.current = now;
                    }
                    
                }
            }}
            server={server}
        />
    </>
}
