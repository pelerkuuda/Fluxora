"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GlobeNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const lineGroupRef = useRef<THREE.Group>(null);

  const { positions, lineSets } = useMemo(() => {
    const pointData: number[] = [];
    const sampled: THREE.Vector3[] = [];
    const radiusX = 4.8;
    const radiusY = 2.7;
    const latSteps = 18;
    const lonSteps = 42;

    for (let lat = 0; lat <= latSteps; lat += 1) {
      const v = lat / latSteps;
      const phi = (v - 0.5) * Math.PI;
      for (let lon = 0; lon < lonSteps; lon += 1) {
        const u = lon / lonSteps;
        const theta = u * Math.PI * 2;
        const x = Math.cos(phi) * Math.cos(theta) * radiusX;
        const y = Math.sin(phi) * radiusY;
        const z = Math.cos(phi) * Math.sin(theta) * 1.8;
        pointData.push(x, y, z);
        if (lon % 6 === 0 && lat % 2 === 0) sampled.push(new THREE.Vector3(x, y, z));
      }
    }

    const arcs: THREE.Vector3[][] = [];
    for (let i = 0; i < sampled.length; i += 4) {
      const start = sampled[i];
      const end = sampled[(i + 7) % sampled.length];
      if (!start || !end) continue;

      const mid = start.clone().lerp(end, 0.5);
      mid.z += 0.9;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      arcs.push(curve.getPoints(36));
    }

    return {
      positions: new Float32Array(pointData),
      lineSets: arcs,
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.35;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.45;
      pointsRef.current.rotation.x = -0.18 + Math.sin(t * 0.8) * 0.03;
      pointsRef.current.rotation.z = Math.sin(t * 0.4) * 0.025;
    }

    if (lineGroupRef.current) {
      lineGroupRef.current.rotation.y = t * 0.45;
      lineGroupRef.current.rotation.x = -0.18 + Math.sin(t * 0.8) * 0.03;
      lineGroupRef.current.rotation.z = Math.sin(t * 0.4) * 0.025;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      <group ref={lineGroupRef}>
        {lineSets.map((points, index) => (
          <Line
            key={index}
            points={points}
            color={index % 3 === 0 ? "#ffd54a" : "#ffffff"}
            lineWidth={0.5}
            transparent
            opacity={0.16}
          />
        ))}
      </group>

      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.92}
        />
      </Points>
    </group>
  );
}

export function ParticleWaveGL() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 5, 12]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[0, 1, 5]} intensity={0.7} />
        <GlobeNetwork />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.86),rgba(0,0,0,0.15)_26%,rgba(0,0,0,0.16)_72%,rgba(0,0,0,0.92))]" />
    </div>
  );
}
