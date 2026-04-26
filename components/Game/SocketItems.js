import { useIceSlideStore } from "@/hooks/useIceSlideStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import { useSearchParams } from "next/navigation"
import Barrel from "./Barrel"
import Star from "./Star"

export default function SocketItems() {

    const items = useIceSlideStore(state => state.items)
    // const socket = useSocketStore(state => state.socket)

    

    return (
        <group>
            {items?.length > 0 && items?.map((item, index) => (
                <group key={index} position={[0, 0, 0]}>
                    <Obstacle
                        position={[item?.x || 0, 1.5, item?.z || 0]}
                        type={item?.type}
                        id={item?.id}
                    />
                </group>
            ))}
        </group>
    )

}

function Obstacle({ position, type, id }) {

    const searchParams = useSearchParams()
    const { server } = Object.fromEntries(searchParams.entries())

    const socket = useSocketStore(state => state.socket)

    if (type == "Barrel") {
        return (
            <Barrel position={position} args={[2, 2, 6, 10]} />
        )
    }

    if (type == "Point" || type == "Star") {
        return (
            <Star
                position={position}
                args={[2, 2, 6, 10]}
                onCollect={() => {
                    if (id) {
                        socket.emit('game:ice-slide:collectItem', { 
                            item_id: id ,
                            server,
                        })
                    }
                }}
            />
        )
    }

}