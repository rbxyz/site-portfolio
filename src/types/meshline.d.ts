import type { ThreeElement } from "@react-three/fiber";
import type { MeshLineGeometry, MeshLineMaterial } from "meshline";

// meshline classes are registered with R3F via `extend()` in the lanyard
// component; this makes <meshLineGeometry /> / <meshLineMaterial /> typed JSX.
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    // Constructor params are optional at runtime, so `args` is too.
    meshLineMaterial: Partial<ThreeElement<typeof MeshLineMaterial>>;
  }
}
