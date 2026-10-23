/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_INQUIRY_ENDPOINT?: string;
  readonly VITE_CONTRACT_API_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
