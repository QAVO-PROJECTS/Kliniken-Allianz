import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function DNA3DModel() {
    const groupRef = useRef();

    // spiral parametrləri
    const turns = 8;
    const points = 80;
    const radius = 1.3;
    const height = 6;
    const spheres = [];

    // Spiral nöqtələri
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 * turns;
        const y = (i / points) * height - height / 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Sphere radius — şəkildəkilər kimi biri böyük biri kiçik
        const size = 0.12 + Math.sin(i * 0.6) * 0.08;

        // Gradient rəng (tünddən açığa keçid)
        const color = new THREE.Color();
        color.setHSL(0.6 - (i / points) * 0.25, 0.85, 0.55);

        spheres.push({ position: [x, y, z], color, size });
    }

    // Hərəkət — spiral fırlanır və bir az dalğalanır
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.4;
            groupRef.current.position.x = Math.sin(t * 0.6) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Sferalar */}
            {spheres.map((s, i) => (
                <mesh key={i} position={s.position} scale={s.size}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshPhysicalMaterial
                        color={s.color}
                        metalness={0.6}
                        roughness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.2}
                        reflectivity={1}
                        transmission={0.3} // bir az şəffaf
                        thickness={0.4}
                        emissive={s.color}
                        emissiveIntensity={0.15}
                    />
                </mesh>
            ))}

            {/* Aradakı damla-vari bağlantılar */}
            {spheres.slice(1).map((s, i) => {
                const prev = spheres[i];
                const curr = s;
                const pos1 = new THREE.Vector3(...prev.position);
                const pos2 = new THREE.Vector3(...curr.position);

                const mid = pos1.clone().add(pos2).divideScalar(2);
                const dir = new THREE.Vector3().subVectors(pos2, pos1);
                const length = dir.length();

                // silindri istiqamətləndiririk
                const orientation = new THREE.Matrix4();
                orientation.lookAt(pos1, pos2, new THREE.Vector3(0, 1, 0));
                orientation.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));

                // radiuslar — damla effekti (başda qalın, sonda nazik)
                const startRadius = 0.06;
                const endRadius = 0.015;

                return (
                    <mesh
                        key={`link-${i}`}
                        position={mid}
                        matrix={orientation}
                        matrixAutoUpdate={false}
                    >
                        <cylinderGeometry args={[startRadius, endRadius, length, 32]} />
                        <meshPhysicalMaterial
                            color={"#1E5AD9"}
                            roughness={0.2}
                            metalness={0.7}
                            clearcoat={0.8}
                            emissive={"#1E5AD9"}
                            emissiveIntensity={0.1}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}
