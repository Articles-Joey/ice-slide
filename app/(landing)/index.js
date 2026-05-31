"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { useSocketStore } from '@/hooks/useSocketStore';
import { useStore } from '@/hooks/useStore';

import PageTemplateLandingPage from '@articles-media/articles-dev-box/PageTemplateLandingPage';
import RotatingMascot from '@/components/UI/RotatingMascot';

const LandingBackgroundAnimation = dynamic(() => import('@/components/Game/LandingBackgroundAnimation'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default function IceSlideLobbyPage() {

    const toontownMode = useStore((state) => state.toontownMode);

    return (
        <>
            <PageTemplateLandingPage
                useSocketStore={useSocketStore}
                useStore={useStore}
                RotatingMascot={RotatingMascot}
                Link={Link}
                // logoImage={logo.src}
                LandingBackgroundAnimation={
                    <LandingBackgroundAnimation />
                }
                // CardBodyOverride={<>
                // </>}
                heroOverride={<>
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
                </>}
                // disableHero                
                backgroundImage={`${process.env.NEXT_PUBLIC_CDN}games/Ice Slide/ice-slide-background.jpg`}
                CardBodyPrependContent={<>
                    {/* <div className='mb-2 border-bottom pb-2'>
                        <Link href={"/play?local_play=true"} className="w-100">
                            <ArticlesButton
                                className="w-100"
                            >
                                <i className='fas fa-gamepad-alt fa-lg me-2'></i>
                                Local Play
                                <span className='ms-2 badge bg-dark' style={{ scale: '1.1' }}>Works offline!</span>
                            </ArticlesButton>
                        </Link>
                        <div className='small text-center'>Play with 2 to 4 gamepads locally.</div>
                        <ConnectedControllersPreview />
                    </div> */}
                </>}
                // singlePlayerConfig={{

                // }}
                NicknameInputConfig={{
                    // PreComponent: <div className='flex-shrink-0 me-2'></div>
                }}
                multiplayerConfig={{
                    type: "WebSocket",
                    // comingSoon: true,
                    defaultServers: 2,
                    // privateServerSupport: false,
                    onlinePlayersTemplate: "2.0"
                }}
                gameScoreboardConfig={{
                    append_score_text: "m",
                    metrics: [
                        {
                            label: 'Players Hit',
                            key: "score",
                            format: (value) => `${value} m`
                        },
                        {
                            label: 'Games Won',
                            key: "games_won",
                            format: (value) => `${value} m`
                        }
                    ]
                }}
                // brandingTextClass="jaro-primary"
                disableGameScoreboard={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
                disableAd={process.env.NEXT_PUBLIC_ENABLE_ARTICLES !== 'true'}
            />
        </>
    );
}