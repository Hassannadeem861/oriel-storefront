"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export const GLAZES = {
  bone: { color: "#ece5d8", roughness: 0.42 },
  clay: { color: "#a84a2a", roughness: 0.38 },
  moss: { color: "#4c5a47", roughness: 0.4 },
  ink: { color: "#1d2333", roughness: 0.3 },
};

/** Profile of Vessel No. 3: small foot, full shoulder, narrow lip. */
function useVesselGeometry() {
  return useMemo(() => {
    const pts = [
      [0.0, 0.0], [0.38, 0.0], [0.42, 0.05], [0.58, 0.28], [0.76, 0.66], [0.82, 1.0],
      [0.76, 1.34], [0.56, 1.62], [0.36, 1.78], [0.3, 1.86], [0.33, 1.93], [0.29, 1.95], [0.25, 1.86],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const curve = new THREE.SplineCurve(pts);
    const geo = new THREE.LatheGeometry(curve.getPoints(80), 96);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

/** Small deterministic PRNG so the texture is identical on every render. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedural speckle used as a bump map to suggest iron spots in stoneware. */
function useSpeckleTexture() {
  return useMemo(() => {
    const random = mulberry32(7);
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i++) {
      const v = random() > 0.5 ? 40 : 200;
      ctx.fillStyle = `rgba(${v},${v},${v},${0.35 + random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(random() * size, random() * size, random() * 1.3 + 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }, []);
}

function useArchGeometry() {
  return useMemo(() => {
    const W = 1.55, H = 2.4, T = 0.16;
    const outer = new THREE.Shape();
    outer.moveTo(-W, 0);
    outer.lineTo(-W, H);
    outer.absarc(0, H, W, Math.PI, 0, true);
    outer.lineTo(W, 0);
    outer.lineTo(-W, 0);
    const inner = new THREE.Path();
    const w = W - T;
    inner.moveTo(-w, 0.001);
    inner.lineTo(w, 0.001);
    inner.lineTo(w, H);
    inner.absarc(0, H, w, 0, Math.PI, false);
    inner.lineTo(-w, 0.001);
    outer.holes.push(inner);
    return new THREE.ExtrudeGeometry(outer, { depth: 0.22, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 48 });
  }, []);
}

function Vessel({ glaze, animate }) {
  const group = useRef();
  const material = useRef();
  const geometry = useVesselGeometry();
  const bump = useSpeckleTexture();
  const target = useMemo(() => new THREE.Color(), []);
  const pointer = useThree((s) => s.pointer);
  const invalidate = useThree((s) => s.invalidate);

  // Reduced motion renders on demand: apply the glaze instantly and redraw once.
  useEffect(() => {
    if (animate || !material.current) return;
    const g = GLAZES[glaze] || GLAZES.bone;
    material.current.color.set(g.color);
    material.current.roughness = g.roughness;
    invalidate();
  }, [glaze, animate, invalidate]);

  useFrame((_, delta) => {
    const g = GLAZES[glaze] || GLAZES.bone;
    target.set(g.color);
    if (material.current) {
      material.current.color.lerp(target, Math.min(1, delta * 4));
      material.current.roughness += (g.roughness - material.current.roughness) * Math.min(1, delta * 4);
    }
    if (!group.current) return;
    if (animate) group.current.rotation.y += delta * 0.25;
    // Gentle parallax tilt toward the pointer.
    group.current.rotation.x += ((animate ? pointer.y * 0.08 : 0) - group.current.rotation.x) * 0.05;
    group.current.rotation.z += ((animate ? -pointer.x * 0.06 : 0) - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group} position={[0, -0.95, 0]} scale={0.82}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          ref={material}
          color={GLAZES[glaze]?.color || GLAZES.bone.color}
          roughness={0.4}
          clearcoat={0.55}
          clearcoatRoughness={0.35}
          bumpMap={bump}
          bumpScale={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Arch({ color }) {
  const geometry = useArchGeometry();
  return (
    <mesh geometry={geometry} position={[0, -1.15, -1.4]}>
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function Plinth() {
  return (
    <mesh position={[0, -1.1, 0]} receiveShadow>
      <cylinderGeometry args={[1.05, 1.05, 0.3, 64]} />
      <meshStandardMaterial color="#d9d0c1" roughness={0.9} />
    </mesh>
  );
}

function Rig({ animate }) {
  useFrame(({ camera, pointer }) => {
    if (!animate) return;
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (0.45 + pointer.y * 0.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * The hero / Glaze Lab scene. Purely procedural (no model or HDR downloads).
 * `active` pauses rendering when offscreen; `animate` is false for reduced motion.
 */
export default function VesselScene({ glaze = "bone", archColor = "#e4dccd", active = true, animate = true, onReady }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? (animate ? "always" : "demand") : "never"}
      camera={{ position: [0, 0.35, 6.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <Arch color={archColor} />
      <Plinth />
      <Vessel glaze={glaze} animate={animate} />
      <ContactShadows position={[0, -1.24, 0]} opacity={0.35} scale={6} blur={2.6} far={2} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[-3, 2, 3]} scale={[3, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[4, 1, 2]} scale={[2, 4, 1]} />
        <Lightformer form="circle" intensity={0.8} position={[0, 4, -2]} scale={3} color="#f1dfd5" />
      </Environment>
      <Rig animate={animate} />
    </Canvas>
  );
}
