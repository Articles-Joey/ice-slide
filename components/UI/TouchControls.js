import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useGameControls, useHeldAction } from "@/hooks/useGameControls";
import ArticlesButton from "./Button";

export default function TouchControls({ server }) {

    const enabled = useTouchControlsStore(state => state.enabled);
    const actions = useGameControls({ server });

    const leftProps      = useHeldAction(actions.rotateLeft);
    const rightProps     = useHeldAction(actions.rotateRight);
    const powerUpProps   = useHeldAction(actions.powerUp);
    const powerDownProps = useHeldAction(actions.powerDown);

    const touchStyle = { touchAction: 'none', userSelect: 'none' };

    return (
        <div className={`touch-controls-area ${!enabled && 'd-none'}`} style={touchStyle}>

            <ArticlesButton large style={touchStyle} {...leftProps}>
                <i className="fad fa-solid fa-arrow-left me-2"></i>
                Left
            </ArticlesButton>

            <ArticlesButton large style={touchStyle} {...powerUpProps}>
                <i className="fad fa-solid fa-arrow-up me-2"></i>
                <span className="d-none d-lg-inline">Power +</span>
            </ArticlesButton>

            <ArticlesButton large style={touchStyle} onClick={actions.launch}>
                <i className="fad fa-solid fa-rocket me-2"></i>
                Launch
            </ArticlesButton>

            <ArticlesButton large style={touchStyle} {...powerDownProps}>
                <i className="fad fa-solid fa-arrow-down me-2"></i>
                <span className="d-none d-lg-inline">Power -</span>
            </ArticlesButton>

            <ArticlesButton large style={touchStyle} {...rightProps}>
                <i className="fad fa-solid fa-arrow-right me-2"></i>
                Right
            </ArticlesButton>

        </div>
    );
}
