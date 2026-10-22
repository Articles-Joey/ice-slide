import { useEffect, useMemo } from "react";
import { useCompoundBody } from "@react-three/cannon";
import {
    DataTexture,
    ExtrudeGeometry,
    LinearFilter,
    LinearMipmapLinearFilter,
    MeshStandardMaterial,
    RepeatWrapping,
    RGBAFormat,
    Shape,
} from "three";

const WALL_LENGTH = 20;
const WALL_HEIGHT = 2;
const WALL_THICKNESS = 1;

function createBumperMaterial() {
    const size = 128;
    const pixels = new Uint8Array(size * size * 4);

    function hash(x, y) {
        let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
        value = Math.imul(value ^ (value >>> 13), 1274126177);
        return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
    }

    function noise(u, v, frequency) {
        const x = u * frequency;
        const y = v * frequency;
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;
        const sx = fx * fx * (3 - 2 * fx);
        const sy = fy * fy * (3 - 2 * fy);
        // Wrap the lattice so repeated noise has no visible seams.
        const a = hash(ix % frequency, iy % frequency);
        const b = hash((ix + 1) % frequency, iy % frequency);
        const c = hash(ix % frequency, (iy + 1) % frequency);
        const d = hash((ix + 1) % frequency, (iy + 1) % frequency);
        return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = x / size;
            const v = y / size;
            const mottling =
                noise(u, v, 4) * 0.5 +
                noise(u, v, 12) * 0.3 +
                noise(u, v, 32) * 0.2;
            const shade = 135 + mottling * 100 + (hash(x, y) - 0.5) * 16;
            const index = (y * size + x) * 4;
            pixels[index] = pixels[index + 1] = pixels[index + 2] = shade;
            pixels[index + 3] = 255;
        }
    }

    const texture = new DataTexture(pixels, size, size, RGBAFormat);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(8, 1);
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return new MeshStandardMaterial({
        color: "#9aa7ae",
        map: texture,
        bumpMap: texture,
        bumpScale: 0.16,
        roughnessMap: texture,
        roughness: 0.9,
        metalness: 0,
    });
}

function createCornerGeometry() {
    const half = WALL_THICKNESS / 2;
    const shape = new Shape();

    // Trace the union of the two original boxes so the corner has only one surface.
    shape.moveTo(-WALL_LENGTH, half);
    shape.lineTo(-half, half);
    shape.lineTo(-half, WALL_LENGTH);
    shape.lineTo(half, WALL_LENGTH);
    shape.lineTo(half, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0, -half);
    shape.lineTo(-WALL_LENGTH, -half);
    shape.closePath();

    const geometry = new ExtrudeGeometry(shape, {
        depth: WALL_HEIGHT,
        bevelEnabled: false,
        steps: 1,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -WALL_HEIGHT / 2, 0);
    geometry.clearGroups();

    const positions = geometry.getAttribute("position");
    const normals = geometry.getAttribute("normal");
    const uvs = geometry.getAttribute("uv");

    // Keep the existing long-side texture density on both arms and their ends.
    for (let index = 0; index < uvs.count; index++) {
        const x = positions.getX(index);
        const y = positions.getY(index);
        const z = positions.getZ(index);
        const nx = normals.getX(index);
        const ny = normals.getY(index);
        const nz = normals.getZ(index);
        if (Math.abs(ny) > 0.5) {
            uvs.setXY(index, x / WALL_LENGTH, (half - ny * z) / WALL_HEIGHT);
        } else {
            const u = Math.abs(nx) > 0.5 ? -nx * z : nz * x;
            uvs.setXY(
                index,
                u / WALL_LENGTH,
                (y + WALL_HEIGHT / 2) / WALL_HEIGHT,
            );
        }
    }
    uvs.needsUpdate = true;
    return geometry;
}

function CornerWall({ position, rotation, geometry, material }) {
    const [ref] = useCompoundBody(() => ({
        mass: 0,
        type: "Static",
        position,
        rotation,
        shapes: [
            {
                type: "Box",
                args: [WALL_LENGTH, WALL_HEIGHT, WALL_THICKNESS],
                position: [-WALL_LENGTH / 2, 0, 0],
            },
            {
                type: "Box",
                args: [WALL_THICKNESS, WALL_HEIGHT, WALL_LENGTH],
                position: [0, 0, -WALL_LENGTH / 2],
            },
        ],
    }));

    return (
        <mesh
            ref={ref}
            geometry={geometry}
            material={material}
            castShadow
            receiveShadow
        />
    );
}

function Walls() {
    const material = useMemo(createBumperMaterial, []);
    const geometry = useMemo(createCornerGeometry, []);

    useEffect(
        () => () => {
            geometry.dispose();
            material.map.dispose();
            material.dispose();
        },
        [geometry, material],
    );

    const corners = [
        [50, 50, 0],
        [50, -50, Math.PI / 2],
        [-50, -50, Math.PI],
        [-50, 50, -Math.PI / 2],
    ];

    return (
        <group>
            {corners.map(([x, z, angle]) => (
                <CornerWall
                    key={`${x}:${z}`}
                    position={[x, WALL_HEIGHT / 2, z]}
                    rotation={[0, angle, 0]}
                    geometry={geometry}
                    material={material}
                />
            ))}
        </group>
    );
}

export default Walls;
