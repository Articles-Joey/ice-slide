// import { Suspense } from "react"
// import GamePage from "./play"
// import metadataAppend from "util/metadataAppend"

import ArticlesButton from "@/components/UI/Button"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
    title: `Ice Slide`,
    description: "Page not found"
}

export default function Page() {
    return (
        <div className="not-found-page">

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

                    <div
                        className="card card-articles card-sm mb-3"

                    >

                        <div className="card-body">

                            Page not found. Please check the URL and try again.

                        </div>

                    </div>

                    <div className="d-flex justify-content-center">
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <ArticlesButton>
                                Return to Home
                            </ArticlesButton>
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    )
}