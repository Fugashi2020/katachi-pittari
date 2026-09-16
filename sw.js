/* オフラインでも あそべるようにするための Service Worker
   ゲームを更新したら CACHE の番号を上げること */
var CACHE = "kp-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(ASSETS); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== CACHE){ return caches.delete(k); }
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET"){ return; }

  /* ページ本体は「まずネット、つながらなければキャッシュ」。
     こうしておかないと、更新してもスマホに古い画面が出続ける */
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put("./index.html", copy); }).catch(function(){});
        return res;
      }).catch(function(){
        return caches.match("./index.html");
      })
    );
    return;
  }

  /* アイコンやフォントは「まずキャッシュ」。表示が速く、電波が無くても出る */
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit){ return hit; }
      return fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); }).catch(function(){});
        return res;
      });
    })
  );
});
