let cacheName="gofit";
let filesToCache=["dettaglio_allenamento.html",
"login.html",
"programmi.html",
"scheda_del_giorno.html",
"script.js",
"script_dettaglio.js",
"script_login.js",
"script_programmi.js",
"script_storico.js",
"storico.html",
"style.css",
"style_login.css",
"manifest.json",
"assets/icon-192.png",
"assets/icon-512.png"]

self.addEventListener("install",function(e){
    e.waitUntil(caches.open(cacheName).then(function(cache){
        return cache.addAll(filesToCache);
    })
    );
});

self.addEventListener("fetch",function(e){
    if(e.request.url.includes("192.168.1.38:5000")){
        return;
    }
    e.respondWith(caches.match(e.request).then(function(response){
        return response || fetch(e.request);
    })
    );
});
