import { Capacitor } from '@capacitor/core';

/**
 * Resuelve la URL del API según la plataforma.
 *
 * Dentro del emulador de Android, `localhost` apunta al
 * propio emulador; la máquina anfitriona se alcanza en
 * `10.0.2.2`. En un dispositivo físico reemplaza
 * `androidHost` por la IP local de la PC (ej. 192.168.1.50).
 */
export function resolveApiUrl(
  port = 3000,
  androidHost = '10.0.2.2',
): string {
  const host =
    Capacitor.getPlatform() === 'android'
      ? androidHost
      : 'localhost';

  return `http://${host}:${port}/api`;
}
