import { useEffect, useMemo } from "react";
import { useBox } from "@react-three/cannon";
import { MeshReflectorMaterial } from "@react-three/drei";
import { BoxGeometry, CanvasTexture, SRGBColorSpace } from "three";
import { useStore } from "@/hooks/useStore";

function hash(x, y) {
    let value = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function noise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
}

function createIceTextures(size) {
    const contexts = Array.from({ length: 3 }, () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        return canvas.getContext("2d");
    });
    const [color, bump, roughness] = contexts;
    const pixels = contexts.map((context) =>
        context.createImageData(size, size),
    );

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const u = x / size;
            const v = y / size;
            const cloud =
                noise(u * 7, v * 7) * 0.55 +
                noise(u * 19 + 8, v * 19) * 0.3 +
                noise(u * 48, v * 48 + 12) * 0.15;
            const grain = hash(x, y) - 0.5;
            const frost = Math.pow(noise(u * 70 + 23, v * 70), 3);
            const index = (y * size + x) * 4;
            pixels[0].data[index] = 112 + cloud * 85 + frost * 18 + grain * 3;
            pixels[0].data[index + 1] =
                177 + cloud * 57 + frost * 12 + grain * 3;
            pixels[0].data[index + 2] =
                201 + cloud * 43 + frost * 9 + grain * 2;

            const relief = 75 + cloud * 24 + frost * 8 + grain * 3;
            const polish = 90 + cloud * 90 + frost * 45;
            for (let channel = 0; channel < 3; channel++) {
                pixels[1].data[index + channel] = relief;
                pixels[2].data[index + channel] = polish;
            }
            for (const image of pixels) image.data[index + 3] = 255;
        }
    }
    contexts.forEach((context, index) =>
        context.putImageData(pixels[index], 0, 0),
    );

    let seed = 73;
    function random() {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    }

    const scale = size / 512;
    function crack(x, y, angle, steps, strength, branching) {
        const points = [[x, y]];
        for (let step = 0; step < steps; step++) {
            angle += (random() - 0.5) * 0.85;
            const length = (7 + random() * 12) * scale;
            x += Math.cos(angle) * length;
            y += Math.sin(angle) * length;
            points.push([x, y]);
            if (branching && step > 1 && random() < 0.18) {
                crack(
                    x,
                    y,
                    angle + (random() < 0.5 ? -1 : 1),
                    3 + Math.floor(random() * 4),
                    strength * 0.45,
                    false,
                );
            }
        }

        function stroke(context, style, width) {
            context.beginPath();
            context.moveTo(...points[0]);
            for (let point = 1; point < points.length; point++)
                context.lineTo(...points[point]);
            context.strokeStyle = style;
            context.lineWidth = width * scale;
            context.lineJoin = context.lineCap = "round";
            context.stroke();
        }

        // Dark edges and a fine white core make the fractures look submerged.
        stroke(color, `rgba(45, 113, 145, ${strength * 0.28})`, 1.8);
        stroke(color, `rgba(232, 252, 255, ${strength * 0.7})`, 0.65);
        stroke(bump, `rgba(155, 155, 155, ${strength * 0.5})`, 0.9);
        stroke(roughness, `rgba(235, 235, 235, ${strength * 0.7})`, 1.6);
    }

    for (let fracture = 0; fracture < 16; fracture++) {
        crack(
            random() * size,
            random() * size,
            random() * Math.PI * 2,
            8 + Math.floor(random() * 15),
            0.45 + random() * 0.5,
            true,
        );
    }

    // Small, faint air pockets add depth without covering the playing surface.
    for (let bubble = 0; bubble < 200; bubble++) {
        color.beginPath();
        color.arc(
            random() * size,
            random() * size,
            (0.3 + random() * 1.1) * scale,
            0,
            Math.PI * 2,
        );
        color.fillStyle = `rgba(235, 252, 255, ${0.06 + random() * 0.15})`;
        color.fill();
    }

    const textures = contexts.map((context) => {
        const texture = new CanvasTexture(context.canvas);
        texture.anisotropy = 4;
        return texture;
    });
    textures[0].colorSpace = SRGBColorSpace;
    return {
        map: textures[0],
        bumpMap: textures[1],
        roughnessMap: textures[2],
    };
}

function Ground() {
    const graphicsQuality = useStore((state) => state.graphicsQuality);
    const textureSize = graphicsQuality === "Low" ? 256 : 512;
    const reflectionSize =
        graphicsQuality === "Low"
            ? 128
            : graphicsQuality === "Medium"
              ? 256
              : 512;
    const textures = useMemo(
        () => createIceTextures(textureSize),
        [textureSize],
    );
    const bodyGeometry = useMemo(() => {
        const geometry = new BoxGeometry(100, 0.5, 100);
        const normals = geometry.getAttribute("normal");

        // The reflective plane supplies the top; a second face here causes z-fighting.
        geometry.setIndex(
            Array.from(geometry.getIndex().array).filter(
                (index) => normals.getY(index) < 0.5,
            ),
        );
        geometry.clearGroups();
        return geometry;
    }, []);

    useEffect(
        () => () => {
            Object.values(textures).forEach((texture) => texture.dispose());
        },
        [textures],
    );

    useEffect(() => () => bodyGeometry.dispose(), [bodyGeometry]);

    const [ref] = useBox(() => ({
        mass: 0,
        type: "Static",
        args: [100, 0.5, 100],
        position: [0, 0, 0],
    }));

    return (
        <group ref={ref}>
            <mesh
                renderOrder={1}
                castShadow
                receiveShadow
            >
                <primitive
                    object={bodyGeometry}
                    attach="geometry"
                />
                <meshPhysicalMaterial
                    color="#8fc9dd"
                    roughness={0.24}
                    clearcoat={0.6}
                />
            </mesh>
            <mesh
                position={[0, 0.25, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                renderOrder={2}
                receiveShadow
            >
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    {...textures}
                    bumpScale={0.045}
                    roughness={0.42}
                    metalness={0}
                    resolution={reflectionSize}
                    blur={graphicsQuality === "Low" ? [0, 0] : [100, 60]}
                    mixBlur={2}
                    mixStrength={0.55}
                    mirror={0.22}
                />
            </mesh>
        </group>
    );
}

export default Ground;
