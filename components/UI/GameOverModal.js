import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";
import Link from "next/link";

export default function GameOverModal({
    show,
    setShow,
}) {

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

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Play Again
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}