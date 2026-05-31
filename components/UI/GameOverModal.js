import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocketStore } from "@/hooks/useSocketStore";

export default function GameOverModal({
    show,
    setShow,
}) {

    const socket = useSocketStore(state => state.socket)
    const setGameState = useGameStore(state => state.setGameState)

    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams.entries());
    const { server, local_play } = params

    const [showModal, setShowModal] = useState(true)

    return (
        <>
            <Modal
                className="articles-modal games-over-modal"
                size='md'
                show={showModal}
                centered
                scrollable
                onExited={() => {
                    setShow(false)
                }}
                onHide={() => {
                    setShowModal(false)
                }}
            >

                <Modal.Header closeButton>
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className="p-3">

                        <div className="mb-3">The winner was <b>{show?.winner?.nickname || "Unknown"}</b> with a distance of <b>{show?.winner?.distance?.toFixed(2) || 0}</b> meters!</div>

                        <div className="mb-2">Here is how everyone else did:</div>

                        {show?.rankings?.map((player, index) => (
                            <div key={index}>
                                <b>{player.nickname || "Unknown"}</b>: {player.distance?.toFixed(2) || 0} meters
                            </div>
                        ))}

                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <Link href="/">
                        <ArticlesButton variant="outline-dark" onClick={() => {
                            setShow(false)
                        }}>
                            Close
                        </ArticlesButton>
                    </Link>

                    <ArticlesButton
                        variant="outline-dark"
                        onClick={() => {

                            if (server) {
                                socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:start-game`, {
                                    server_id: server,
                                    status: "In Lobby"
                                })
                            }

                            if (local_play === "true") {
                                setGameState({
                                    ...useGameStore.getState().gameState,
                                    status: "In Lobby",
                                    timer: 0,
                                    positions: Array.from({ length: 23 }, (player_obj, player_i) => {
                                        return {
                                            player_index: player_i,
                                            x: 0,
                                            y: (player_i * 3),
                                            newX: generateRandomInteger(
                                                5,
                                                10
                                            ),
                                        };
                                    })
                                })
                            }

                        }}
                    >
                        Play Again
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}