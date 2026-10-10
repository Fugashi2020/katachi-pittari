/* オフラインでも あそべるようにするための Service Worker
   じぶんの ファイルは つねに ネット優先なので、ふつうの 更新で CACHE を
   上げる 必要は ない。ためる ファイルを ふやした ときだけ 上げる。 */
var CACHE = "kp-v7";
var ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./art.js",
  "./game-katachi.js",
  "./game-baa.js",
  "./game-doreka.js",
  "./game-pachin.js",
  "./game-hakobu.js",
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

  var sameOrigin = (req.url.indexOf(self.location.origin + "/") === 0);

  /* じぶんの ファイル（HTML・JS・アイコン）は かならず ネットを さきに みる。
     キャッシュを さきに みると、なおしても ふるい ファイルが つかわれ続け、
     キャッシュ名を 手で 上げるまで 端末に とどかない。
     GitHub Pages は 10分の キャッシュ指定を つけて くばるので、
     no-store で ブラウザの HTTPキャッシュも かならず 素通りさせる。
     つながらないときだけ キャッシュから だす（オフラインでも あそべる）。 */
  if(sameOrigin){
    e.respondWith(
      fetch(req, { cache: "no-store" }).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); }).catch(function(){});
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){
          if(hit){ return hit; }
          /* ページの よみこみ じたいが こけたときは、ためてある がめんを かえす */
          if(req.mode === "navigate"){ return caches.match("./index.html"); }
          return Response.error();
        });
      })
    );
    return;
  }

  /* そとから よみこむ フォントだけは キャッシュ優先。かわらないし、はやい */
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
