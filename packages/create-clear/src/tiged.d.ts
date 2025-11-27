declare module 'tiged' {
  interface TigedOptions {
    disableCache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: 'tar' | 'git';
  }

  interface TigedEmitter {
    on(event: string, callback: (info: any) => void): void;
    clone(dest: string): Promise<void>;
  }

  function tiged(repo: string, options?: TigedOptions): TigedEmitter;

  export default tiged;
}
