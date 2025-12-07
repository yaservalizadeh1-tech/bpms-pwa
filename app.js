// کلید پابلیک VAPID (همونی که خودت ساختی)
const PUBLIC_KEY = "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";

// آدرس سرور Render
const SERVER_URL = "https://bpms-528v.onrender.com/subscribe";

// تبدیل کلید پابلیک به Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ثبت نام برای Push Notification
async function subscribeUser() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
    });

    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });

    console.log("✅ User subscribed successfully");
  } catch (err) {
    console.error("❌ Subscription failed:", err);
  }
}

// اجرای تابع
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.register("service-worker.js").then(() => {
    console.log("✅ Service Worker registered");
    subscribeUser();
  });
} else {
  console.log("❌ Push notifications not supported");
}
