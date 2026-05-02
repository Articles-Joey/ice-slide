"use client"
import { useEffect } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import dynamic from 'next/dynamic'

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import TouchControls from '@/components/UI/TouchControls';
import GameOverModal from '@/components/UI/GameOverModal';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_name = 'Ice Slide'
const game_key = 'ice-slide'

export default function IceSlideGamePage() {

    const {
        socket
    } = useSocketStore(state => ({
        socket: state.socket
    }));

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const nickname = useStore(state => state.nickname)
    const sidebar = useStore(state => state.sidebar);
    const sceneKey = useStore(state => state.sceneKey)

    const showGameOverModal = useStore(state => state.showGameOverModal)

    useEffect(() => {

        if (server && socket.connected) {
            const roomName = `game:${game_key}-room-${server}`;
            socket.emit('join-room', roomName, {
                game_id: server,
                nickname: nickname,
                client_version: '1',

            });

            return function cleanup() {
                socket.emit('leave-room', roomName)
            };
        }

    }, [server, socket.connected, nickname]);

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    return (

        <div
            className={`ice-slide-game-page ${isFullscreen && 'fullscreen'} ${sidebar && 'show-sidebar'}`}
            id="ice-slide-game-page"
        >

            {showGameOverModal &&
                <GameOverModal
                    show={showGameOverModal}
                    setShow={useStore.getState().setShowGameOverModal}
                />
            }

            <GameMenu
                useStore={useStore}
                LeftPanelContent={LeftPanelContent}
                menuBarConfig={{
                    style: "Bar",
                    menuBarButtonPosition: "Left"
                }}
                sidebarConfig={{
                    style: "Floating Panel",
                }}
            />

            <div className='canvas-wrap'>

                <TouchControls />

                <GameCanvas
                    key={sceneKey}
                />

            </div>

        </div>
    );
}