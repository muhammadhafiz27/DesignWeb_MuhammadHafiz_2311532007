const cache_name = 'v1';
const cache_assets = [
    'index.html',
    'contact.html',
    'about.html',
    'offline.html',
    './apps.js',
    './Tugas1.css'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name).then((cache) => {
            console.log('Service Worker: Caching Files');
            return cache.addAll(cache_assets); // Tambahkan "return" untuk memastikan proses selesai
        })
    );
    self.skipWaiting(); // Memastikan service worker segera aktif
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cache_name) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache); // Hapus cache lama
                    }
                })
            );
        })
    );
    self.clients.claim(); // Mengambil kontrol dari service worker lama
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ada cache, kembalikan respon dari cache
            if (response) {
                return response;
            }
            // Jika tidak ada cache, lakukan fetch request
            return fetch(event.request).catch(() => caches.match('offline.html')); // Tampilkan halaman offline jika fetch gagal
        })
    );
});
