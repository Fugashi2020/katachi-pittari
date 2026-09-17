/* 共通の土台。
   設定の保存、音、読み上げ、ほめことば、紙吹雪、おうち画面との行き来を受け持つ。
   個々のゲームは KP.register() でこの土台に載せる。 */
var KP = (function(){
"use strict";

/* ===== せってい（この端末の中だけに保存。外へは何も送らない） ===== */
var S = { sound:true, speak:true, pieces:3 };
var today = new Date().toISOString().slice(0,10);
var record = { date:today, katachi:0, baa:0 };

try{
  var rawS = localStorage.getItem("kp.settings");
  if(rawS){
    var o = JSON.parse(rawS);
    if(o && typeof o === "object"){
      S.sound = o.sound !== false;
      S.speak = o.speak !== false;
      S.pieces = ([2,3,4].indexOf(o.pieces) >= 0) ? o.pieces : 3;
    }
  }
  var rawR = localStorage.getItem("kp.record");
  if(rawR){
    var r = JSON.parse(rawR);
    if(r && r.date === today){
      record.katachi = r.katachi || 0;
      record.baa = r.baa || 0;
    }
  }
}catch(e){}

function save(){
  try{
    localStorage.setItem("kp.settings", JSON.stringify(S));
    localStorage.setItem("kp.record", JSON.stringify(record));
  }catch(e){}
}

/* あそべた回数をかぞえる */
function count(key){
  record.date = today;
  record[key] = (record[key] || 0) + 1;
  save();
  if(typeof syncPanel === "function"){ syncPanel(); }
}

/* ===== おと（Web Audio で合成するので音源ファイル不要） ===== */
var ac = null;
function audio(){
  if(!S.sound) return null;
  try{
    if(!ac){
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return null;
      ac = new AC();
    }
    if(ac.state === "suspended"){ ac.resume(); }
    return ac;
  }catch(e){ return null; }
}

function tone(freq, delay, dur, type, vol){
  var c = audio(); if(!c) return;
  var t = c.currentTime + delay;
  var o = c.createOscillator(), g = c.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol || 0.22, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

/* 音がのぼっていく＝めくる・ひらく */
function slide(from, to, delay, dur, vol){
  var c = audio(); if(!c) return;
  var t = c.currentTime + delay;
  var o = c.createOscillator(), g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol || 0.16, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

var snd = {
  fit:    function(){ [523.25,659.25,783.99,1046.5].forEach(function(f,i){ tone(f, i*0.075, 0.42, "sine", 0.2); }); },
  bounce: function(){ tone(392,0,0.1,"triangle",0.16); tone(294,0.07,0.16,"triangle",0.14); },
  tada:   function(){
            [523.25,659.25,783.99,1046.5,1318.5].forEach(function(f,i){ tone(f, i*0.1, 0.6, "triangle", 0.17); });
            tone(1046.5, 0.55, 0.9, "sine", 0.14);
          },
  open:   function(){ slide(300, 900, 0, 0.26, 0.15); },
  pop:    function(){ [659.25,880,1174.7].forEach(function(f,i){ tone(f, i*0.06, 0.5, "sine", 0.19); }); },
  hide:   function(){ slide(700, 260, 0, 0.24, 0.13); },
  tap:    function(){ tone(880, 0, 0.14, "sine", 0.16); }
};

/* ===== よみあげ（端末に日本語の声がなければ黙って何もしない） ===== */
function say(text){
  if(!S.speak || !("speechSynthesis" in window)) return;
  try{
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP"; u.rate = 0.85; u.pitch = 1.35;
    speechSynthesis.speak(u);
  }catch(e){}
}

function shuffle(a){
  a = a.slice();
  for(var i=a.length-1;i>0;i--){
    var j = Math.floor(Math.random()*(i+1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

/* ===== ほめことば ===== */
var elCheer = null;
function cheer(text){
  if(!elCheer){ elCheer = document.getElementById("cheer"); }
  elCheer.textContent = text;
  elCheer.classList.remove("show");
  void elCheer.offsetWidth;
  elCheer.classList.add("show");
}

/* ===== かみふぶき ===== */
var cv, ctx, bits = [], raf = null;
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fitCanvas(){
  if(!cv) return;
  var d = window.devicePixelRatio || 1;
  cv.width = cv.clientWidth * d;
  cv.height = cv.clientHeight * d;
  ctx.setTransform(d,0,0,d,0,0);
}

function confetti(){
  var palette = ["#e8453c","#f5b914","#2d8fd5","#57b84a","#9b5de5","#ffffff"];
  var n = reduce ? 26 : 90;
  for(var i=0;i<n;i++){
    bits.push({
      x: Math.random()*cv.clientWidth,
      y: -20 - Math.random()*cv.clientHeight*0.4,
      w: 7 + Math.random()*9,
      h: 9 + Math.random()*11,
      vy: 2.2 + Math.random()*3.2,
      vx: (Math.random()-0.5)*2.2,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.24,
      c: palette[Math.floor(Math.random()*palette.length)]
    });
  }
  if(!raf){ raf = requestAnimationFrame(step); }
}
function step(){
  ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight);
  for(var i=bits.length-1;i>=0;i--){
    var p = bits[i];
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
    if(p.y > cv.clientHeight + 30){ bits.splice(i,1); }
  }
  if(bits.length){ raf = requestAnimationFrame(step); }
  else{ raf = null; ctx.clearRect(0,0,cv.clientWidth,cv.clientHeight); }
}

/* ===== がめんの きりかえ ===== */
var games = {};
var current = null;

function register(id, mod){ games[id] = mod; }

function show(id){
  /* いま動いているゲームを止める（タイマーの止め忘れを防ぐ） */
  if(current && games[current] && games[current].stop){ games[current].stop(); }

  var screens = document.querySelectorAll(".screen");
  for(var i=0;i<screens.length;i++){ screens[i].hidden = true; }

  var el = document.getElementById(id === "home" ? "home" : "screen-" + id);
  if(el){ el.hidden = false; }

  current = (id === "home") ? null : id;
  document.body.setAttribute("data-screen", id);

  if(current && games[current] && games[current].start){ games[current].start(); }
}

/* ===== おうちのかた パネル（1.2秒ながおしで ひらく） ===== */
var pBtn, panel, tSound, tSpeak, seg, closeBtn, homeBtn;
var holdTimer = null;

function endHold(){
  pBtn.classList.remove("holding");
  clearTimeout(holdTimer);
}

function syncPanel(){
  if(!tSound) return;
  tSound.setAttribute("aria-pressed", String(S.sound));
  tSound.textContent = S.sound ? "オン" : "オフ";
  tSpeak.setAttribute("aria-pressed", String(S.speak));
  tSpeak.textContent = S.speak ? "オン" : "オフ";
  Array.prototype.forEach.call(seg.children, function(b){
    b.setAttribute("aria-pressed", String(Number(b.getAttribute("data-n")) === S.pieces));
  });
  document.getElementById("statKatachi").textContent = String(record.katachi || 0);
  document.getElementById("statBaa").textContent = String(record.baa || 0);
  /* ピースのかずは かたちぴったり だけの設定なので、ほかの画面では隠す */
  document.getElementById("row-pieces").hidden = (current !== "katachi");
  homeBtn.hidden = (current === null);
}

function openPanel(){
  endHold();
  syncPanel();
  panel.hidden = false;
  closeBtn.focus();
}
function closePanel(){
  panel.hidden = true;
  /* 設定が変わっているかもしれないので、いまのゲームを組み直す */
  if(current && games[current] && games[current].restart){ games[current].restart(); }
}

function boot(){
  cv = document.getElementById("confetti");
  ctx = cv.getContext("2d");
  fitCanvas();
  window.addEventListener("resize", fitCanvas);
  window.addEventListener("orientationchange", function(){ setTimeout(fitCanvas, 300); });

  pBtn = document.getElementById("parentBtn");
  panel = document.getElementById("panel");
  tSound = document.getElementById("t-sound");
  tSpeak = document.getElementById("t-speak");
  seg = document.getElementById("seg-pieces");
  closeBtn = document.getElementById("close");
  homeBtn = document.getElementById("goHome");

  pBtn.addEventListener("pointerdown", function(e){
    e.preventDefault();
    pBtn.classList.add("holding");
    holdTimer = setTimeout(openPanel, 1200);
  });
  pBtn.addEventListener("pointerup", endHold);
  pBtn.addEventListener("pointerleave", endHold);
  pBtn.addEventListener("pointercancel", endHold);
  pBtn.addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openPanel(); }
  });
  pBtn.addEventListener("contextmenu", function(e){ e.preventDefault(); });

  tSound.addEventListener("click", function(){
    S.sound = !S.sound; save(); syncPanel();
    if(S.sound){ tone(660, 0, 0.18, "sine", 0.18); }
  });
  tSpeak.addEventListener("click", function(){
    S.speak = !S.speak; save(); syncPanel();
    if(S.speak){ say("よみあげ オン"); }
  });
  seg.addEventListener("click", function(e){
    var b = e.target.closest("button[data-n]");
    if(!b) return;
    S.pieces = Number(b.getAttribute("data-n"));
    save(); syncPanel();
  });
  document.getElementById("reset").addEventListener("click", function(){
    record = { date: today, katachi: 0, baa: 0 };
    save(); syncPanel();
  });
  homeBtn.addEventListener("click", function(){
    panel.hidden = true;
    show("home");
  });
  closeBtn.addEventListener("click", closePanel);
  panel.addEventListener("click", function(e){ if(e.target === panel){ closePanel(); } });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && !panel.hidden){ closePanel(); }
  });

  /* おうち画面の ゲームえらび */
  Array.prototype.forEach.call(document.querySelectorAll("[data-game]"), function(b){
    b.addEventListener("click", function(){
      snd.tap();
      show(b.getAttribute("data-game"));
    });
  });

  /* こどもの ごそうさ よけ：ピンチ拡大・ダブルタップ拡大をふせぐ */
  document.addEventListener("gesturestart", function(e){ e.preventDefault(); });
  document.addEventListener("dblclick", function(e){ e.preventDefault(); });

  show("home");
}

return {
  S: S,
  record: record,
  save: save,
  count: count,
  tone: tone,
  slide: slide,
  snd: snd,
  say: say,
  shuffle: shuffle,
  pick: pick,
  cheer: cheer,
  confetti: confetti,
  reduce: reduce,
  register: register,
  show: show,
  boot: boot,
  currentId: function(){ return current; }
};
})();
