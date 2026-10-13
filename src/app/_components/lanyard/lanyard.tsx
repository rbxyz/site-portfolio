"use client";

/* eslint-disable react/no-unknown-property */
// Adapted from React Bits <Lanyard /> (https://reactbits.dev): a single canvas
// with several badges hanging side by side, one per event. Card faces and the
// band texture are drawn at runtime on <canvas> using the portfolio palette,
// so adding an event only requires a new entry in `eventos-data.ts`.
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  interactionGroups,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

import { C } from "@/app/_components/portfolio/tokens";
import type { Evento } from "@/app/_components/portfolio/eventos-data";

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = "/lanyard/card.glb";
useGLTF.preload(CARD_GLB);

const FOV = 20;

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

type Fonts = { anton: string; grotesk: string; mono: string };

type CardGLTF = {
  nodes: Record<"card" | "clip" | "clamp", THREE.Mesh>;
  materials: Record<"base" | "metal", THREE.MeshStandardMaterial>;
};

type JointBody = RapierRigidBody & { lerped?: THREE.Vector3 };

/** Resolve the next/font family names behind the CSS variables. */
function readFonts(): Fonts {
  const cs = getComputedStyle(document.body);
  const get = (v: string, fb: string) => cs.getPropertyValue(v).trim() || fb;
  return {
    anton: get("--font-anton", "Impact, sans-serif"),
    grotesk: get("--font-grotesk", "sans-serif"),
    mono: get("--font-mono-sp", "monospace"),
  };
}

export default function Lanyard({ events, active = true }: { events: Evento[]; active?: boolean }) {
  const [fonts, setFonts] = useState<Fonts | null>(null);

  // Canvas text needs the web fonts loaded before textures are painted.
  useEffect(() => {
    let alive = true;
    const f = readFonts();
    void Promise.all([
      document.fonts.load(`40px ${f.anton}`),
      document.fonts.load(`600 40px ${f.grotesk}`),
      document.fonts.load(`700 40px ${f.mono}`),
    ])
      .catch(() => undefined)
      .then(() => alive && setFonts(f));
    return () => {
      alive = false;
    };
  }, []);

  if (!fonts) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: FOV }}
      dpr={[1, 2]}
      gl={{ alpha: true }}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={Math.PI} />
      <Scene events={events} fonts={fonts} active={active} />
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

/**
 * Lays the badges out across the canvas and frames the camera so they all fit.
 * On narrow screens badges alternate between a short and a long rope so they
 * can sit closer together without overlapping.
 */
function Scene({ events, fonts, active }: { events: Evento[]; fonts: Fonts; active: boolean }) {
  const { size, camera } = useThree();
  const isMobile = size.width < 768;
  const n = events.length;

  const layout = useMemo(() => {
    const spacing = isMobile ? 1.1 : 3.1;
    const span = (n - 1) * spacing + 2.6;
    const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180);
    const aspect = size.width / Math.max(size.height, 1);
    const z = Math.max(isMobile ? 26 : 21, span / (2 * tanHalf * aspect));
    const halfH = z * tanHalf;
    return {
      // Anchors sit just above the top edge so the bands enter from off-screen.
      camY: -0.3 - halfH,
      z,
      bands: events.map((ev, i) => ({
        ev,
        x: (i - (n - 1) / 2) * spacing,
        ropeLen: isMobile ? (i % 2 ? 2.1 : 1) : [1, 1.12, 0.94, 1.06][i % 4]!,
      })),
    };
  }, [events, n, isMobile, size.width, size.height]);

  useEffect(() => {
    camera.position.set(0, layout.camY, layout.z);
    camera.updateProjectionMatrix();
  }, [camera, layout]);

  const bandTexture = useMemo(() => makeBandTexture(fonts), [fonts]);

  return (
    // Remount physics when switching between the mobile and desktop layouts.
    <Physics key={isMobile ? "m" : "d"} gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60} paused={!active}>
      {layout.bands.map((b, i) => (
        <Band
          key={b.ev.id}
          event={b.ev}
          index={i}
          x={b.x}
          ropeLen={b.ropeLen}
          fonts={fonts}
          bandTexture={bandTexture}
          isMobile={isMobile}
        />
      ))}
    </Physics>
  );
}

