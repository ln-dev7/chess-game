declare module "gif.js" {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    repeat?: number; // 0 = boucle infinie, -1 = pas de répétition, n = nombre de répétitions
  }

  interface FrameOptions {
    delay?: number;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      frame: HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
      options?: FrameOptions
    ): void;
    on(event: "finished", callback: (data: Blob) => void): void;
    on(event: "progress", callback: (progress: number) => void): void;
    on(event: "error", callback: (error: Error) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    render(): void;
  }

  export = GIF;
}
