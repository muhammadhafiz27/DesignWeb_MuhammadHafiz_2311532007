const cache_name = 'v1';
const cache_assets = [
    'index.html',
    'contact.html',
    'about.html',
    'offline.html',
    './apps.js',
    './Tugas1.css'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name).then(
            (cache) => {
                console.log('Service Worker: Caching Files');
                cache_assets.addAll(cache_assets);
            }
        )
    )
})

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(
            (cache_name) => {
                return Promise.all(
                    cache_name.map(
                        (cache) => {
                            if(cache !== cache_name){
                                console.log('Service Worker: Clearing Old Cache');
                                return caches.delete(cache);
                            }
                        }
                    )
                )
            }
        )
    )
})

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.RespondWith(
        caches.match(event.request).then(
            (response) => {
                if(response){
                    return response;
                }
                return fetch(event.request).catch(
                    () => caches.match('offline.html')
                )
            }
        )
    )
})