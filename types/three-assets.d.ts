import * as THREE from 'three';

// Allow importing .glb files as URL strings via Next.js static assets
declare module '*.glb' {
  const src: string;
  export default src;
}

// meshline custom JSX elements
declare module 'meshline' {
  export class MeshLineGeometry extends THREE.BufferGeometry {
    setPoints(points: THREE.Vector3[] | number[], updateBoundingSphere?: () => void): void;
  }
  export class MeshLineMaterial extends THREE.ShaderMaterial {
    lineWidth: number;
    color: THREE.Color;
    resolution: THREE.Vector2;
    sizeAttenuation: number;
    dashArray: number;
    dashOffset: number;
    dashRatio: number;
    useMap: number | boolean;
    map: THREE.Texture | null;
    repeat: THREE.Vector2;
    depthTest: boolean;
    depthWrite: boolean;
    transparent: boolean;
    opacity: number;
  }
}

// R3F JSX element types for meshline
import type { Object3DNode, MaterialNode } from '@react-three/fiber';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}
