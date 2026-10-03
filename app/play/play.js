"use client"
import { useEffect } from 'react';
import Box from '@mui/material/Box';

import { useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic'

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';
import TouchControls from '@/components/UI/TouchControls';
import GameOverModal from '@/components/UI/GameOverModal';

import GameMenu from '@articles-media/articles-dev-box/GameMenu';
import classNames from 'classnames';
import { useGameStore } from '@/hooks/useGameStore';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_key = process.env.NEXT_PUBLIC_GAME_KEY

export default function IceSlideGamePage() {

    const socket = useSocketStore(state => state.socket);

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const nickname = useStore(state => state.nickname)
    const sidebar = useStore(state => state.sidebar);
    const sceneKey = useStore(state => state.sceneKey)
    const showMenu = useStore(state => state.showMenu);

    // const showGameOverModal = useStore(state => state.showGameOverModal)
    const status = useGameStore(state => state.gameState.status)

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

    const { isFullscreen } = useFullscreen();

    return (

        <Box
            sx={{ position: 'relative', display: 'flex' }}
            className={classNames(
                `${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`,
                {
                    'menu-open': showMenu,
                    'fullscreen': isFullscreen,
                    'show-sidebar': sidebar,
                }
            )}
            id={`${process.env.NEXT_PUBLIC_GAME_KEY}-game-page`}
        >

            {status === 'Game Over' &&
                <GameOverModal
                    show={true}
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

            <Box className='canvas-wrap' sx={{
                position: 'relative', width: '100vw', height: '100vh',
                '& canvas': { position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 },
            }}>

                <TouchControls />

                <GameCanvas
                    key={sceneKey}
                />

            </Box>

        </Box>
    );
}
