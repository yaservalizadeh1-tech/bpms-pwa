const PUBLIC_KEY = "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";
const SERVER_URL = "https://bpms-528v.onrender.com/subscribe";

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: PUBLIC_KEY
  });

  await fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify(subscription)
  });

  console.log("✅ User subscribed");
}

subscribeUser();
