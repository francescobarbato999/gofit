let cacheName="gofit";
let filesToCache=[
"assets/icon-192.png","assets/icon-512.png","creaProgramma.html","dettaglio_allenamento.html","login.html","modifica_programma.html","programmi.html","scheda_del_giorno.html",
"script.js",
"script_dettaglio.js",
"script_login.js",
"script_modifica_scheda.js",
"script_nuova_scheda.js",
"script_programmi.js",
"script_storico.js",
"storico.html",
"style.css",
"style_login.css",
"sw.js",
"sw_register.js"
]
const API_URL = "http://" + self.location.hostname + ":5000";
self.addEventListener("install",function(e){
    e.waitUntil(caches.open(cacheName).then(function(cache){
        return cache.addAll(filesToCache);
    })
    );
});

self.addEventListener("fetch",function(e){
    if(e.request.url.includes(API_URL)){
        return;
    }
    e.respondWith(caches.match(e.request).then(function(response){
        return response || fetch(e.request);
    })
    );
});
