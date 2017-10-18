var dataCacheName = 'weatherData2';
var cacheName = 'weatherPWA2';
var filesToCache = [
  '/',
  '/index.html',
  '/js/app.js',
  '/css/style.css',
  '/images/sunny1.png',
  '/images/sunny2.png',
  '/images/rain.png',
  '/images/thunderstorm.png',
  '/images/snowy.png',
  '/images/fog.png',
  '/images/windy.png',
  '/images/cloudy1.png',
  '/images/cloudy.png',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
   //console.log('[Service Worker] Fetch', e.request.url);
   e.respondWith(
     caches.open(dataCacheName).then(function(cache) {
       return fetch(e.request).then(function(response){
         console.log('[Service Worker] Guardei ', e.request.url);
         cache.put(e.request.url, response.clone());
         return response;
      })
      .catch(function (error){
         console.log(error);
      });
     })
   );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
