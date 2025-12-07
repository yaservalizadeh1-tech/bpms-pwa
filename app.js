import http from "http";
import fetch from "node-fetch";
import webpush from "web-push";

// کلیدهای VAPID تو
const VAPID_PUBLIC = "BF7omY3Yjy4wiyhChKcbpCGGfVJQJbE4LEqKTnstG1gHgtd9ccLDpSypV-FTuMBWCiZj1VnQptBQsnPYzDDvmAs";
const VAPID_PRIVATE = "lQ2X4F8mnflnKEsY7kAiDRghHpUiWWLHtaNi7u8PLe0"; // اینو باید از خودت بگیرم یا جایگزین کنی

// اطلاعات ورود به BPMS
const BPMS_USER = "920334276";
const BPMS_PASS = "0019408439";

webpush.setVapidDetails(
  "mailto:example@example.com",
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

let lastTicketId = null;
let subscribers = [];
let authCookie = null;

async function loginToBPMS() {
  try {
    const res = await fetch("https://bizagiback.okcs.com/api/Account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: BPMS_USER,
        password: BPMS_PASS
      })
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie && setCookie.includes(".ASPXAUTH")) {
      authCookie = setCookie.split(";")[0];
      console.log("✅ Logged in to BPMS");
    } else {
      console.log("❌ Login failed: no auth cookie");
    }
  } catch (err) {
    console.log("❌ Login error:", err);
  }
}

async function checkTickets() {
  if (!authCookie) {
    await loginToBPMS();
    if (!authCookie) return;
  }

  try {
    const res = await fetch("https://bpms.okcs.com/Rest/Inbox/FullSummary?taskState=all", {
      headers: {
        "Cookie": authCookie
      }
    });

    const data = await res.json();
    const latest = data[0];
    const currentId = latest.taskId || latest.id || latest.caseId;

    if (lastTicketId === null) {
      lastTicketId = currentId;
      return;
    }

    if (currentId !== lastTicketId) {
      lastTicketId = currentId;
      sendPush("تیکت جدید", latest.taskName || "یک تیکت جدید ثبت شد");
    }
  } catch (err) {
    console.log("❌ Error checking tickets:", err);
    authCookie = null;
  }
}

function sendPush(title, body) {
  subscribers.forEach(sub => {
    webpush.sendNotification(sub, JSON.stringify({ title, body }))
      .catch(err => console.log("Push error:", err));
  });
}

setInterval(checkTickets, 30000);

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/subscribe") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const sub = JSON.parse(body);
      subscribers.push(sub);
      res.writeHead(201);
      res.end("✅ Subscribed");
    });
  } else {
    res.writeHead(200);
    res.end("BPMS Push Server Running");
  }
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
