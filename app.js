const PUBLIC_KEY = "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";

async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_KEY
  });

  await fetch("https://bpms-528w.onrender.com/subscribe", {
    method: "POST",
    body: JSON.stringify(sub),
    headers: {
      "Content-Type": "application/json"
    }
  });

  console.log("Subscribed to push");
}

async function init() {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  subscribeUser();
}

init();