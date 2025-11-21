"use client";

import { useEffect } from "react";
import axios from "axios"; // Or use fetch
import { requestNotificationPermission } from "@/lib/requestNotificationPermission";
import { BASE_URL } from "@/lib/services";
import { storage } from "@/utils/helper";

export const useFcmSubscription = () => {
  useEffect(() => {
    const subscribeToFcm = async () => {
      try {
        const currentToken = await requestNotificationPermission();

        console.log("FCM Token:", currentToken);
        if (!currentToken) {
          console.log("No FCM token available");
          return;
        }

        storage.set("fcmToken", currentToken);

        const accessToken = storage.get("accessToken");
        if (!accessToken) {
          console.log("No auth token available");
          return;
        }

        await axios.post(
          `${BASE_URL}notification/subscribe`,
          { fcmToken: currentToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("FCM token sent to backend successfully");
      } catch (error) {
        console.error("Error subscribing to FCM:", error);
        // Optional: Add UI feedback here
      }
    };

    subscribeToFcm();
  }, []);
};
