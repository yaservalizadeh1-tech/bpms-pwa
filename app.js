// کلید پابلیک VAPID (همونی که ساختی)
const PUBLIC_KEY =
  "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";

// آدرس سرور Render (همینی که لاگ‌ها گفتن)
const SERVER_URL = "https://bpms-528v.onrender.com/subscribe";

const statusEl = document.getElementById("status");

// تبدیل کلید پابلیک به Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

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
    statusEl.textContent = "اتصال به سرور Push برقرار شد ✅";
  } catch (err) {
    console.error("❌ Subscription failed:", err);
    statusEl.textContent = "اشکال در اتصال به سرور Push ❌";
  }
}

// اجرای اولیه
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => {
      console.log("✅ Service Worker registered");
      subscribeUser();
    })
    .catch(err => {
      console.error("❌ Service Worker registration failed:", err);
      statusEl.textContent = "ثبت Service Worker ناموفق بود ❌";
    });
} else {
  console.log("❌ Push notifications not supported");
  statusEl.textContent = "مرورگر شما Push Notification را پشتیبانی نمی‌کند ❌";
}
