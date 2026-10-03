"use client";

import DevBoxGlobalClientModals from "@articles-media/articles-dev-box/GlobalClientModals";
import packageInfo from "@/package.json";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import { useStore } from "@/hooks/useStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";

export default function GlobalClientModals(props) {
    return (
        <DevBoxGlobalClientModals
            useStore={useStore}
            useAudioStore={useAudioStore}
            useSocketStore={useSocketStore}
            useTouchControlsStore={useTouchControlsStore}
            packageInfo={packageInfo}
            settingsModalConfig={{
                tabs: {
                    Graphics: { darkMode: true, landingAnimation: true },
                    Audio: {
                        sliders: Object.keys(useAudioStore.getState().audioSettings)
                            .filter((key) => key !== "enabled")
                            .map((key) => ({ key, label: key.replace(/([A-Z])/g, " $1") })),
                    },
                    Controls: { touchControls: true },
                    Multiplayer: { serverUrl: true },
                    Other: { toontownMode: true },
                },
            }}
            infoModalConfig={{ previewImage: "/img/game-preview.webp" }}
            {...props}
        />
    );
}

