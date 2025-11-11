/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: "http://localhost:5000"
  readonly VITE_OTHER_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
