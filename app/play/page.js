import { Suspense } from "react"
import GamePage from "./play"
// import metadataAppend from "util/metadataAppend"

export const metadata = {
    title: `Ice Slide`,
}

export default function Page() {
    return (
        <Suspense><GamePage /></Suspense>
    )
}