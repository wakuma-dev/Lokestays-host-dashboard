/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_ENV: string;
    readonly VITE_SHOW_ERROR_DETAILS: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}