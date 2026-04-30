"use client"
import { useEffect, useContext, useState } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// import { useSelector, useDispatch } from 'react-redux'

// import ROUTES from 'components/constants/routes'

import ArticlesButton from '@/components/UI/Button';
// import SingleInput from '@/components/Articles/SingleInput';
import { useLocalStorageNew } from '@/hooks/useLocalStorageNew';
import IsDev from '@/components/UI/IsDev';
// import { ChromePicker } from 'react-color';
import { useSocketStore } from '@/hooks/useSocketStore';

import ViewUserModal from '@articles-media/articles-dev-box/ViewUserModal';
import useUserDetails from '@articles-media/articles-dev-box/useUserDetails';
import useUserToken from '@articles-media/articles-dev-box/useUserToken';
import { useStore } from '@/hooks/useStore';

const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

const GameScoreboard = dynamic(() =>
    import('@articles-media/articles-dev-box/GameScoreboard'),
    { ssr: false }
);
const Ad = dynamic(() =>
    import('@articles-media/articles-dev-box/Ad'),
    { ssr: false }
);

const ReturnToLauncherButton = dynamic(() =>
    import('@articles-media/articles-dev-box/ReturnToLauncherButton'),
    { ssr: false }
);

const SessionButton = dynamic(() =>
    import('@articles-media/articles-dev-box/SessionButton'),
    { ssr: false }
);

const game_key = 'ice-slide'
const game_name = 'Ice Slide'
const game_port = "3023"

