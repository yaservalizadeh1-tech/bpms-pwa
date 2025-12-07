// دریافت Push از سرور
self.addEventListener("push", event => {
  let data = { title: "Notification", body: "You have a new message" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      // اگر JSON نبود، همون متن خام
      data = { title: "Notification", body: event.data.text() };
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "icon.png" // اگر آیکون نداری، می‌تونی حذفش کنی
    })
  );
});

// رفتار روی کلیک نوتیف
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(cList => {
      if (cList.length > 0) {
        return cList[0].focus();
      } else {
        return clients.openWindow("./");
      }
    })
  );
});
