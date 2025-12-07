const PUBLIC_KEY = "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";
const SERVER_URL = "https://bpms-push.onrender.com/subscribe";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
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

async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
  });

  await fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify(sub),
    headers: {
      "Content-Type": "application/json"
    }
  });

  console.log("✅ Push subscription sent to server");
}

async function init() {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    console.log("🔔 Notification permission:", permission);
  }

  if ("serviceWorker" in navigator && "PushManager" in window) {
    subscribeUser();
  } else {
    console.warn("❌ Push messaging is not supported");
  }
}

init();
