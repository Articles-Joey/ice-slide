// Run: node --experimental-vm-modules --test tests/ice-slide-lifecycle.test.mjs
// ICE_SLIDE_BACKEND_DIR can point at a staged copy of the Ice Slide handlers.
// Imports outside that folder are mocked, so no other articles-express files are read.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

const backend = process.env.ICE_SLIDE_BACKEND_DIR ||
    'F:\\My Documents\\Sites\\Articles Media\\articles-express\\socketHandlers\\games\\Ice Slide';
const room = id => `game:ice-slide-room-${id}`;
const plain = value => JSON.parse(JSON.stringify(value));

async function setup() {
    const state = new Map();
    const sockets = new Map();
    const emissions = [];
    const errors = [];
    const timers = new Map();
    let clock = 100000;
    let nextId = 0;
    class TestDate extends Date {
        constructor(...args) { super(...(args.length ? args : [clock])); }
        static now() { return clock; }
    }
    const app = { get: key => state.get(key), set: (key, value) => state.set(key, value) };
    const io = {
        sockets: { sockets },
        in: name => ({ fetchSockets: async () => [...sockets.values()].filter(socket => socket.rooms.has(name)) }),
        to: name => ({ emit: (event, data) => emissions.push({ room: name, event, data: plain(data) }) }),
    };
    const context = createContext({
        Date: TestDate,
        console: { log() {}, error: (...args) => errors.push(args) },
        setInterval: callback => { const id = ++nextId; timers.set(id, callback); return id; },
        clearInterval: id => timers.delete(id),
    });
    const modules = new Map();
    const mocks = {
        '#root/util/emitRoomsList.js': { default() {} },
        '#root/util/socket/fetchSocketsSafe.js': {
            default: async (io, name) => (await io.in(name).fetchSockets()).map(socket => ({ id: socket.id, ...plain(socket.data) })),
        },
        uuid: { v4: () => `item-${++nextId}` },
    };
    function load(name) {
        if (modules.has(name)) return modules.get(name);
        let module;
        if (mocks[name]) {
            const values = mocks[name];
            module = new SyntheticModule(Object.keys(values), function () {
                for (const [key, value] of Object.entries(values)) this.setExport(key, value);
            }, { context, identifier: name });
        } else {
            assert.equal(path.basename(name), name, 'Only read files inside the Ice Slide folder');
            module = new SourceTextModule(readFileSync(path.join(backend, name), 'utf8'), { context, identifier: name });
        }
        modules.set(name, module);
        return module;
    }
    const entry = load('index.js');
    await entry.link(specifier => load(specifier.startsWith('./') ? specifier.slice(2) : specifier));
    await entry.evaluate();

    function connect(id) {
        const handlers = new Map();
        const socket = {
            id, data: {}, rooms: new Set([id]),
            on: (event, callback) => handlers.set(event, callback),
            emit: (event, data) => emissions.push({ socket: id, event, data }),
            join: async name => socket.rooms.add(name),
            leave: name => socket.rooms.delete(name),
            send: (event, ...args) => handlers.get(event)(...args),
        };
        sockets.set(id, socket);
        entry.namespace.default(io, socket, app);
        return socket;
    }
    return {
        app, io, emissions, connect,
        game: (id = 'a') => app.get('ice-slide').games.find(game => game.server_id === id),
        join: (socket, id = 'a') => socket.send('join-room', room(id), { game_id: id, nickname: socket.id }),
        start: (socket, id = 'a', extra = {}) => socket.send('game:ice-slide:start-game', { server_id: id, ...extra }),
        async tick() {
            clock += 1000;
            const interval = modules.get('intervals.js').namespace.intervals.gameInterval;
            assert.ok(timers.has(interval), 'The game timer is running');
            await timers.get(interval)();
            assert.equal(errors.length, 0, 'The timer must not swallow errors');
        },
        rankings: players => modules.get('getPlayerRankings.js').namespace.default(players),
    };
}

test('joining creates a lobby; a second connection and duplicate joins preserve its players', async () => {
    const h = await setup();
    const first = h.connect('first');
    await h.join(first);
    assert.equal(h.game().status, 'In Lobby');
    const second = h.connect('second');
    await h.join(second);
    await h.join(first);
    assert.deepEqual(plain(h.game().players), ['first', 'second']);
    for (let i = 0; i < 30; i++) await h.tick();
    assert.equal(h.game().timer, 20);
    assert.equal(h.game().round, 0);
    assert.equal(h.game().lastLaunch, undefined);
    await first.send('game:ice-slide:move', { server: 'a', hitPower: 50, hitRotation: 20 });
    assert.equal(first.data.ready, false);
    assert.equal(h.emissions.at(-1).data.status, 'In Lobby');
});

