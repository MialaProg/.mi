
const CACHE_NAME = 'cache-v1';
const ASSETS = [
    './index.html',
    './index.js',
    './dico.fimi',
    './ctxt.fimi',
    './rcc.fimi',
    '../lib/fonts/miala-bitmap-font.css',
    '../lib/style/divers.css',
    '../lib/style/checkbox.css',
    '../lib/style/buttons.css',
    '../lib/fonts/mifont.js',
    '../lib/script/modal.js',
    'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css',
    './sw.js'
];
// Précacher les ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS);
            })
    );
}
);
// Intercepter les requêtes réseau
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});