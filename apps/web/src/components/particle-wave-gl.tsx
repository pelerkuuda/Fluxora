"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function WavePoints() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const data: number[] = [];
    const cols = 110;
    const rows = 42;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const nx = x / (cols - 1);
        const ny = y / (rows - 1);
        data.push((nx - 0.5) * 14, (ny - 0.5) * 5.2, 0);
      }
    }

    return new Float32Array(data);
  }, []);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;

    const time = clock.getElapsedTime() * 0.45;
    const position = points.geometry.attributes.position;

    for (let i = 0; i < position.count; i += 1) {
      const ix = i * 3;
      const x = position.array[ix] as number;
      const baseY = position.array[ix + 1] as number;

      const waveA = Math.sin(x * 0.7 + time * 1.8 + baseY * 0.9) * 0.22;
      const waveB = Math.cos(x * 0.32 - time * 1.2 + baseY * 1.8) * 0.16;
      const depth = Math.sin(x * 0.45 + time + baseY * 1.5) * 0.8;

      position.array[ix + 2] = depth;
      position.array[ix + 1] = baseY + waveA + waveB;
    }

    position.needsUpdate = true;
    points.rotation.x = -0.9;
    points.rotation.z = Math.sin(time * 0.25) * 0.04;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.032}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.82}
      />
    </Points>
  );
}

export function ParticleWaveGL() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 4, 12]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 0, 5]} intensity={0.6} />
        <WavePoints />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.78),rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.1)_72%,rgba(0,0,0,0.88))]" />
    </div>
  );
}
