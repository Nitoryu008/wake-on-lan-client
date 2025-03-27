/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MQTT_BROKER_URL: string;
  readonly VITE_MQTT_USERNAME: string;
  readonly VITE_MQTT_PASSWORD: string;
  readonly VITE_DB_API_URL: string;
  readonly VITE_DB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
