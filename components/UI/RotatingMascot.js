import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Box from "@mui/material/Box";
import { ModelGoogleIglooOpen } from "../Models/Igloo Open";

export default function RotatingMascot() {
    return (
        <Box className="rotating-mascot-container" sx={{ width: '100%', height: '100%' }}>
            <Suspense>
                <Canvas>
    
                    <OrbitControls
                        autoRotate
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={false}
                        autoRotateSpeed={10}
                    />
    
                    {/* <ambientLight intensity={1} /> */}
                    <directionalLight position={[0, 10, 5]} intensity={4} />
    
                    <Suspense fallback={null}>
                        <group
                            position={[0, -1, 0]}
                            scale={1.25}
                        >
                            <ModelGoogleIglooOpen />
                        </group>
                    </Suspense>
    
                </Canvas>
            </Suspense>
        </Box>
    );
}
