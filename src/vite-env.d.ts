/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_OAUTH_CLIENT_ID: string
  readonly VITE_SERVER_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
