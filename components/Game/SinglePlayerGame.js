import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import { Billboard, Text } from "@react-three/drei";
import { PLAYER_ID, useSinglePlayerStore } from "@/hooks/useSinglePlayerStore";
import { useStore } from "@/hooks/useStore";
import { ModelWheel } from "../Models/Wheel";
import { ModelToonDogHead } from "../Models/ToonDogHead";
import { ModelCoin } from "../Models/Coin";
import { ModelBarrel } from "../Models/Barrel";

const PUCK_MASS = 10;
const BARREL_BOUNCE_FACTOR = 0.35;
const MAX_BARREL_BOUNCE_SPEED = 10;

function SinglePlayerPuck({ sessionId, round, player, bodies }) {
    const phase = useSinglePlayerStore((state) => state.phase);
    const hitRotation = useSinglePlayerStore((state) => state.hitRotation);
    const hitPower = useSinglePlayerStore((state) => state.hitPower);
    const toontownMode = useStore((state) => state.toontownMode);
    const telemetry = useRef({
        id: player.id,
        sessionId,
        round,
        position: [...player.position],
        velocity: [0, 0, 0],
        angularVelocity: [0, 0, 0],
        launched: false,
        fellOff: false,
    });
    const barrelHits = useRef(new Map());
    const [ref, api] = useCylinder(() => ({
        mass: PUCK_MASS,
        args: [3, 3, 1, 32],
        position: [...player.position],
        linearDamping: 0.4,
        angularDamping: 0.3,
        linearFactor: [1, 0, 1],
        angularFactor: [0, 1, 0],
        userData: { singlePlayer: true, singlePlayerId: player.id },
        onCollide: (event) => {
            const state = useSinglePlayerStore.getState();
            const body = telemetry.current;
            if (
                state.phase !== "sliding" ||
                state.sessionId !== sessionId ||
                state.round !== round ||
                body.fellOff
            )
                return;
            if (!event.body?.userData?.singlePlayerBarrel) return;
            const barrelId = event.body.userData.itemId;
            const now = performance.now();
            if (now - (barrelHits.current.get(barrelId) ?? -Infinity) < 400)
                return;
            const dx = body.position[0] - event.body.position.x;
            const dz = body.position[2] - event.body.position.z;
            const length = Math.hypot(dx, dz);
            if (length < 0.001) return;
            const nx = dx / length;
            const nz = dz / length;
            const approach = Math.max(
                0,
                -body.velocity[0] * nx - body.velocity[2] * nz,
                Math.abs(event.contact.impactVelocity || 0),
            );
            // Scale the rebound to the hit speed without a minimum kick.
            const boost = Math.min(
                MAX_BARREL_BOUNCE_SPEED,
                approach * BARREL_BOUNCE_FACTOR,
            );
            if (!Number.isFinite(boost) || boost < 0.05) return;
            barrelHits.current.set(barrelId, now);
            api.wakeUp();
            api.applyImpulse(
                [nx * PUCK_MASS * boost, 0, nz * PUCK_MASS * boost],
                [0, 0, 0],
            );
            body.velocity = [
                body.velocity[0] + nx * boost,
                0,
                body.velocity[2] + nz * boost,
            ];
        },
    }));

    useEffect(() => {
        const body = telemetry.current;
        body.api = api;
        body.ref = ref;
        bodies.current.set(player.id, body);
        const unsubscribePosition = api.position.subscribe((value) => {
            body.position = value;
        });
        const unsubscribeVelocity = api.velocity.subscribe((value) => {
            body.velocity = value;
        });
        const unsubscribeAngular = api.angularVelocity.subscribe((value) => {
            body.angularVelocity = value;
        });
        return () => {
            unsubscribePosition();
            unsubscribeVelocity();
            unsubscribeAngular();
            if (bodies.current.get(player.id) === body)
                bodies.current.delete(player.id);
        };
    }, [api, ref, bodies, player.id]);

    const rotation = player.isBot ? player.hitRotation : hitRotation;
    const power = player.isBot ? player.hitPower : hitPower;

    useEffect(() => {
        const body = telemetry.current;
        if (phase !== "sliding" || body.launched) return;
        body.launched = true;
        const angle = (rotation * Math.PI) / 180;
        api.wakeUp();
        body.velocity = [Math.sin(angle) * power, 0, Math.cos(angle) * power];
        api.velocity.set(...body.velocity);
    }, [phase, rotation, power, api]);

    const arrowLength = 5 + power * 0.25;
    return (
        <group ref={ref}>
            <ModelWheel
                scale={10}
                position={[0, -1.1, 0]}
            />
            {toontownMode && (
                <ModelToonDogHead
                    scale={0.25}
                    position={[0, 1.5, -0.75]}
                />
            )}
            <Billboard position={[0, 5, 0]}>
                <Text
                    fontSize={1.4}
                    color={player.color}
                    outlineColor="#f3faff"
                    outlineWidth={0.08}
                >
                    {player.id === PLAYER_ID ? "You" : player.nickname}
                </Text>
            </Billboard>
            {(phase === "lobby" || phase === "aiming") && (
                <group rotation={[0, (rotation * Math.PI) / 180, 0]}>
                    <mesh
                        position={[0, 0, 3 + arrowLength / 2]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <cylinderGeometry args={[0.18, 0.18, arrowLength, 8]} />
                        <meshStandardMaterial color={player.color} />
                    </mesh>
                    <mesh
                        position={[0, 0, 4 + arrowLength]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <coneGeometry args={[0.9, 2, 8]} />
                        <meshStandardMaterial color={player.color} />
                    </mesh>
                </group>
            )}
        </group>
    );
}

function SinglePlayerBarrel({ item }) {
    const [ref] = useCylinder(() => ({
        type: "Static",
        args: [2, 2, 6, 10],
        position: [item.x, 1.5, item.z],
        userData: { singlePlayerBarrel: true, itemId: item.id },
    }));
    return (
        <group ref={ref}>
            <ModelBarrel
                scale={17}
                position={[0, -1.25, 0]}
            />
        </group>
    );
}

function SinglePlayerCoin({ item }) {
    const [ref] = useCylinder(() => ({
        type: "Static",
        isTrigger: true,
        args: [2, 2, 6, 10],
        position: [item.x, 1.5, item.z],
        onCollide: (event) => {
            const playerId = event.body?.userData?.singlePlayerId;
            if (playerId)
                useSinglePlayerStore.getState().collectItem(item.id, playerId);
        },
    }));
    return (
        <group ref={ref}>
            <ModelCoin
                scale={5}
                position={[0, 2, 0]}
            />
        </group>
    );
}

function stopBody(body) {
    body.api.velocity.set(0, 0, 0);
    body.api.angularVelocity.set(0, 0, 0);
    body.api.sleep();
}

export default function SinglePlayerGame() {
    const sessionId = useSinglePlayerStore((state) => state.sessionId);
    const round = useSinglePlayerStore((state) => state.round);
    const phase = useSinglePlayerStore((state) => state.phase);
    const items = useSinglePlayerStore((state) => state.items);
    const players = useSinglePlayerStore((state) => state.players);
    const bodies = useRef(new Map());
    const flightTime = useRef(0);
    const stillTime = useRef(0);

    useEffect(() => {
        flightTime.current = 0;
        stillTime.current = 0;
    }, [sessionId, round]);

    useEffect(() => {
        if (phase === "loading")
            useSinglePlayerStore.getState().beginRound(sessionId, round);
        if (phase !== "round-over") return;
        const timeout = setTimeout(
            () => useSinglePlayerStore.getState().nextRound(sessionId, round),
            1500,
        );
        return () => clearTimeout(timeout);
    }, [phase, sessionId, round]);

    useFrame((_, delta) => {
        const state = useSinglePlayerStore.getState();
        state.tick(Date.now());
        if (state.phase !== "sliding") return;
        const activeBodies = state.players.map((player) =>
            bodies.current.get(player.id),
        );
        if (
            activeBodies.some(
                (body) =>
                    !body ||
                    body.sessionId !== state.sessionId ||
                    body.round !== state.round ||
                    !body.launched,
            )
        )
            return;
        const step = Math.min(delta, 0.1);
        flightTime.current += step;
        for (const body of activeBodies) {
            const [x, y, z] = body.position;
            if (
                !body.fellOff &&
                (!body.position.every(Number.isFinite) ||
                    Math.abs(x) > 53 ||
                    Math.abs(z) > 53 ||
                    y < -5)
            ) {
                body.fellOff = true;
                stopBody(body);
                body.api.collisionFilterMask.set(0);
                if (body.ref.current) body.ref.current.visible = false;
            }
        }
        // Keep resting tires live until everyone settles: another tire may hit them.
        const stopped = activeBodies.every(
            (body) =>
                body.fellOff ||
                (Math.hypot(...body.velocity) < 0.15 &&
                    Math.hypot(...body.angularVelocity) < 0.1),
        );
        stillTime.current =
            flightTime.current > 0.5 && stopped ? stillTime.current + step : 0;
        if (stillTime.current > 0.65 || flightTime.current > 30) {
            activeBodies.forEach(stopBody);
            state.finishRound(
                state.sessionId,
                state.round,
                activeBodies.map((body) => ({
                    id: body.id,
                    position: body.position,
                    fellOff: body.fellOff,
                })),
            );
        }
    });

    if (phase === "idle") return null;
    return (
        <group>
            {players.map((player) => (
                <SinglePlayerPuck
                    key={`${sessionId}:${round}:${player.id}`}
                    sessionId={sessionId}
                    round={round}
                    player={player}
                    bodies={bodies}
                />
            ))}
            {items.map((item) =>
                item.type === "Barrel" ? (
                    <SinglePlayerBarrel
                        key={item.id}
                        item={item}
                    />
                ) : (
                    <SinglePlayerCoin
                        key={item.id}
                        item={item}
                    />
                ),
            )}
        </group>
    );
}