test('any joined player starts; outsiders and repeated clicks cannot restart an active game', async () => {
    const h = await setup();
    const first = h.connect('first');
    const second = h.connect('second');
    const outsider = h.connect('outsider');
    await h.join(first);
    await h.join(second);
    await h.start(outsider);
    assert.equal(h.game().status, 'In Lobby');
    await h.start(second, 'a', { status: 'Game Over' });
    assert.equal(h.game().status, 'In Progress');
    assert.equal(h.game().timer, 20);
    const started = h.game().gameStarted;
    await h.tick();
    await h.start(first);
    assert.equal(h.game().gameStarted, started);
    assert.equal(h.game().timer, 19);
    assert.equal(h.emissions.find(event => event.data?.event === 'Game started').data.status, 'In Progress');
});

test('rankings use both horizontal coordinates, accept X/Y, and ignore invalid positions', async () => {
    const h = await setup();
    const rankings = plain(h.rankings([
        { id: 'far', nickname: 'Far', position: { x: 0, y: 1.5, z: 10 } },
        { id: 'near', nickname: 'Near', position: { x: 3, y: 1.5, z: 4 } },
        { id: 'xy', nickname: 'XY', position: { x: 0, y: 2 } },
        { id: 'center', position: { x: 0, y: 0 } },
        { id: 'missing' },
        { id: 'invalid', position: { x: NaN, z: 0 } },
    ]));
    assert.deepEqual(rankings.map(player => player.id), ['center', 'xy', 'near', 'far']);
    assert.equal(rankings[2].distance, 5);
});

test('game over stores and emits full results once; replay resets results and every player', async () => {
    const h = await setup();
    const first = h.connect('first');
    const second = h.connect('second');
    await h.join(first);
    await h.join(second);
    await h.start(second);
    const firstStarted = h.game().gameStarted;
    for (let round = 0; round < 2; round++) {
        first.data.ready = true;
        second.data.ready = true;
        await h.tick();
        assert.equal(h.game().round, round + 1);
        assert.equal(first.data.ready, false);
    }
    await first.send('game:ice-slide:position', { server: 'a', x: 0, y: 1.5, z: 10, gameStarted: firstStarted });
    await second.send('game:ice-slide:position', { server: 'a', x: 3, y: 1.5, z: 4, gameStarted: firstStarted });
    first.data.ready = true;
    second.data.ready = true;
    await h.tick();
    assert.equal(h.game().status, 'In Progress', 'Readiness cannot skip the final settling timer');
    for (let i = 0; i < 19; i++) await h.tick();
    assert.equal(h.game().status, 'Game Over');
    assert.deepEqual(plain(h.game().winner), { id: 'second', nickname: 'second', x: 3, y: 4, distance: 5 });
    assert.deepEqual(plain(h.game().rankings).map(player => player.distance), [5, 10]);
    const finish = h.emissions.filter(event => event.event === 'game-over');
    assert.equal(finish.length, 1);
    assert.deepEqual(finish[0].data.winner, plain(h.game().winner));
    assert.deepEqual(h.emissions.at(-1).data.rankings, finish[0].data.rankings);
    const frozen = plain(h.game());
    for (let i = 0; i < 30; i++) await h.tick();
    await first.send('game:ice-slide:position', { server: 'a', x: 0, z: 0 });
    assert.deepEqual(plain(h.game()), frozen);
    assert.equal(h.emissions.filter(event => event.event === 'game-over').length, 1);
    await h.start(first);
    assert.equal(h.game().status, 'In Progress');
    assert.notEqual(h.game().gameStarted, firstStarted);
    assert.equal(h.game().winner, null);
    assert.deepEqual(plain(h.game().rankings), []);
    assert.equal(h.game().lastLaunch, null);
    assert.equal(h.game().timer, 20);
    for (const player of [first, second]) {
        assert.equal(player.data.ready, false);
        assert.deepEqual(plain(player.data.position), { x: player.data.startX, y: player.data.startZ, z: player.data.startZ });
    }
    const resetPosition = plain(first.data.position);
    await first.send('game:ice-slide:position', { server: 'a', x: 0, z: 0, gameStarted: firstStarted });
    assert.deepEqual(plain(first.data.position), resetPosition, 'Ignore stale position reports from the previous game');
});

test('timer expiry launches, separate rooms stay independent, and a full room rejects an extra player', async () => {
    const h = await setup();
    const players = Array.from({ length: 5 }, (_, i) => h.connect(`p${i}`));
    for (const player of players.slice(0, 4)) await h.join(player);
    await h.join(players[4]);
    assert.equal(h.game().players.length, 4);
    assert.equal(players[4].rooms.has(room('a')), false);
    await h.join(players[4], 'b');
    await h.start(players[2]);
    for (let i = 0; i < 20; i++) await h.tick();
    assert.equal(h.game().round, 1);
    assert.equal(h.game().timer, 20);
    assert.equal(h.game('b').status, 'In Lobby');
    assert.equal(h.game('b').timer, 20);
    await players[1].send('leave-room', room('a'));
    await h.join(players[4]);
    assert.equal(players[4].data.startX, players[1].data.startX);
    assert.equal(players[4].data.startZ, players[1].data.startZ);
});
