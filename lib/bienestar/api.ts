import { QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

import { env } from "@/lib/bienestar/env";

/**
 * Creates a function that gets data from the API endpoint.
 * @param config - The configuration for the axios request.
 * @returns The function that gets data from the API endpoint.
 */
export function getApi<T>(
  config?: AxiosRequestConfig
): (context: QueryFunctionContext) => Promise<T> {
  return async ({ queryKey: [key, ..._] }) => {
    const { data } = await axios.get<T>(buildUrl(key as string), config);
    return data;
  };
}

/**
 * Creates a function that posts data to the API endpoint.
 * @param key  - The resource key for the API endpoint.
 * @param config - The configuration for the axios request.
 * @returns The function that posts data to the API endpoint.
 */
export function postApi<Body, T>(
  key: string,
  config?: AxiosRequestConfig
): (body: Body) => Promise<T> {
  return async (body: Body) => {
    const { data } = await axios.post<T>(buildUrl(key), body, config);
    return data;
  };
}

/**
 * Builds the URL for the media endpoint.
 * @param url - The relative URL for the media endpoint.
 * @returns The absolute URL for the media endpoint.
 */
export function buildMediaUrl(url: string | undefined | null) {
  if (!url) return "https://via.placeholder.com/600x400?text=No+Image";

  if (url.startsWith('http')) return url;

  const server = env.SERVER.replace(/\/$/, "");
  const relativePath = url.startsWith("/") ? url : `/${url}`;

  return `${server}${relativePath}`;
}

/**
 * Checks whether a given media URL or path corresponds to a video file.
 */
export function isVideoMedia(url: string | undefined | null): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.m4v', '.webm', '.mkv', '.3gp', '.flv'];
  return videoExtensions.some((ext) => cleanUrl.endsWith(ext)) || cleanUrl.includes('/video/') || cleanUrl.includes('video_');
}

/**
 * Builds the URL for the API endpoint.
 * @param key - The resource key for the API endpoint.
 * @param populate - Whether to add the deep populate parameter (default: true).
 * @returns The URL for the API endpoint.
 */
export function buildUrl(key: string, populate: boolean = true) {
  const baseUrl = `${env.API}/${key}`;
  if (!populate) return baseUrl;

  // Para listas simples (noticias, eventos, avisos), usar populate=* para respuesta ultrarrápida
  const simpleKeys = ['news', 'events', 'reminders', 'notification-tokens', 'users'];
  if (simpleKeys.some((k) => key.startsWith(k))) {
    return `${baseUrl}?populate=*`;
  }

  // pLevel es para páginas con zonas dinámicas complejas (home, welfare, action-lines)
  return `${baseUrl}?pLevel`;
}
