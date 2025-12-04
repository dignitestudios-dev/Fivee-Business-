importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC7lJjx-WZTNyERhcj8Nwa-x7vkpnZKsd0",
  authDomain: "fivee-business.firebaseapp.com",
  projectId: "fivee-business",
  storageBucket: "fivee-business.firebasestorage.app",
  messagingSenderId: "903788401943",
  appId: "1:903788401943:web:feff5bd51b8b2f854d1352",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ------------------------------------------------
// FIX: HANDLE ALL NOTIFICATIONS MANUALLY
// Even if backend sends notification payload
// ------------------------------------------------
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  // Extract from notification or data (support both)
  const title =
    payload.notification?.title || payload.data?.title || "New Notification";

  const body = payload.notification?.body || payload.data?.body || "";

  // Always use your custom icon
  const icon =
    payload.notification?.icon || payload.data?.icon || "/images/logo.svg";

  // Click URL
  const url = payload.fcmOptions?.link || payload.data?.link || "/";

  // IMPORTANT: Override Firebase auto-display
  // by ALWAYS showing your own notification
  self.registration.showNotification(title, {
    body,
    icon,
    data: { url },
  });
});

// ------------------------------------------------
// Handle clicks
// ------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
