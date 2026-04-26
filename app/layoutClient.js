"use client";
import { useStore } from "@/hooks/useStore";
import DarkModeHandler from "@articles-media/articles-dev-box/DarkModeHandler";
import GlobalBody from '@articles-media/articles-dev-box/GlobalBody';
import ToontownModeHandler from '@articles-media/articles-dev-box/ToontownModeHandler';

export default function LayoutClient({

}) {

    return (
        <>
            <ToontownModeHandler 
                useStore={useStore}
            />
            {/* <SocketServerUrlHandler
                useStore={useStore}
            /> */}
            <GlobalBody />
            <DarkModeHandler
                useStore={useStore}
            />
        </>
    );
}
