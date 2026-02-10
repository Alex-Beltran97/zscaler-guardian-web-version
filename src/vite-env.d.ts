/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOCK_MINUTES: number;
  readonly VITE_CLOCK_SECONDS: number;
  readonly VITE_CLOCK_MINUTES_LIMITS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}