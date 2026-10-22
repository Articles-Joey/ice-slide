import { memo, useMemo } from "react";
import { Color, MathUtils } from "three";
import { useStore } from "@/hooks/useStore";

const FULL_TURN = Math.PI * 2;
const ignoreRaycast = () => null;

// Sampling by column keeps the terrain repeatable and closes the ring exactly.
function noise(column, seed) {
    const value = Math.sin(column * 127.1 + seed * 311.7) * 43758.5453;
    return value - Math.floor(value);
}

function createRingGeometry(segments, rows, sample) {
    const vertices = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: segments }, (_, column) =>
            sample((column * FULL_TURN) / segments, column, row),
        ),
    );
    const positions = [];
    const normals = [];
    const colors = [];

    function triangle(a, b, c) {
        const ab = b.position.map((value, axis) => value - a.position[axis]);
        const ac = c.position.map((value, axis) => value - a.position[axis]);
        const normal = [
            ab[1] * ac[2] - ab[2] * ac[1],
            ab[2] * ac[0] - ab[0] * ac[2],
            ab[0] * ac[1] - ab[1] * ac[0],
        ];
        const length = Math.hypot(...normal) || 1;
        const [nx, ny, nz] = normal.map((value) => value / length);

        // The daytime scene uses ambient light, so bake in subtle facet shading.
        const shade =
            0.68 + 0.32 * Math.max(0, -nx * 0.48 + ny * 0.8 + nz * 0.36);

        for (const vertex of [a, b, c]) {
            positions.push(...vertex.position);
            normals.push(nx, ny, nz);
            colors.push(
                vertex.color.r * shade,
                vertex.color.g * shade,
                vertex.color.b * shade,
            );
        }
    }

    for (let row = 0; row < rows - 1; row++) {
        for (let column = 0; column < segments; column++) {
            const next = (column + 1) % segments;
            const a = vertices[row][column];
            const b = vertices[row][next];
            const c = vertices[row + 1][column];
            const d = vertices[row + 1][next];
            triangle(a, b, c);
            triangle(b, d, c);
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        colors: new Float32Array(colors),
    };
}

function createGlacier(segments, radius, height, thickness, seed) {
    // A steep, fluted front rises into an uneven shelf and a sloping back.
    const profile = [
        [-8, -0.15],
        [-6, 0.06],
        [-3, 0.28],
        [0, 0.52],
        [-2, 0.77],
        [4, 1],
        [thickness * 0.4, 0.94],
        [thickness, 0.78],
        [thickness + 16, -0.15],
    ];
    const blueIce = new Color("#72b8d3");
    const whiteIce = new Color("#e7f6fb");
    const deepIce = new Color("#377996");

    return createRingGeometry(
        segments,
        profile.length,
        (angle, column, row) => {
            const [offset, level] = profile[row];
            const crevasse = Math.pow(noise(column, seed + 1), 7);
            const crest =
                height *
                (0.87 +
                    Math.sin(angle * 5 + seed) * 0.12 +
                    Math.sin(angle * 13 - seed) * 0.08 +
                    Math.sin(angle * 31) * 0.04 +
                    noise(column, seed) * 0.16 -
                    crevasse * 0.18);
            const contour =
                Math.sin(angle * 3 + seed) * 13 +
                Math.sin(angle * 9) * 7 +
                Math.sin(angle * 19) * 3;
            const front = row < 6;
            const radial =
                radius +
                contour +
                offset +
                (front ? crevasse * 12 : 0) +
                (noise(column, seed + row * 3) - 0.5) * 4;
            const elevation =
                level < 0
                    ? -12
                    : crest * level +
                      (noise(column, seed + row + 17) - 0.5) * height * 0.05;
            const color = blueIce
                .clone()
                .lerp(
                    whiteIce,
                    MathUtils.clamp(
                        0.25 + level * 0.6 + noise(column, seed + 2) * 0.15,
                        0,
                        1,
                    ),
                );
            color.lerp(deepIce, front ? crevasse * 0.65 : crevasse * 0.15);

            return {
                position: [
                    Math.cos(angle) * radial,
                    elevation,
                    Math.sin(angle) * radial,
                ],
                color,
            };
        },
    );
}

