import axios from 'axios';

import { DEFAULT_BASE_URL, REQUEST_TIMEOUT } from '@/constants/config';

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBaseUrl = (): string => api.defaults.baseURL ?? '';

export const setBaseUrl = (url: string): void => {
  api.defaults.baseURL = url.trim().replace(/\/+$/, '');
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'El servidor tardó demasiado en responder. Intenta de nuevo.';
    }
    if (error.response) {
      return error.response.status === 404
        ? 'No se encontró el recurso solicitado (error 404).'
        : `El servidor respondió con un error (${error.response.status}).`;
    }
    return 'No se pudo conectar con el servidor. Revisa tu conexión y la URL de la API.';
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
};
