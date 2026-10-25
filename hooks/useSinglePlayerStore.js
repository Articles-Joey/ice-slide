import { createWithEqualityFn as create } from "zustand/traditional";

export const SINGLE_PLAYER_ROUNDS = 3;
export const AIM_SECONDS = 15;
export const PLAYER_ID = "player";
export const PLAYER_START = [40, 1.5, 40];

function aimAtCenter(position) {
    return (
        ((Math.atan2(-position[0], -position[2]) * 180) / Math.PI + 360) % 360
    );
}

function createPlayers(nickname) {
    return [
        {
            id: PLAYER_ID,
            nickname: nickname || "Player",
            color: "#2987de",
            homePosition: PLAYER_START,
        },
        {
            id: "bot-1",
            nickname: "Frost",
            color: "#a561db",
            homePosition: [-40, 1.5, 40],
            accuracy: 3,
        },
        {
            id: "bot-2",
            nickname: "Flurry",
            color: "#df8c29",
            homePosition: [-40, 1.5, -40],
            accuracy: 5,
        },
        {
            id: "bot-3",
            nickname: "Glacier",
            color: "#d85277",
            homePosition: [40, 1.5, -40],
            accuracy: 7,
        },
    ].map((player) => ({
        ...player,
        isBot: player.id !== PLAYER_ID,
        position: [...player.homePosition],
        hitRotation: aimAtCenter(player.homePosition),
        hitPower: 29,
        coins: 0,
        roundCoins: 0,
        rounds: [],
        fellOff: false,
    }));
}

function createItems(sessionId, players) {
    const items = [];
    for (let index = 0; index < 10; index++) {
        for (let attempt = 0; attempt < 200; attempt++) {
            const x = Math.random() * 72 - 36;
            const z = Math.random() * 70 - 36;
            if (Math.hypot(x, z) < 10) continue;
            if (
                players.some(
                    (player) =>
                        Math.hypot(
                            x - player.position[0],
                            z - player.position[2],
                        ) < 9,
                )
            )
                continue;
            if (items.some((item) => Math.hypot(x - item.x, z - item.z) < 8))
                continue;
            items.push({
                id: `${sessionId}:${index}`,
                type: index < 6 ? "Barrel" : "Point",
                x,
                z,
            });
            break;
        }
    }
    return items;
}

function planBotShot(player, items) {
    const [x, , z] = player.position;
    const distance = Math.hypot(x, z);
    const centerAngle = Math.atan2(-x, -z);
    if (distance < 0.75)
        return { hitRotation: aimAtCenter(player.position), hitPower: 0 };

    // Compare direct and shorter angled shots so bots can work around barrels.
    let best = null;
    for (const offset of [0, -0.24, 0.24, -0.48, 0.48]) {
        for (const fraction of [1, 0.8, 0.55]) {
            const angle = centerAngle + offset;
            const dx = Math.sin(angle);
            const dz = Math.cos(angle);
            const travel = distance * fraction;
            let score = Math.hypot(x + dx * travel, z + dz * travel);
            for (const item of items) {
                if (item.type !== "Barrel") continue;
                const along = Math.max(
                    0,
                    Math.min(travel, (item.x - x) * dx + (item.z - z) * dz),
                );
                const clearance = Math.hypot(
                    item.x - x - dx * along,
                    item.z - z - dz * along,
                );
                if (clearance < 6.4) score += 12 + (6.4 - clearance) * 12;
            }
            if (!best || score < best.score) best = { angle, travel, score };
        }
    }

    const angleError = (Math.random() * 2 - 1) * player.accuracy;
    return {
        hitRotation: ((best.angle * 180) / Math.PI + angleError + 360) % 360,
        hitPower: Math.max(
            0,
            Math.min(100, best.travel * 0.515 * (0.92 + Math.random() * 0.16)),
        ),
    };
}

function createRankings(players) {
    return players
        .map((player) => ({
            id: player.id,
            nickname: player.nickname,
            isBot: player.isBot,
            color: player.color,
            distance: player.fellOff
                ? null
                : Math.hypot(player.position[0], player.position[2]),
            coins: player.coins,
        }))
        .sort((a, b) => {
            if (a.distance === null && b.distance !== null) return 1;
            if (b.distance === null && a.distance !== null) return -1;
            return (a.distance ?? 0) - (b.distance ?? 0) || b.coins - a.coins;
        })
        .map((player, index) => ({ ...player, rank: index + 1 }));
}

const initialState = {
    sessionId: 0,
    nickname: "Player",
    status: "In Lobby",
    phase: "idle",
    round: 0,
    timer: AIM_SECONDS,
    deadline: null,
    hitRotation: 225,
    hitPower: 29,
    players: [],
    items: [],
    coins: 0,
    rounds: [],
    result: null,
    showResults: false,
};

