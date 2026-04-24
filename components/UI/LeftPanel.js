import Link from "next/link";

// import ROUTES from '@/components/constants/routes';
// import { useGameStore } from "../hooks/useGameStore";
import ArticlesButton from "@/components/UI/Button";

// import ControllerPreview from "../../ControllerPreview";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useStore } from "@/hooks/useStore";
import { useSearchParams } from "next/navigation";
import GameDetailsPanel from "./GameDetailsPanel";

export default function LeftPanelContent(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    // const theme = useIceSlideStore(state => state.theme);
    // const toggleTheme = useIceSlideStore(state => state.toggleTheme);
    // const hitRotation = useIceSlideStore(state => state.hitRotation);
    // const setHitRotation = useIceSlideStore(state => state.setHitRotation);
    // const hitPower = useIceSlideStore(state => state.hitPower);
    // const setHitPower = useIceSlideStore(state => state.setHitPower);

    const debug = useStore(state => state.debug);
    const sidebar = useStore(state => state.sidebar);
    const toggleSidebar = useStore(state => state.toggleSidebar);
    const toggleDarkMode = useStore(state => state.toggleDarkMode);
    const setShowSettingsModal = useStore(state => state.setShowSettingsModal);

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className='flex-header'>
                        <div>Server: {server}</div>
                        <div>Players: {0}/4</div>
                    </div>

                    {!socket?.connected &&
                        <div
                            className="mb-3"
                        >

                            <div className="">

                                <div className="h6 mb-1">Not connected</div>

                                <ArticlesButton
                                    onClick={() => {
                                        console.log("Reconnect")
                                        socket.connect()
                                    }}
                                    className="w-100"
                                >
                                    Reconnect!
                                </ArticlesButton>

                            </div>

                        </div>
                    }

                    <div className="d-flex flex-wrap">

                        <Link
                            href={'/'}
                            className="w-50"
                        >
                            <ArticlesButton
                                className='w-100'
                                small
                            >
                                <i className="fad fa-arrow-alt-square-left"></i>
                                <span>Leave Game</span>
                            </ArticlesButton>
                        </Link>

                        <ArticlesButton
                            small
                            className="w-50"
                            active={isFullscreen}
                            onClick={() => {
                                if (isFullscreen) {
                                    exitFullscreen()
                                } else {
                                    requestFullscreen()
                                }
                            }}
                        >
                            {isFullscreen && <span>Exit </span>}
                            {!isFullscreen && <span><i className='fad fa-expand'></i></span>}
                            <span>Fullscreen</span>
                        </ArticlesButton>

                        <div className="d-flex w-50">
                            <ArticlesButton
                                className={`w-100`}
                                small
                                onClick={() => {
                                    setShowSettingsModal(true)
                                }}
                            >
                                <i className="fad fa-cog"></i>
                                Settings
                            </ArticlesButton>
                            <ArticlesButton
                                className={``}
                                small
                                onClick={() => {
                                    toggleDarkMode()
                                }}
                            >
                                <i className="fad fa-moon"></i>
                                {/* Dark Mode */}
                            </ArticlesButton>
                        </div>

                        <ArticlesButton
                            small
                            className='w-50'
                            active={sidebar}
                            onClick={() => {
                                toggleSidebar()
                            }}
                        >
                            <i className="fad fa-cog"></i>
                            <span>Sidebar</span>
                        </ArticlesButton>

                    </div>

                </div>
            </div>

            {/* <div
                className="card card-articles card-sm"
            >
                <div className="card-body d-flex justify-content-between">

                    <div>
                        <div className="small text-muted">playerData</div>
                        <div className="small">
                            <div>X: {playerLocation?.x}</div>
                            <div>Y: {playerLocation?.y}</div>
                            <div>Z: {playerLocation?.z}</div>
                            <div>Shift: {shift ? 'True' : 'False'}</div>
                            <div>Score: 0</div>
                        </div>
                    </div>

                    <div>
                        <div className="small text-muted">maxHeight</div>
                        <div>Y: {maxHeight}</div>
                        <ArticlesButton
                            small
                            onClick={() => {
                                setMaxHeight(playerLocation?.y)
                            }}
                        >
                            Reset
                        </ArticlesButton>
                    </div>

                </div>
            </div> */}

            {/* Touch Controls */}
            {/* <div
                className="card card-articles card-sm"
            >
                <div className="card-body">

                    <div className="small text-muted">Touch Controls</div>

                    <div className='d-flex flex-column'>

                        <div>
                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={!touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(false)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                Off
                            </ArticlesButton>

                            <ArticlesButton
                                size="sm"
                                className="w-50"
                                active={touchControlsEnabled}
                                onClick={() => {
                                    setTouchControlsEnabled(true)
                                }}
                            >
                                <i className="fad fa-redo"></i>
                                On
                            </ArticlesButton>
                        </div>

                    </div>

                </div>
            </div> */}

            <GameDetailsPanel />

            {/* Debug Controls */}
            {debug &&
                <DebugPanel />
            }

            {/* {controllerState?.connected &&
                <div className="panel-content-group p-0 text-dark">

                    <div className="p-1 border-bottom border-dark">
                        <div className="fw-bold" style={{ fontSize: '0.7rem' }}>
                            {controllerState?.id}
                        </div>
                    </div>

                    <div className='p-1'>
                        <ArticlesButton
                            small
                            className="w-100"
                            active={showControllerState}
                            onClick={() => {
                                setShowControllerState(prev => !prev)
                            }}
                        >
                            {showControllerState ? 'Hide' : 'Show'} Controller Preview
                        </ArticlesButton>
                    </div>

                </div>
            } */}

        </div>
    )

}

function DebugPanel() {

    const hitRotation = useIceSlideStore(state => state.hitRotation);
    const hitPower = useIceSlideStore(state => state.hitPower);

    const incSceneKey = useStore(state => state.incSceneKey);

    return (
        <div
            className="card card-articles card-sm"
        >
            <div className="card-body">

                <div className="small">Debug Controls</div>

                <div className="small border p-2">
                    <div>Rotation Angle: {hitRotation}</div>
                    <div>Power: {hitPower}/100</div>
                </div>

                <div className='d-flex flex-column'>

                    <div>
                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => {
                                incSceneKey()
                            }}
                        >
                            <i className="fad fa-redo"></i>
                            Reload Game
                        </ArticlesButton>

                        <ArticlesButton
                            size="sm"
                            className="w-50"
                            onClick={() => {
                                incSceneKey()
                            }}
                        >
                            <i className="fad fa-redo"></i>
                            Reset Camera
                        </ArticlesButton>
                    </div>

                </div>

            </div>
        </div>
    )

}