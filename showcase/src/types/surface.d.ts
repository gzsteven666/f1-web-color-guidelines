/**
 * ==================================================================
 * surface.d.ts —— 车身渲染核心模块的 TypeScript 类型声明
 * ==================================================================
 */

export interface LiveryStage {
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envIntensity: number;
}

export interface StudioStrip {
  azimuth: number;
  elevation: number;
  w: number;
  h: number;
  color: string;
  intensity: number;
}

export interface TeamPreset {
  id: string;
  name: string;
  chassis: string;
  livery: LiveryStage[];
  studio: {
    sky: string;
    horizon: string;
    ground: string;
    strips: StudioStrip[];
  };
  surface: {
    waves: Array<[number, number, number, number] | number[]>;
    crease: {
      dir: [number, number] | number[];
      period: number;
      sharpness: number;
      height: number;
    };
    parallax: number;
    sweep: [number, number] | number[];
    pointer: [number, number] | number[];
  };
  line: {
    color: string;
    tipColor: string;
    width: number;
    ghostOpacity: number;
  };
  render: {
    toneMapping: string;
    exposure: number;
    maxDpr: number;
  };
  fallback: string;
}

export declare const MERCEDES: TeamPreset;
export declare const FERRARI: TeamPreset;
export declare const MCLAREN: TeamPreset;
export declare const ASTON_MARTIN: TeamPreset;
export declare const CADILLAC: TeamPreset;
export declare const WILLIAMS: TeamPreset;

export declare const TEAM_PRESETS: {
  mercedes: TeamPreset;
  ferrari: TeamPreset;
  mclaren: TeamPreset;
  'aston-martin': TeamPreset;
  aston_martin: TeamPreset;
  cadillac: TeamPreset;
  williams: TeamPreset;
  [key: string]: TeamPreset;
};

export interface SurfacePageInstance {
  surface: any;
  line: any;
  lenis: any;
  measure: () => void;
  setPreset: (preset: TeamPreset) => void;
  destroy: () => void;
}

export interface MountSurfacePageConfig {
  canvas: HTMLCanvasElement | null;
  svg: SVGSVGElement | null;
  preset: TeamPreset;
  seams?: Element[];
  smooth?: boolean;
  onFallback?: (() => void) | null;
}

export declare function mountSurfacePage(config: MountSurfacePageConfig): SurfacePageInstance;
