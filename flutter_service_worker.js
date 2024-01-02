'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"manifest.json": "882332ea85bb93321dc2d00e17f2c0ee",
"styles.css": "2da55d56b5338bad5775b4587dbfbe98",
"index.html": "b372a287ac95249e1bef056a5384c374",
"/": "b372a287ac95249e1bef056a5384c374",
"assets/AssetManifest.bin": "1c4cfd1694c090226752b744362bfc7d",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/assets/fonts/Quicksand-Medium.ttf": "fd7f304a26dd790aef9f1ae84403eab3",
"assets/assets/fonts/Quicksand-Regular.ttf": "7194c41ffab51721bd84ca104553c4e1",
"assets/assets/fonts/Quicksand-Light.ttf": "e60d43df6abf50de0980883f4596e268",
"assets/assets/fonts/Quicksand-Bold.ttf": "e8dcee4bbf2288a2d264c76fa547f37a",
"assets/assets/fonts/Quicksand-SemiBold.ttf": "025d26a905aa7e016827cdc2b429552f",
"assets/assets/icons/tech/flutter.svg": "4573b20354e334c0ffdf80cedbe2e200",
"assets/assets/icons/tech/javascript.svg": "c6805d60feed21fcb9190b7c362c8c2c",
"assets/assets/icons/tech/java.svg": "0bd3075926dcb8f9d5b49907143ab55f",
"assets/assets/icons/tech/git.svg": "426fd3da8eb6d885748b754b3c49c678",
"assets/assets/icons/tech/angular.svg": "f54e20bafd8fbae8f0f3b03c47cb4553",
"assets/assets/icons/tech/sql.svg": "690b33c2180b2ad1905d893a8622ebbe",
"assets/assets/icons/tech/spring_boot.svg": "c254a24f66da4377a24e6477a6149fc6",
"assets/assets/icons/tech/typescript.svg": "1f8d093bac3f6cebfc8d3e8e4127035c",
"assets/assets/icons/user/user.svg": "091d230f1240a0529e216644d8228afe",
"assets/assets/icons/contact/phone.svg": "197f982102abc511f54468ffd02c73ad",
"assets/assets/icons/contact/email.svg": "83377c335deb3b6a8d3b9b7427f8b335",
"assets/assets/icons/contact/linkedin.svg": "9ec52ddff6ff79d7037a7356260ce689",
"assets/assets/icons/contact/github.svg": "c7f4f8cd4e1d67c295179575eab41e59",
"assets/AssetManifest.bin.json": "5eb1f62adf0c3074e9572df3bb95c2b9",
"assets/FontManifest.json": "3e290665a750a4bd4c42c9d066dfb8c4",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/NOTICES": "40c6b7c78d3341b60192d9d9e3933c68",
"assets/AssetManifest.json": "13732e8c709793cced365ab43b79f29e",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"favicon.ico": "dca45f1209a2485147ab4b2967fc62ca",
"main.dart.js": "65614ed2b861037f7a4e825ddfa1265b",
"version.json": "009c9e65172e010890f7f65fde438006",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"icons/favicon-16.png": "66242cda8c611af11349f1d4d497fed1",
"icons/favicon512.png": "a248f24e15943556700b2038f23f01c5",
"icons/favicon-192.png": "2aff59700dc353bb7a74584d55c7cb53",
"icons/apple-touch-icon.png": "f88d8056aa748e31cfaa3fa469dfe9bf",
"icons/favicon-32.png": "e39ee1a25aa61af3b903c9710a9c1355"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
