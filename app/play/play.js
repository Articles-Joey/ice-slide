"use client"
import { useEffect, useContext, useState, useRef, useMemo } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import dynamic from 'next/dynamic'

import ArticlesButton from '@/components/UI/Button';

import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useControllerStore } from '@/hooks/useControllerStore';

import LeftPanelContent from '@/components/UI/LeftPanel';
import { useSocketStore } from '@/hooks/useSocketStore';
// import { useIceSlideStore } from '@/hooks/useIceSlideStore';
// import { useHotkeys } from 'react-hotkeys-hook';
import ControlsHandler from '@/components/Game/ControlsHandler';
import { useStore } from '@/hooks/useStore';

const GameCanvas = dynamic(() => import('@/components/Game/GameCanvas'), {
    ssr: false,
});

const game_key = 'ice-slide'
const game_name = 'Ice Slide'

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

    // const { controllerState, setControllerState } = useControllerStore()
    // const [showControllerState, setShowControllerState] = useState(false)

    const nickname = useStore(state => state.nickname)

    const sceneKey = useStore(state => state.sceneKey)
    const showMenu = useStore(state => state.showMenu)
    const setShowMenu = useStore(state => state.setShowMenu)

    // const [ cameraMode, setCameraMode ] = useState('Player')

    // const [players, setPlayers] = useState([])

    useEffect(() => {

        if (server && socket.connected) {
            socket.emit('join-room', `game:${game_key}-room-${server}`, {
                game_id: server,
                nickname: nickname,
                client_version: '1',

            });
        }

        // return function cleanup() {
        //     socket.emit('leave-room', 'game:glass-ceiling-landing')
        // };

    }, [server, socket.connected]);

    // const [showMenu, setShowMenu] = useState(false)

    // const [touchControlsEnabled, setTouchControlsEnabled] = useLocalStorageNew("game:touchControlsEnabled", false)

    // const [sceneKey, setSceneKey] = useState(0);

    // const [gameState, setGameState] = useState(false)

    // Function to handle scene reload
    // const reloadScene = () => {
    //     setSceneKey((prevKey) => prevKey + 1);
    // };

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // let panelProps = {
    //     server,
    //     players,
    //     touchControlsEnabled,
    //     setTouchControlsEnabled,
    //     reloadScene,
    //     // controllerState,
    //     // isFullscreen,
    //     // requestFullscreen,
    //     // exitFullscreen,
    //     setShowMenu
    // }

    const game_name = 'Ice Slide'
    const game_key = 'ice-slide'

    return (

        <div
            className={`ice-slide-game-page ${isFullscreen && 'fullscreen'}`}
            id="ice-slide-game-page"
        >

            <ControlsHandler />

            <div className="menu-bar card card-articles p-1 justify-content-center">

                <div className='flex-header align-items-center'>

                    <ArticlesButton
                        small
                        active={showMenu}
                        onClick={() => {
                            setShowMenu(prev => !prev)
                        }}
                    >
                        <i className="fad fa-bars"></i>
                        <span>Menu</span>
                    </ArticlesButton>

                    <div>
                        {/* Y: {(playerLocation?.y || 0)} */}
                    </div>

                </div>

            </div>

            <div className={`mobile-menu ${showMenu && 'show'}`}>
                <LeftPanelContent />
            </div>

            {/* <TouchControls
                touchControlsEnabled={touchControlsEnabled}
            /> */}

            <div className='panel-left card rounded-0 d-none d-lg-flex'>
                <LeftPanelContent />
            </div>

            {/* <div className='game-info'>
                <div className="card card-articles card-sm">
                    <div className="card-body">
                        <pre> 
                            {JSON.stringify(playerData, undefined, 2)}
                        </pre>
                    </div>
                </div>
            </div> */}

            <div className='canvas-wrap'>

                <GameCanvas
                    key={sceneKey}
                    // gameState={gameState}
                    // playerData={playerData}
                    // setPlayerData={setPlayerData}
                    // players={players}
                />

            </div>

        </div>
    );
}