function createMountains(
    segments,
    radius,
    height,
    width,
    seed,
    distant = false,
) {
    const profile = [
        [0, 0],
        [0.15, 0.24],
        [0.34, 0.6],
        [0.52, 1],
        [0.7, 0.55],
        [0.87, 0.2],
        [1, 0],
    ];
    const rock = new Color(distant ? "#637f9c" : "#304b65");
    const upperRock = new Color(distant ? "#88a3bc" : "#597a97");
    const snow = new Color(distant ? "#c9deeb" : "#e1eef5");

    return createRingGeometry(
        segments,
        profile.length,
        (angle, column, row) => {
            const [offset, level] = profile[row];
            const summit =
                height *
                (0.76 +
                    Math.sin(angle * 4 + seed) * 0.22 +
                    Math.sin(angle * 9 - seed) * 0.14 +
                    Math.sin(angle * 19 + seed) * 0.08 +
                    noise(column, seed) * 0.2);
            const ridge =
                Math.sin(angle * 7 + seed) * 18 +
                (noise(column, seed + 4) - 0.5) * 16;
            const radial =
                radius +
                offset * width +
                ridge +
                Math.sin(angle * 11 + row) * 7;
            const elevation =
                level === 0
                    ? -18
                    : summit * level +
                      (noise(column, seed + row) - 0.5) * height * 0.06;
            const snowLine =
                0.55 +
                Math.sin(angle * 13 + seed + row * 0.4) * 0.12 +
                noise(column, seed + 8) * 0.13;
            const snowCover = MathUtils.clamp((level - snowLine) * 5, 0, 1);
            const color = rock
                .clone()
                .lerp(
                    upperRock,
                    MathUtils.clamp(
                        level * 0.65 + noise(column, seed + 5) * 0.3,
                        0,
                        1,
                    ),
                )
                .lerp(snow, snowCover);

            return {
                position: [
                    Math.cos(angle) * radial,
                    elevation,
                    Math.sin(angle) * radial,
                ],
                color,
            };
        },
    );
}

function TerrainMesh({ geometry, name }) {
    return (
        <mesh
            name={name}
            raycast={ignoreRaycast}
        >
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[geometry.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-normal"
                    args={[geometry.normals, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[geometry.colors, 3]}
                />
            </bufferGeometry>
            <meshStandardMaterial
                vertexColors
                flatShading
                roughness={0.95}
            />
        </mesh>
    );
}

function IceWalls({
    radius = 400,
    height = 80,
    thickness = 70,
    mountainRadius = 620,
    mountainHeight = 250,
    seed = 23,
    ...props
}) {
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const terrain = useMemo(() => {
        const segments =
            graphicsQuality === "Low"
                ? 192
                : graphicsQuality === "Medium"
                  ? 320
                  : 512;
        const mountainSegments = Math.floor(segments / 2);

        return {
            glacier: createGlacier(segments, radius, height, thickness, seed),
            mountains: createMountains(
                mountainSegments,
                mountainRadius,
                mountainHeight,
                200,
                seed + 31,
            ),
            distantMountains: createMountains(
                mountainSegments,
                mountainRadius + 280,
                mountainHeight * 1.35,
                240,
                seed + 67,
                true,
            ),
        };
    }, [
        graphicsQuality,
        radius,
        height,
        thickness,
        mountainRadius,
        mountainHeight,
        seed,
    ]);

    return (
        <group
            name="IceWalls"
            {...props}
        >
            <TerrainMesh
                name="Glacier ring"
                geometry={terrain.glacier}
            />
            <TerrainMesh
                name="Arctic mountains"
                geometry={terrain.mountains}
            />
            <TerrainMesh
                name="Distant arctic mountains"
                geometry={terrain.distantMountains}
            />
        </group>
    );
}

export default memo(IceWalls);
