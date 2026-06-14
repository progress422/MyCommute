/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VRR_EFA_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
