// Service Worker for Maha Vastu Mandal (PWA)
const CACHE_NAME = 'mvm-cache-v1';

// बुनियादी संपत्तियां जिन्हें कैश किया जाएगा
const STATIC_ASSETS = [
  '/',
  'https://raw.githubusercontent.com/mahavastumandal-cyber/mvm/42239a6e96f9be887891c5207b46d64eb9970a1f/favicon.svg',
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBokoAVrt2w-mZ7lPvk4bhCsZzOVdwjUs49a98aOX-BR2GlgYpMZGp-IjMz1XDa0pwLspH3r6Q8Mn5dxShXPwwiq5f-0kpX7htzNuYrY7_cyWgGAifwa69KKS-kfPWcpMCQsHBb26JMzQMenUW-O5dB87P_DIDJV53gAGtm26gOxatNA/s1600/image1786804500'
];

// 1. Install Event: फाइल्स को कैश में सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: पुराने कैश को साफ करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: नेटवर्क-फर्स्ट रणनीति (ताकि नया ब्लॉग कंटेंट हमेशा मिले)
self.addEventListener('fetch', (event) => {
  // सिर्फ http और https अनुरोधों को संभालें
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        // अगर इंटरनेट बंद है, तो कैश से लोड करें
        return caches.match(event.request);
      })
  );
});
