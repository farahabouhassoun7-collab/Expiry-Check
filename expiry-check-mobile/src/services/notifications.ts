import { Platform } from 'react-native';

export interface ExpiryNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
}

/**
 * Service for managing local and push expiry alerts on mobile devices.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return null;

    // Optional dynamic import for expo-notifications if available
    // @ts-ignore
    const Notifications = await import('expo-notifications').catch(() => null);
    if (!Notifications) return null;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (err) {
    console.warn('Notifications registration notice:', err);
    return null;
  }
}

/**
 * Schedule a local notification alert for an expiring inventory batch.
 */
export async function scheduleExpiryAlertNotification(
  productName: string,
  batchNumber: string,
  daysRemaining: number
) {
  try {
    if (Platform.OS === 'web') return;

    // @ts-ignore
    const Notifications = await import('expo-notifications').catch(() => null);
    if (!Notifications) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ Expiry Alert: ${productName}`,
        body: `Batch ${batchNumber} is expiring in ${daysRemaining} days!`,
        sound: true,
        data: { productName, batchNumber, daysRemaining },
      },
      trigger: null, // trigger immediately
    });
  } catch (err) {
    console.warn('Local notification notice:', err);
  }
}
