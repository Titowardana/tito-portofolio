'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier';
import { extend } from '@react-three/fiber';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });
import * as THREE from 'three';

export interface LanyardProps {
  position?:     [number, number, number];
  gravity?:      [number, number, number];
  fov?:          number;
  frontImage?:   string | null;
  backImage?:    string | null;
  imageFit?:     'cover' | 'contain';
  isLight?:      boolean;
  onContextLost?: () => void;
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

const CARD_GLB     = '/models/card.glb';
const ROPE_TEX     = '/models/lanyard.png';
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT  = { x: 0.5, y: 0, w: 0.5, h: 0.757 };
const BLANK_PIXEL  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function Band({
  numSegments = 50,
  frontImage  = null,
  backImage   = null,
  imageFit    = 'cover',
  isMobile    = false,
}: {
  numSegments?: number;
  frontImage?:  string | null;
  backImage?:   string | null;
  imageFit?:    'cover' | 'contain';
  isMobile?:    boolean;
}) {
  const fixed = useRef<RapierRigidBody>(null!);
  const j1    = useRef<LanyardRigidBody>(null!);
  const j2    = useRef<LanyardRigidBody>(null!);
  const j3    = useRef<RapierRigidBody>(null!);
  const card  = useRef<RapierRigidBody>(null!);

  const band  = useRef<MeshLineGeometry>(null!);
  const vec   = useMemo(() => new THREE.Vector3(), []);
  const dir   = useMemo(() => new THREE.Vector3(), []);

  const cardScale   = isMobile ? 6.5 : 5.8;
  const visualY     = 1.45 - 1.178 * cardScale;

  const segmentProps: RigidBodyProps = {
    type:           'dynamic',
    canSleep:       true,
    colliders:      false,
    angularDamping: 4,
    linearDamping:  4,
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation());
    return body.lerped;
  };

  const gltf    = useGLTF(CARD_GLB);
  const cardNode  = gltf.nodes.card  as THREE.Mesh;
  const clipNode  = gltf.nodes.clip  as THREE.Mesh;
  const clampNode = gltf.nodes.clamp as THREE.Mesh;

  const baseMaterial  = gltf.materials.base  as THREE.MeshStandardMaterial;
  const metalMaterial = gltf.materials.metal as THREE.MeshStandardMaterial;

  const ropeTex = useTexture(ROPE_TEX);
  const frontTex  = useTexture(frontImage || BLANK_PIXEL);
  const backTex   = useTexture(backImage  || BLANK_PIXEL);

  const cardMap = useMemo(() => {
    const baseMap = baseMaterial?.map as THREE.Texture | undefined;

    if (!baseMap?.image || !frontTex?.image) {
      return baseMap ?? null;
    }

    const baseImg = baseMap.image as HTMLImageElement;
    if (!baseImg.width || !baseImg.height) {
      return baseMap;
    }

    const W = baseImg.width;
    const H = baseImg.height;

    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width  = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    const drawFitted = (img: CanvasImageSource, rect: { x: number; y: number; w: number; h: number }) => {
      const rx = rect.x * canvas.width;
      const ry = rect.y * canvas.height;
      const rw = rect.w * canvas.width;
      const rh = rect.h * canvas.height;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / (img as HTMLImageElement).width, rh / (img as HTMLImageElement).height);
      const dw = (img as HTMLImageElement).width  * scale;
      const dh = (img as HTMLImageElement).height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontTex?.image) {
      drawFitted(frontTex.image as HTMLImageElement, FRONT_UV_RECT);
    }
    if (backTex?.image && backImage) {
      drawFitted(backTex.image as HTMLImageElement, BACK_UV_RECT);
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace  = THREE.SRGBColorSpace;
    composite.flipY       = baseMap.flipY;
    composite.anisotropy  = 16;
    composite.needsUpdate = true;
    return composite;
  }, [backImage, imageFit, frontTex, backTex, baseMaterial]);

  useEffect(() => {
    return () => {
      if (cardMap instanceof THREE.CanvasTexture) {
        cardMap.dispose();
      }
    };
  }, [cardMap]);

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = 'chordal';
    return c;
  });

  const [dragged, drag]  = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j1,  j2, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j2,  j3, [[0, 0, 0], [0, 0, 0], 0.6]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
    return () => {};
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped      = getLerped(ref.current);
        const clampedDist = Math.max(0.1, Math.min(0.6, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (clampedDist * 50));
      });

      const pFixed = fixed.current.translation();
      const p1     = j1.current.translation();
      const p2     = j2.current.translation();
      const p3     = j3.current.translation();

      curve.points[0].set(pFixed.x, pFixed.y, pFixed.z);
      curve.points[1].set(p1.x, p1.y, p1.z);
      curve.points[2].set(p2.x, p2.y, p2.z);
      curve.points[3].set(p3.x, p3.y, p3.z);

      if (band.current) {
        const points = curve.getPoints(numSegments);
        band.current.setPoints(points);
      }

      const ang = card.current.angvel();
      const rot = card.current.rotation();
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      <group position={[0, 5, 0]}>
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
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={cardScale}
            position={[0, visualY, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={cardNode.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                side={THREE.DoubleSide}
                clearcoat={1}
                clearcoatRoughness={0.12}
                roughness={0.72}
                metalness={0.18}
              />
            </mesh>
            {clipNode && <mesh geometry={clipNode.geometry} material={metalMaterial} />}
            {clampNode && <mesh geometry={clampNode.geometry} material={metalMaterial} />}
          </group>
        </RigidBody>
      </group>

      <mesh>
        <meshLineGeometry ref={band} />
        <meshLineMaterial
          map={ropeTex}
          useMap
          color="#aeb8c6"
          opacity={0.8}
          transparent
          lineWidth={0.08}
        />
      </mesh>
    </>
  );
}

export default function Lanyard({
  gravity       = [0, -40, 0],
  fov           = 38,
  frontImage    = null,
  backImage     = null,
  imageFit      = 'cover',
  isLight       = false,
  onContextLost = undefined,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const camPos: [number, number, number] = isMobile ? [0, 0, 16] : [0, 0, 22];
  const timeStep      = isMobile ? 1 / 30 : 1 / 60;
  const maxDpr        = isMobile ? 2 : 2;

  return (
    <div className="lanyard-wrapper relative z-0 h-full w-full">
      <Canvas
        camera={{ position: camPos, fov, near: 0.1, far: 100 }}
        dpr={[1, maxDpr]}
        gl={{
          alpha:           true,
          antialias:       !isMobile,
          powerPreference: 'high-performance',
          depth:           true,
          stencil:         false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(isLight ? new THREE.Color(0xeef1f6) : new THREE.Color(0x0c1324), 0);
          gl.domElement.style.background = 'transparent';
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onContextLost?.();
          });
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={Math.PI} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <directionalLight position={[-3, 8, -5]} intensity={0.8} />

        <Physics gravity={gravity} timeStep={timeStep}>
          <Band
            numSegments={50}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            isMobile={isMobile}
          />
        </Physics>
      </Canvas>
    </div>
  );
}
