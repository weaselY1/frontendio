var CACHE_NAME = "gih-cache";
var CACHED_URLS = [
  "/index-offline.html",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
  "/css/gih-offline.css",
  "/img/jumbo-background-sm.jpg",
  "/img/logo-header.png"
];

self.addEventListener("install", function(event) {
  // Cache everything in CACHED_URLS. Installation fails if anything fails to cache
  // event waitUntil ใช้ขยายเวลาจนกว่า promise จะถูก resolved
  // ซึ่งในตัวอย่างนี้คือจนกว่า cache จะถูก store สำเร็จนั้สำเร็จนั้สำเร็จนั้สำเร็จนั้นเอง
  // ใช้ event waitUntil คอยจน cache สำเร็จแล้วจึงปิด event install ของ serviceworker นั้นเอง
  event.waitUntil(
    //  caches open ใช้ตั้ง่ชื่อของ cache object
    // ถ้าหา cache object ตามชื่อที่ระบุไม่เจอ ก็จะสร้างใหม่แล้วจึง open
    // caches open นั้นเป็น promise ดังนั้นสามารถตามด้วย then และ resolve ของมันคือ cache object ตามชื่อที่ open
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});


self.addEventListener("fetch", function(event) {
  // การทำงานในฟังก์ชั่นทีี่ scope ตรงนี้จะเป็น loop โดยทำหลังจาก fetch ไฟล์ serviceworker
  // โดยฟังก์ชั่นจะใช้ argument เป็น event จากการทำงานของเวปทั้งหมด
  event.respondWith(
    // จาก argument ของฟังก์ชั่นจะได้ event ผลลัพธ์จะทำงานเป็น loop
    //  ทำการ fetch event ที่เป็น request event ซึ่งถ้า success ก็ไม่มี action ใด
     // กรณี offline จะ fetch ไม่ได้ และเกิด error จะ catch โดยจะ return ข้อมูลจาก cache storage ต่อไป
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        // resolve ของ promise ฟังก์ชั่น caches.match(event.request) จะได้ response เป็นไฟล์ css javascript image หรืออื่นๆที่ไม่ใช้ html
        // จากทุกไฟล์ใน array CACHED_URLS ยกเว้นไฟล์ html
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // ถ้าไม่เจอ response ที่เป็นไฟล์ปะกอบแล้ว จะทำการเรียกไฟล์ html ด้วย caches.match
          // โดยจะมีเงื่อนไขตรวจสอบก่อน returnไฟล์ html คือ ตรวจสอบ request header ที่ fetch นั้น accept และ Content-Type เป็น text/html หรือไม่
          // เพื่อให้แน่ใช้ว่า event.request นั้นเป็นของ html ซึ่งจะมีเพียง html ไฟล์เท่านั้นที ่Content-Type เป็น text/html
          return caches.match("/index-offline.html");
        }
      });
    })
  );
});

// ในการใช้ cache ไฟล์ให้ระวังเรื่องการอัพเดท เวลาเรียกใช้งาน จะเรียกไฟล์จาก cache storage ก่อนแล้วถ้าไม่เจอ ถึงจะไปเรียกจาก sever
// ซึ่งการใช้งาน ต้องระวังกรณีที่ต้องมีอัพเดทไฟล์ ถ้า browser เจอไฟล์นั้นใน cache ก่อนจะไม่โหลดไฟล์ที่ทำการอัพเดทจาก server

// แก้ปัญหาโดย code ด้านล่างโดยจะทำงานภายใน state Activating
// โดยจะทำการลบไฟล์ cache ที่ชื่อไม่ตรงกับไฟล์ cache ปัจจุบันออก
// โดยถ้าต้องการอัพเดทก็แก้ชื่อไฟล์ cache ใหม่ อาจจะเติม v1 2 3 .. ข้างหลังของเดิม
// ในการอัพเดท cache ต้องปิด tab หรือ window เดิมก่อนแล้วเข้าเวปใหม่เท่านั้นถึงจะทำกันอัพเดท ***
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("gih-cache")) {
// cache.delete เป็น promise เมื่อ return ภายใน callback function ของ map
// จะกลายเป็น array ของ promise หลายๆตัว(กรณีเข้าเงื่อนไขหลายตัว)
// ดังนั้นในที่นี้จะใช้ Promise.all มาครอบเพื่อนให้ array ของ Promise หลายๆทำงานโดย return ในรูปแบบ single Promise
// โดยหากมี Promise ใด้ Promise หนึ่ง fail ตัว Promise.all ก็จะ return ในรูปแบบ fail ทันที
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

Notification.requestPermission();

// Notification.requestPermission().then((permission) => {
//   if (permission === 'granted') {
//     console.log('Notification permission granted.');
//   } else {
//     console.log('Unable to get permission to notify.');
//   }
// });
