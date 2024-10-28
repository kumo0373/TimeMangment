const CACHE_NAME = 'my-cache-v1'; // قم بتحديث رقم النسخة عند تغييرات كبيرة
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/pomodoro.html',  // ملف الخدمة الأولى
  '/pomodoro.css',  // ملف الخدمة الثانية
  '/pomodoro.js',
  '/statistics.html',
  '/statistics.css',
  '/statistics.js',
  '/tasks.html',
  '/tasks.css',
  '/tasks.js',
  '/weekly_schedule.html',
  '/weekly_schedule.css',
  '/weekly_schedule.js',  // ملف الخدمة الثالثة
  // أضف المزيد من الملفات حسب الحاجة
];

// حدث التثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// حدث التفعيل
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// تحديث عملية جلب البيانات
self.addEventListener('fetch', (event) => {
  event.respondWith(
      (async () => {
          try {
              // حاول جلب البيانات من الشبكة
              const response = await fetch(event.request);

              // تحقق من صحة الاستجابة
              if (!response || response.status !== 200) {
                  throw new Error('Network response was not ok.');
              }

              // نسخ الاستجابة لحفظها في الـ cache
              const responseClone = response.clone(); 
              const cache = await caches.open('my-cache');
              cache.put(event.request, responseClone);

              return response; // إرجاع الاستجابة الأصلية
          } catch (error) {
              // إذا فشل في جلب البيانات من الشبكة، حاول الحصول عليها من الـ cache
              const cacheResponse = await caches.match(event.request);
              return cacheResponse || new Response('لا توجد بيانات متاحة.'); // إرجاع رسالة بديلة إذا لم يكن هناك استجابة من الـ cache
          }
      })()
  );
});