export const useSinglePlayerStore = create((set, get) => ({
    ...initialState,
    createLobby(nickname) {
        const sessionId = get().sessionId + 1;
        const players = createPlayers(nickname);
        set({
            ...initialState,
            sessionId,
            nickname: nickname || "Player",
            phase: "lobby",
            players,
            items: createItems(sessionId, players),
        });
    },
    startGame(nickname) {
        if (get().status === "In Progress") return;
        if (get().phase !== "lobby")
            get().createLobby(nickname || get().nickname);
        const state = get();
        if (nickname && nickname !== state.nickname) {
            set({
                nickname,
                players: state.players.map((player) =>
                    player.id === PLAYER_ID ? { ...player, nickname } : player,
                ),
            });
        }
        get().beginRound(state.sessionId, state.round);
    },
    reset() {
        set({ ...initialState, sessionId: get().sessionId + 1 });
    },
    beginRound(sessionId, round) {
        const state = get();
        if (
            state.sessionId !== sessionId ||
            state.round !== round ||
            !["lobby", "loading"].includes(state.phase)
        )
            return;
        set({
            status: "In Progress",
            phase: "aiming",
            timer: AIM_SECONDS,
            deadline: Date.now() + AIM_SECONDS * 1000,
            players: state.players.map((player) =>
                player.isBot
                    ? { ...player, ...planBotShot(player, state.items) }
                    : player,
            ),
        });
    },
    setAim(values) {
        if (!["lobby", "aiming"].includes(get().phase)) return;
        const next = {};
        if (Number.isFinite(values.hitRotation))
            next.hitRotation = ((values.hitRotation % 360) + 360) % 360;
        if (Number.isFinite(values.hitPower))
            next.hitPower = Math.max(0, Math.min(100, values.hitPower));
        set(next);
    },
    launch() {
        if (get().phase === "lobby") get().startGame();
        const state = get();
        if (state.phase !== "aiming") return;
        set({
            phase: "sliding",
            timer: 0,
            deadline: null,
            players: state.players.map((player) =>
                player.isBot
                    ? player
                    : {
                          ...player,
                          hitRotation: state.hitRotation,
                          hitPower: state.hitPower,
                      },
            ),
        });
    },
    tick(now) {
        const state = get();
        if (state.phase !== "aiming") return;
        const timer = Math.max(0, Math.ceil((state.deadline - now) / 1000));
        if (timer === 0) state.launch();
        else if (timer !== state.timer) set({ timer });
    },
    collectItem(id, playerId) {
        const state = get();
        if (
            state.phase !== "sliding" ||
            !state.players.some((player) => player.id === playerId)
        )
            return;
        if (
            !state.items.some((item) => item.id === id && item.type === "Point")
        )
            return;
        set({
            coins: state.coins + (playerId === PLAYER_ID ? 1 : 0),
            items: state.items.filter((item) => item.id !== id),
            players: state.players.map((player) =>
                player.id === playerId
                    ? {
                          ...player,
                          coins: player.coins + 1,
                          roundCoins: player.roundCoins + 1,
                      }
                    : player,
            ),
        });
    },
    finishRound(sessionId, round, finishes) {
        const state = get();
        if (
            state.sessionId !== sessionId ||
            state.round !== round ||
            state.phase !== "sliding"
        )
            return;
        const byId = new Map(finishes.map((finish) => [finish.id, finish]));
        if (state.players.some((player) => !byId.has(player.id))) return;
        const players = state.players.map((player) => {
            const finish = byId.get(player.id);
            const validPosition = finish.position.every(Number.isFinite);
            const position = validPosition
                ? [...finish.position]
                : [...player.position];
            const fellOff = finish.fellOff || !validPosition;
            const result = {
                round: round + 1,
                position,
                distance: Math.hypot(position[0], position[2]),
                fellOff,
                coins: player.roundCoins,
            };
            return {
                ...player,
                position,
                fellOff,
                rounds: [...player.rounds, result],
            };
        });
        const human = players.find((player) => player.id === PLAYER_ID);
        const rounds = human.rounds;
        if (round + 1 === SINGLE_PLAYER_ROUNDS) {
            const validRounds = rounds.filter((result) => !result.fellOff);
            const rankings = createRankings(players);
            set({
                players,
                rounds,
                status: "Game Over",
                phase: "complete",
                showResults: true,
                result: {
                    nickname: state.nickname,
                    rounds,
                    finalDistance: human.fellOff
                        ? null
                        : Math.hypot(human.position[0], human.position[2]),
                    bestDistance: validRounds.length
                        ? Math.min(
                              ...validRounds.map((result) => result.distance),
                          )
                        : null,
                    coins: human.coins,
                    rankings,
                    winner: rankings[0].distance === null ? null : rankings[0],
                },
            });
        } else {
            set({ players, rounds, phase: "round-over" });
        }
    },
    nextRound(sessionId, round) {
        const state = get();
        if (
            state.sessionId !== sessionId ||
            state.round !== round ||
            state.phase !== "round-over"
        )
            return;
        const human = state.players.find((player) => player.id === PLAYER_ID);
        set({
            round: round + 1,
            phase: "loading",
            timer: AIM_SECONDS,
            deadline: null,
            hitRotation: human.fellOff
                ? aimAtCenter(PLAYER_START)
                : state.hitRotation,
            hitPower: human.fellOff ? 29 : state.hitPower,
            players: state.players.map((player) => ({
                ...player,
                position: player.fellOff
                    ? [...player.homePosition]
                    : player.position,
                fellOff: false,
                roundCoins: 0,
            })),
            coins: 0,
        });
    },
    setResultsOpen(showResults) {
        set({ showResults: Boolean(showResults) });
    },
}));

// Stable callbacks shared by the keyboard and the on-screen controls.
export const singlePlayerActions = {
    rotateLeft() {
        const state = useSinglePlayerStore.getState();
        state.setAim({ hitRotation: state.hitRotation - 1 });
    },
    rotateRight() {
        const state = useSinglePlayerStore.getState();
        state.setAim({ hitRotation: state.hitRotation + 1 });
    },
    powerUp() {
        const state = useSinglePlayerStore.getState();
        state.setAim({ hitPower: state.hitPower + 1 });
    },
    powerDown() {
        const state = useSinglePlayerStore.getState();
        state.setAim({ hitPower: state.hitPower - 1 });
    },
    launch() {
        useSinglePlayerStore.getState().launch();
    },
};
