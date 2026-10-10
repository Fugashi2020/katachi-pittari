/* はこんで ぴったり（2歳むけ）
   かたちぴったり の ドラッグばん。ピースを 指で つまんで あなまで はこぶ。

   2歳は まだ ぴったり かさねられないので、
   あなの ちかくまで くれば すいこむ。ちかづくと あなが ひらいて 教える。
   うまく いかない日は タップばん（かたちぴったり）に もどれば いい。 */
(function(){
"use strict";

var CHEERS = ["ぴったり！","はいった！","じょうず！","できたね！"];

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elHole, elTray, elStars, starEls;
var streak = 0, target = null, locked = false;
var drag = null;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

/* ピースの まんなかと あなの まんなかの へだたり。
   あなの はば の 0.65ばい（＝はんけいの 1.3ばい）まで ちかづけば はいったことにする */
function nearHole(el){
  var pr = el.getBoundingClientRect();
  var hr = elHole.getBoundingClientRect();
  var dx = (pr.left + pr.width/2) - (hr.left + hr.width/2);
  var dy = (pr.top + pr.height/2) - (hr.top + hr.height/2);
  return Math.sqrt(dx*dx + dy*dy) < hr.width * 0.65;
}

function newRound(){
  locked = false;
  drag = null;
  clearTimers();
  elHole.classList.remove("near","shake");

  var picked = KP.shuffle(KP.SHAPE_KEYS).slice(0, KP.S.pieces);
  var colors = KP.shuffle(KP.SHAPE_COLORS).slice(0, KP.S.pieces);
  target = KP.pick(picked);

  elHole.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><g class="hole-fill">'
    + KP.SHAPES[target].svg + '</g></svg>';

  elTray.innerHTML = "";
  KP.shuffle(picked).forEach(function(key, i){
    var el = document.createElement("div");
    el.className = "dpiece idle";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("data-key", key);
    el.setAttribute("aria-label", KP.SHAPES[key].name);
    el.style.animationDelay = (i*0.28) + "s";
    el.innerHTML = KP.shapeSvg(key, colors[i]);
    bindDrag(el, key);
    elTray.appendChild(el);
  });
  fitPieces(picked.length);
  armHint();
}

/* ピースが 1れつに おさまる おおきさを はかって CSS に わたす。
   2れつに おれると、したの れつだけ はこぶ きょりが ながくなるため */
function fitPieces(n){
  var stage = document.getElementById("h-stage");
  if(!stage || !elTray) return;

  /* よこ画面では ピースが たてに ならぶので しばらない */
  if(window.innerWidth >= window.innerHeight){
    elTray.style.removeProperty("--fit");
    return;
  }
  var sw = stage.getBoundingClientRect().width;
  if(sw < 40) return;
  var cs = getComputedStyle(elTray);
  var gap = parseFloat(cs.columnGap || cs.gap) || 16;
  var fit = Math.floor((sw - gap * (n - 1)) / n);
  if(fit > 40){ elTray.style.setProperty("--fit", fit + "px"); }
}

var fitTimer = null;
function onResize(){
  clearTimeout(fitTimer);
  fitTimer = setTimeout(function(){
    fitPieces(document.querySelectorAll(".dpiece").length || KP.S.pieces);
  }, 250);
}

/* 8びょう さわらなければ こたえが ぷるぷるして、あなも ひかる */
function armHint(){
  later(function(){
    if(locked || drag) return;
    var t = elTray.querySelector('.dpiece[data-key="' + target + '"]');
    if(t){
      t.classList.remove("idle");
      t.classList.add("hint");
      elHole.classList.add("near");
      later(function(){ if(!drag){ elHole.classList.remove("near"); } }, 1400);
    }
    KP.say(KP.SHAPES[target].name);
  }, 8000);
}

function bindDrag(el, key){
  el.addEventListener("pointerdown", function(e){
    if(locked) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch(err){}
    clearTimers();
    drag = { el: el, id: e.pointerId, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0 };
    el.classList.remove("idle","hint");
    el.classList.add("dragging");
    KP.snd.tap();
  });

  el.addEventListener("pointermove", function(e){
    if(!drag || drag.el !== el || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.sx;
    drag.dy = e.clientY - drag.sy;
    el.style.transform = "translate(" + drag.dx + "px," + drag.dy + "px) scale(1.08)";
    /* ちかづいたら あなを ひらいて「ここだよ」と 見せる */
    if(nearHole(el)){ elHole.classList.add("near"); }
    else{ elHole.classList.remove("near"); }
  });

  function finish(){
    if(!drag || drag.el !== el) return;
    var d = drag;
    drag = null;
    el.classList.remove("dragging");
    elHole.classList.remove("near");

    if(!nearHole(el)){ bounceBack(el); return; }
    if(key === target){ snapIn(el, d); }
    else{ reject(el, d); }
  }
  el.addEventListener("pointerup", finish);
  el.addEventListener("pointercancel", finish);

  /* キーボードでも あそべるように（ドラッグの かわりに Enter） */
  el.addEventListener("keydown", function(e){
    if(e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if(locked) return;
    clearTimers();
    if(key === target){ snapIn(el, { dx:0, dy:0 }); }
    else{ reject(el, { dx:0, dy:0 }); }
  });
}

/* あなの まんなかへ すいこんで はめる */
function snapIn(el, d){
  locked = true;
  clearTimers();

  var pr = el.getBoundingClientRect();
  var hr = elHole.getBoundingClientRect();
  var ddx = (hr.left + hr.width/2) - (pr.left + pr.width/2);
  var ddy = (hr.top + hr.height/2) - (pr.top + pr.height/2);

  el.style.transition = "transform .22s cubic-bezier(.3,1.5,.5,1)";
  el.style.transform = "translate(" + (d.dx + ddx) + "px," + (d.dy + ddy) + "px)";
  KP.snd.fit();

  later(function(){
    KP.say(KP.SHAPES[target].name);
    KP.cheer(KP.pick(CHEERS));
    streak++;
    KP.count("hakobu");
    drawStars();
    if(streak >= 5){ later(finale, 700); }
    else{ later(newRound, 1150); }
  }, 240);
}

/* かたちが ちがうとき。おこらず、あなが ぷるっと ゆれて ピースは もどる */
function reject(el, d){
  KP.snd.bounce();
  elHole.classList.remove("shake");
  void elHole.offsetWidth;
  elHole.classList.add("shake");
  el.style.transition = "transform .18s ease-out";
  el.style.transform = "translate(" + d.dx + "px," + (d.dy - 16) + "px) rotate(-7deg)";
  later(function(){ bounceBack(el); }, 190);
  armHint();
}

/* もとの ばしょへ ふわっと もどす。
   とちゅうに のこさないのは、つぎに どうすれば いいか わからなくなるから */
function bounceBack(el){
  el.style.transition = "transform .34s cubic-bezier(.3,1.3,.5,1)";
  el.style.transform = "";
  later(function(){
    el.style.transition = "";
    if(!locked){ el.classList.add("idle"); }
  }, 350);
  armHint();
}

function finale(){
  KP.cheer("できたね！");
  KP.snd.tada();
  KP.say("よく できました");
  KP.confetti();
  streak = 0;
  later(function(){ drawStars(); newRound(); }, 1800);
}

KP.register("hakobu", {
  start: function(){
    elHole  = document.getElementById("h-hole");
    elTray  = document.getElementById("h-tray");
    elStars = document.getElementById("h-stars");
    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");
    streak = 0;
    drawStars();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    newRound();
  },
  stop: function(){
    clearTimers();
    clearTimeout(fitTimer);
    drag = null;
    locked = false;
    if(elHole){ elHole.classList.remove("near","shake"); }
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
  },
  restart: function(){
    clearTimers();
    streak = 0;
    drawStars();
    newRound();
  }
});
})();
