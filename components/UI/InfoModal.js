import { useEffect, useState } from "react";

import Image from "next/image";
import dynamic from 'next/dynamic'

import { Modal } from "react-bootstrap"

import ViewUserModal from "@/components/UI/ViewUserModal"

import IsDev from "@/components/UI/IsDev";
import ArticlesButton from "./Button";

export default function GameInfoModal({
    show,
    setShow,
    credits
}) {

    const [showModal, setShowModal] = useState(true)

    return (
        <>
            <Modal
                className="articles-modal games-info-modal"
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
                    <Modal.Title>Game Info</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-column p-0">

                    <div className="ratio ratio-16x9">
                        <img src={"img/game-preview.webp"}></img>
                    </div>

                    <div className="p-3">
                        Get your tire as close to the target in the center as possible. Watch out for other players and obstacles. Collect the barrels to earn bonus points!
                    </div>

                </Modal.Body>

                <Modal.Footer className="justify-content-between">

                    <div></div>

                    <ArticlesButton variant="outline-dark" onClick={() => {
                        setShow(false)
                    }}>
                        Close
                    </ArticlesButton>

                </Modal.Footer>

            </Modal>
        </>
    )

}