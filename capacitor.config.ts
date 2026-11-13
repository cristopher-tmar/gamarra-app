import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'gamarra-app',
  webDir: 'www',
  server: {
    /*
     * Desarrollo: el API local corre por http. Con el
     * esquema https por defecto, el WebView bloquea las
     * peticiones http (mixed content) y Android 9+
     * bloquea el tráfico sin cifrar. Retirar cuando el
     * API se sirva por https.
     */
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;
