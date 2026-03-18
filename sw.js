const CACHE_NAME = 'mm-exam-cache-v1';
// ካሼ መደረግ ያለባቸው ፋይሎች ዝርዝር
const urlsToCache = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon.png' // የአፑ አይከን
];

// መጀመሪያ ሲጫን ፋይሎቹን ሴቭ ያድርግ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ኢንተርኔት ከሌለ ከካሼ ይጥራ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
