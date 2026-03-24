import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { bins, type Bin } from "@/data/mockData";
import { useState } from "react";

function getColor(fillLevel: number): string {
  if (fillLevel >= 80) return "#ff3333";
  if (fillLevel >= 50) return "#ffaa00";
  return "#00ff88";
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeModel() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("hsl(185, 100%, 50%)"),
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      }),
    []
  );

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("hsl(225, 40%, 8%)"),
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 48, 48]} material={solidMaterial} />
      <Sphere args={[2.01, 24, 24]} material={wireframeMaterial} />
    </group>
  );
}

function BinMarker({ bin }: { bin: Bin }) {
  const [hovered, setHovered] = useState(false);
  const pos = latLngToVector3(bin.lat, bin.lng, 2.08);
  const color = getColor(bin.fillLevel);

  return (
    <group position={pos}>
      <mesh
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? 0.06 : 0.04, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <pointLight color={color} intensity={hovered ? 2 : 0.5} distance={0.5} />
      {hovered && (
        <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="glass-card p-3 min-w-[180px] text-xs space-y-1.5 shadow-lg shadow-background/50">
            <p className="font-bold text-foreground">{bin.id} — {bin.location}</p>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${bin.fillLevel}%`, backgroundColor: color }}
                />
              </div>
              <span className="font-mono" style={{ color }}>{bin.fillLevel}%</span>
            </div>
            <p className="text-muted-foreground">Last: {bin.lastCollected}</p>
            <p className="text-muted-foreground">Worker: {bin.assignedWorker}</p>
            <p className="text-primary font-mono">AI: Full in {bin.predictedFullTime}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

const BinGlobe = () => {
  return (
    <div className="glass-card p-4 h-[420px] relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">City Bin Network</h3>
          <p className="text-[10px] text-muted-foreground font-mono">Real-time 3D monitoring • {bins.length} bins active</p>
        </div>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" />Empty</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-yellow" />Half</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" />Full</span>
        </div>
      </div>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <GlobeModel />
        {bins.map((bin) => (
          <BinMarker key={bin.id} bin={bin} />
        ))}
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>Drag to rotate • Scroll to zoom</span>
        <span className="text-primary animate-pulse-neon">● LIVE</span>
      </div>
    </div>
  );
};

export default BinGlobe;
