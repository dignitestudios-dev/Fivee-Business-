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

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/images/logo.svg",
    data: { url: payload.fcmOptions?.link || "/" },
  };
  console.log(notificationOptions)
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