function Band({
  event,
  index,
  x,
  ropeLen,
  fonts,
  bandTexture,
  isMobile,
  maxSpeed = 50,
  minSpeed = 0,
}: {
  event: Evento;
  index: number;
  x: number;
  ropeLen: number;
  fonts: Fonts;
  bandTexture: THREE.Texture;
  isMobile: boolean;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null!);
  const fixed = useRef<JointBody>(null!);
  const j1 = useRef<JointBody>(null!);
  const j2 = useRef<JointBody>(null!);
  const j3 = useRef<JointBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const [vec] = useState(() => new THREE.Vector3());
  const [ang] = useState(() => new THREE.Vector3());
  const [rot] = useState(() => new THREE.Vector3());
  const [dir] = useState(() => new THREE.Vector3());

  // Each badge only collides with itself, so neighbouring ropes can cross.
  const group = interactionGroups(index % 16, [index % 16]);
  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
    collisionGroups: group,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as CardGLTF;

  const cardMap = useMemo(
    () => makeCardTexture(materials.base.map!, event, index, fonts),
    [materials.base.map, event, index, fonts],
  );
  useEffect(() => () => cardMap.dispose(), [cardMap]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLen]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLen]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLen]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      // Project the pointer onto the z = 0 plane the badges live on.
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.copy(state.camera.position).add(dir.multiplyScalar(-state.camera.position.z / dir.z));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((ref) => {
        const body = ref.current;
        body.lerped ??= new THREE.Vector3().copy(body.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())));
        body.lerped.lerp(body.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0]!.copy(j3.current.translation());
      curve.points[1]!.copy(j2.current.lerped!);
      curve.points[2]!.copy(j1.current.lerped!);
      curve.points[3]!.copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      <group position={[x, 0, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? new THREE.Vector2(1000, 2000) : new THREE.Vector2(1000, 1000)}
          useMap={1}
          map={bandTexture}
          repeat={new THREE.Vector2(-4, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Runtime textures (portfolio palette)                                */
/* ------------------------------------------------------------------ */

/** Repeating band texture: deep purple strap with the name in accent. */
function makeBandTexture(fonts: Fonts): THREE.Texture {
  const W = 1024;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = C.brandDeep;
  ctx.fillRect(0, 0, W, H);
  // edge stitching
  ctx.fillStyle = C.accent;
  ctx.fillRect(0, 18, W, 8);
  ctx.fillRect(0, H - 26, W, 8);

  // The band repeats with a negative U, so the text is drawn mirrored to read
  // correctly once it's on the strap.
  ctx.save();
  ctx.translate(W, 0);
  ctx.scale(-1, 1);
  ctx.textBaseline = "middle";
  ctx.font = `700 64px ${fonts.mono}`;
  ctx.fillStyle = C.text;
  ctx.fillText("RUAN BUENO", 40, H / 2 + 4);
  ctx.fillStyle = C.accent;
  ctx.fillText("✦", W - 110, H / 2 + 4);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 16;
  return tex;
}

/**
 * Copy the card's baked atlas (keeps the edges) and paint this event's front
 * and back faces into their UV regions.
 */
function makeCardTexture(baseMap: THREE.Texture, ev: Evento, index: number, fonts: Fonts): THREE.Texture {
  const baseImg = baseMap.image as CanvasImageSource & { width: number; height: number };
  const W = baseImg.width;
  const H = baseImg.height;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(baseImg, 0, 0, W, H);

  const rect = (r: typeof FRONT_UV_RECT) => ({ x: r.x * W, y: r.y * H, w: r.w * W, h: r.h * H });
  drawFront(ctx, rect(FRONT_UV_RECT), ev, index, fonts);
  drawBack(ctx, rect(BACK_UV_RECT), ev, fonts);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = baseMap.flipY;
  tex.anisotropy = 16;
  return tex;
}

type Rect = { x: number; y: number; w: number; h: number };

function drawFront(ctx: CanvasRenderingContext2D, r: Rect, ev: Evento, index: number, fonts: Fonts) {
  const hl = !!ev.highlight;
  const u = r.w / 100; // 1 unit = 1% of the face width
  const pad = 9 * u;

  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.translate(r.x, r.y);

  // background
  if (hl) {
    const g = ctx.createLinearGradient(0, 0, r.w, r.h);
    g.addColorStop(0, C.accent);
    g.addColorStop(1, C.brandDeep);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = C.bg;
  }
  ctx.fillRect(0, 0, r.w, r.h);
  const glow = ctx.createRadialGradient(r.w * 0.85, r.h * 0.05, 0, r.w * 0.85, r.h * 0.05, r.w * 1.1);
  glow.addColorStop(0, hl ? "rgba(244,242,236,.22)" : "rgba(139,92,246,.35)");
  glow.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, r.w, r.h);

  // ghost number
  ctx.font = `${62 * u}px ${fonts.anton}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = hl ? "rgba(244,242,236,.12)" : "rgba(244,242,236,.05)";
  ctx.fillText(String(index + 1).padStart(2, "0"), r.w - 4 * u, r.h - 20 * u);

  // top kicker
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `700 ${4.6 * u}px ${fonts.mono}`;
  ctx.fillStyle = hl ? C.text : C.accent;
  ctx.fillText(`EVENTO · ${String(index + 1).padStart(2, "0")}`, pad, 22 * u);

  // name (Anton, one word per line, shrunk to fit)
  const words = ev.name.toUpperCase().split(/\s+/);
  let size = 26 * u;
  ctx.font = `${size}px ${fonts.anton}`;
  const widest = Math.max(...words.map((w) => ctx.measureText(w).width));
  if (widest > r.w - pad * 2) size *= (r.w - pad * 2) / widest;
  ctx.font = `${size}px ${fonts.anton}`;
  ctx.fillStyle = C.text;
  let y = 32 * u;
  for (const w of words) {
    ctx.fillText(w, pad, y);
    y += size * 0.98;
  }

  // edition
  if (ev.edition) {
    y += 3 * u;
    ctx.font = `600 ${7.5 * u}px ${fonts.grotesk}`;
    ctx.fillStyle = hl ? C.text : C.accent;
    ctx.fillText(ev.edition, pad, y);
  }

  // role pill
  const role = (hl ? "★ " : "") + ev.role.toUpperCase();
  ctx.font = `700 ${5 * u}px ${fonts.mono}`;
  const pillW = ctx.measureText(role).width + 8 * u;
  const pillH = 11 * u;
  const pillY = r.h - 36 * u;
  ctx.beginPath();
  ctx.roundRect(pad, pillY, pillW, pillH, 1.5 * u);
  if (hl) {
    ctx.fillStyle = C.text;
    ctx.fill();
    ctx.fillStyle = C.brandDeep;
  } else {
    ctx.strokeStyle = C.border3;
    ctx.lineWidth = 0.8 * u;
    ctx.stroke();
    ctx.fillStyle = C.textMuted;
  }
  ctx.textBaseline = "middle";
  ctx.fillText(role, pad + 4 * u, pillY + pillH / 2 + 0.3 * u);

  // footer
  ctx.fillStyle = hl ? "rgba(244,242,236,.35)" : C.border3;
  ctx.fillRect(pad, r.h - 18 * u, r.w - pad * 2, 0.5 * u);
  ctx.font = `700 ${4.4 * u}px ${fonts.mono}`;
  ctx.textBaseline = "top";
  ctx.fillStyle = C.text;
  ctx.fillText("RUAN BUENO", pad, r.h - 13 * u);
  const nameW = ctx.measureText("RUAN BUENO").width;
  ctx.fillStyle = hl ? C.text : C.accent;
  ctx.fillText(".", pad + nameW, r.h - 13 * u);
  if (ev.year) {
    ctx.textAlign = "right";
    ctx.fillStyle = hl ? C.text : C.textSecondary;
    ctx.fillText(ev.year, r.w - pad, r.h - 13 * u);
  }

  ctx.restore();
}

function drawBack(ctx: CanvasRenderingContext2D, r: Rect, ev: Evento, fonts: Fonts) {
  const u = r.w / 100;

  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.translate(r.x, r.y);

  ctx.fillStyle = C.brandDeep;
  ctx.fillRect(0, 0, r.w, r.h);
  const glow = ctx.createRadialGradient(r.w / 2, r.h / 2, 0, r.w / 2, r.h / 2, r.w * 0.9);
  glow.addColorStop(0, "rgba(139,92,246,.45)");
  glow.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, r.w, r.h);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${48 * u}px ${fonts.anton}`;
  ctx.fillStyle = C.text;
  ctx.fillText("RB", r.w / 2 - 3 * u, r.h * 0.5);
  ctx.fillStyle = C.accent;
  ctx.fillText(".", r.w / 2 + 22 * u, r.h * 0.5);

  ctx.font = `700 ${4.2 * u}px ${fonts.mono}`;
  ctx.fillStyle = C.textMuted2;
  ctx.fillText("FULL-STACK · IA · GROWTH", r.w / 2, r.h * 0.5 + 32 * u);
  ctx.fillStyle = C.accent;
  ctx.fillText(ev.name.toUpperCase(), r.w / 2, r.h - 14 * u);

  ctx.restore();
}
