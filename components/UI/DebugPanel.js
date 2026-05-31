import ArticlesButton from "@/components/UI/Button";
import { useIceSlideStore } from "@/hooks/useIceSlideStore";
import { useStore } from "@/hooks/useStore";

export default function DebugPanel() {

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