import Link from "next/link";

import ArticlesButton from "@/components/UI/Button";

import { useSocketStore } from "@/hooks/useSocketStore";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import useFullscreen from '@articles-media/articles-dev-box/useFullscreen';
import { useStore } from "@/hooks/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import GameDetailsPanel from "./GameDetailsPanel";
import GameMenuPrimaryButtonGroup from '@articles-media/articles-dev-box/GameMenuPrimaryButtonGroup';
import DebugPanel from "./DebugPanel";

export default function LeftPanelContent(props) {

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server } = params

    const { isFullscreen, requestFullscreen, exitFullscreen } = useFullscreen();

    const debug = useStore(state => state.debug);

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    return (
        <div className='w-100'>

            <div className="card card-articles card-sm">

                <div className="card-body">

                    <div className="d-flex flex-wrap mb-3">

                        <GameMenuPrimaryButtonGroup
                            useStore={useStore}
                            type="GameMenu"
                            useRouter={useRouter}
                        />

                    </div>

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

                </div>
            </div>

            <GameDetailsPanel />

            {/* Debug Controls */}
            {debug &&
                <DebugPanel />
            }

        </div>
    )

}