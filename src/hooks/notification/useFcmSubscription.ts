import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios"; // You can replace this with fetch if preferred
import { messaging } from "@/lib/firebase";
import { BASE_URL } from "@/lib/services";
import { storage } from "@/utils/helper";

// Replace with your VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web configuration
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

export const useFcmSubscription = () => {
  useEffect(() => {
    const subscribeToFcm = async () => {
      // Initialize Firebase app

      try {
        console.log("Subscribing to FCM...");
        // Request notification permission
        const permission = await Notification.requestPermission();
        console.log("Notification permission status: ", permission);
        if (permission !== "granted") {
          console.log("Notification permission not granted");
          return;
        }
        console.log("Calling getToken...");
        // Generate FCM token
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        console.log("FCM Token:", currentToken);
        if (!currentToken) {
          console.log("No FCM token available");
          return;
        }

        storage.set("fcmToken", currentToken);

        // Send the token to your backend API
        // Assuming you have an auth token stored (e.g., in localStorage after login)
        // Adjust the auth mechanism as per your app's setup (e.g., use cookies or a context provider)
        const authToken = storage.get("authToken");
        if (!authToken) {
          console.log("No auth token available");
          return;
        }

        await axios.post(
          `${BASE_URL}/subscribe`,
          { fcmToken: currentToken },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("FCM token sent to backend successfully");
      } catch (error) {
        console.error("Error subscribing to FCM:", error);
      }
    };

    // Run the subscription logic once on mount
    subscribeToFcm();
  }, []);
};
