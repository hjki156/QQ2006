/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_API_KEY: string
  readonly VITE_AI_MODEL: string
  readonly VITE_AI_SYSTEM_PROMPT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
