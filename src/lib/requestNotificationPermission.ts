import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    if (!registration) {
      console.log("Service worker registration failed");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("FCM Token:", token);
      // Send this token to your backend server via an API call to store it for sending notifications
      // Example: await fetch('/api/save-token', { method: 'POST', body: JSON.stringify({ token }) });
      return token;
    } else {
      console.log("No FCM token available");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
