import { Platform } from 'react-native';
import Constants from 'expo-constants';

// In Expo development on physical devices (Expo Go / standalone):
// Extract developer machine LAN IP dynamically from Expo Constants (e.g. 192.168.x.x)
const getHostIp = (): string | null => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return null;
};

const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostIp = getHostIp();
  if (hostIp) {
    return `http://${hostIp}:5000/api/v1`;
  }

  // Default LAN IP fallback for physical mobile devices
  if (Platform.OS !== 'web') {
    return 'http://192.168.1.75:5000/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

export const API_BASE_URL = getBaseUrl();

let userToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  userToken = token;
};

export const getAuthToken = () => userToken;

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    limit?: number;
    cursor?: string;
    hasMore?: boolean;
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    return data;
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: isTimeout
          ? 'Network request timed out. Please check your backend server connection.'
          : `Unable to connect to Deepsta server at ${API_BASE_URL}. Ensure your mobile device and backend host computer are connected to the same Wi-Fi network.`,
      },
    };
  }
}

