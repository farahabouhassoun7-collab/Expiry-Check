import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Dynamically resolves the API Server URL.
 * 
 * In development (Expo Go):
 *   Determines the local IP address of the developer's computer via expo-constants.
 *   This enables seamless connection from physical devices and emulators.
 * 
 * In production/release builds:
 *   Falls back to standard localhost or a production server URL.
 */
function getApiBaseUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5129`;
  }
  
  // Fallbacks for emulators/local hosts
  return Platform.select({
    android: 'http://10.0.2.2:5129',
    ios: 'http://localhost:5129',
    default: 'http://localhost:5129',
  });
}

export const API_BASE_URL = getApiBaseUrl();