export default function IceSlideLobbyPage() {

    const {
        socket,
        connected
    } = useSocketStore(state => ({
        socket: state.socket,
        connected: state.connected
    }));

    const {
        data: userToken,
        error: userTokenError,
        isLoading: userTokenLoading,
        mutate: userTokenMutate
    } = useUserToken(
        game_port
    );

    const {
        data: userDetails,
        error: userDetailsError,
        isLoading: userDetailsLoading,
        mutate: userDetailsMutate
    } = useUserDetails({
        token: userToken
    });

    const nickname = useStore((state) => state.nickname);
    const setNickname = useStore((state) => state.setNickname);
    const randomNickname = useStore((state) => state.randomNickname);
    const toontownMode = useStore((state) => state.toontownMode);

    const _hasHydrated = useStore((state) => state._hasHydrated);

    const landingAnimation = useStore((state) => state.landingAnimation);

    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal);
    const setShowInfoModal = useStore((state) => state.setShowInfoModal);
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal);

    const darkMode = useStore((state) => state.darkMode);
    const toggleDarkMode = useStore((state) => state.toggleDarkMode);
    const setDarkMode = useStore((state) => state.setDarkMode);

    const lobbyDetails = useStore((state) => state.lobbyDetails);

    useEffect(() => {

        if (connected) {
            socket.emit('join-room', `game:${game_key}-landing`);
        }

        return function cleanup() {
            socket?.emit('leave-room', `game:${game_key}-landing`);
        };

    }, [connected]);

    return (

        <div className="ice-slide-landing-page">

            <div className='background-wrap'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_CDN}games/Ice Slide/ice-slide-background.jpg`}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center', filter: 'blur(10px)' }}
                />
            </div>

            <div className="container d-flex flex-column-reverse flex-lg-row justify-content-center align-items-center py-3">

                <div style={{ "width": "20rem" }}>

                    <div className='position-relative'>
                        {toontownMode &&
                            <img
                                width={'100%'}
                                src={"img/toontown-icon.webp"}
                                alt="Logo"
                                style={{
                                    position: 'absolute',
                                    // position: 'relative',
                                    zIndex: 2,
                                    bottom: 0,
                                    // top: -75,
                                    left: "50%",
                                    transform: 'translateX(-50%)',
                                    objectFit: 'contain',
                                    width: '100px',
                                    // margin: "0 auto"
                                }}
                            ></img>
                        }
                        <img
                            width={'100%'}
                            src={"img/logo.png"}
                            alt="Logo"
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                margin: "0 auto"
                            }}
                        ></img>
                    </div>

                    <div
                        className="card card-articles card-sm mb-3"

                    >

                        {/* <div style={{ position: 'relative', height: '200px' }}>
                            <Image
                                src={Logo}
                                alt=""
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div> */}

                        <div className='card-header d-flex align-items-center'>

                            <div className="flex-grow-1">

                                <div className="form-group articles mb-0">
                                    <label htmlFor="nickname">Nickname</label>
                                    {/* <SingleInput
                                        value={nickname}
                                        setValue={setNickname}
                                        noMargin
                                    /> */}
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="text"
                                            value={_hasHydrated ? nickname : ''}
                                            disabled={!_hasHydrated}
                                            id="nickname"
                                            name="nickname"
                                            placeholder="Enter your nickname"
                                            onChange={(e) => {
                                                setNickname(e.target.value)
                                            }}
                                            className={`form-control form-control-sm`}
                                        />
                                        <ArticlesButton
                                            small
                                            className=""
                                            onClick={() => {
                                                randomNickname()
                                            }}
                                        >
                                            <i className="fad fa-random"></i>
                                        </ArticlesButton>
                                    </div>
                                </div>

                                <div className='mt-1' style={{ fontSize: '0.8rem' }}>Visible to all players</div>

                            </div>
                        </div>

                        <div className="card-body">

                            <div className="fw-bold mb-1 small text-center">
                                {lobbyDetails.players.length || 0} player{lobbyDetails.players.length > 1 && 's'} in the lobby.
                            </div>

                            {/* <div className='small fw-bold'>Public Servers</div> */}

                            <div className="servers">

                                {[
                                    ...Array.from({ length: 2 }, (_, i) => i + 1)
                                    // 1, 
                                    // 2, 
                                    // 3, 
                                    // 4
                                ].map(id => {

                                    let lobbyLookup = lobbyDetails?.globalGameState?.games?.find(lobby =>
                                        parseInt(lobby.server_id) == id
                                    )

                                    return (
                                        <div key={id} className="server">

                                            <div className='d-flex justify-content-between align-items-center w-100 mb-2'>
                                                <div className="mb-0" style={{ fontSize: '0.9rem' }}><b>Server {id}</b></div>
                                                <div className='mb-0'>{lobbyLookup?.players?.length || 0}/4</div>
                                            </div>

                                            <div className='d-flex justify-content-around w-100 mb-1'>
                                                {[1, 2, 3, 4].map(player_count => {

                                                    let playerLookup = false

                                                    if (lobbyLookup?.players?.length >= player_count) playerLookup = true

                                                    return (
                                                        <div key={player_count} className="icon" style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            ...(playerLookup ? {
                                                                backgroundColor: 'black',
                                                            } : {
                                                                backgroundColor: 'gray',
                                                            }),
                                                            border: '1px solid black'
                                                        }}>

                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <Link
                                                className={``}
                                                href={{
                                                    pathname: `/play`,
                                                    query: {
                                                        server: id
                                                    }
                                                }}
                                            >
                                                <ArticlesButton
                                                    className="px-5"
                                                    small
                                                    disabled={!connected}
                                                >
                                                    Join
                                                </ArticlesButton>
                                            </Link>

                                        </div>
                                    )
                                })}

                            </div>

                            {/* <div className='small fw-bold  mt-3 mb-1'>Or</div> */}

                            {/* <div className='d-flex'>
    
                                <ArticlesButton
                                    className={`w-50`}
                                    onClick={() => {
                                        // TODO
                                        alert("Coming Soon!")
                                    }}
                                >
                                    <i className="fad fa-robot"></i>
                                    Practice
                                </ArticlesButton>
    
                                <ArticlesButton
                                    className={`w-50`}
                                    onClick={() => {
                                        setShowPrivateGameModal(prev => !prev)
                                    }}
                                >
                                    <i className="fad fa-lock"></i>
                                    Private Game
                                </ArticlesButton>
    
                            </div> */}

                            <IsDev className={'mt-3'}>
                                <div>
                                    <ArticlesButton
                                        className="w-50"
                                        variant='warning'
                                        onClick={() => {
                                            socket.emit('game:four-frogs:reset', '');
                                        }}
                                    >
                                        Reset Server
                                    </ArticlesButton>
                                </div>
                            </IsDev>

                        </div>

                        <div className="card-footer d-flex flex-wrap justify-content-center">

                            <div className='d-flex w-50'>
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
                                        setDarkMode(!darkMode);
                                    }}
                                >
                                    <i className="fad fa-palette"></i>
                                </ArticlesButton>
                            </div>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowInfoModal(true)
                                }}
                            >
                                <i className="fad fa-info-square"></i>
                                Info
                            </ArticlesButton>

                            <a
                                href={'https://github.com/Articles-Joey/ice-slide'}
                                className='w-50'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <ArticlesButton
                                    className={`w-100`}
                                    small
                                    onClick={() => {

                                    }}
                                >
                                    <i className="fab fa-github"></i>
                                    GitHub
                                </ArticlesButton>
                            </a>

                            <ArticlesButton
                                className={`w-50`}
                                small
                                onClick={() => {
                                    setShowCreditsModal(true)
                                }}
                            >
                                <i className="fad fa-users"></i>
                                Credits
                            </ArticlesButton>

                        </div>

                    </div>

                    {/* <div>This: {userDetails}</div> */}

                    <SessionButton
                        port={game_port}
                    />

                    <ReturnToLauncherButton />

                </div>

                <GameScoreboard
                    game={game_name}
                    style="Default"
                    darkMode={darkMode ? true : false}
                />

                <Ad
                    style="Default"
                    section={"Games"}
                    section_id={game_name}
                    darkMode={darkMode ? true : false}
                    user_ad_token={userToken}
                    userDetails={userDetails}
                    userDetailsLoading={userDetailsLoading}
                />

            </div>

        </div>
    );
}