/* いろ あてっこ（2歳むけ）
   「あかい ふうせん、どれかな？」と きいて、その いろの ふうせんを えらぶ。

   えらぶ ものを ぜんぶ おなじ かたち（ふうせん）に してあるのが かんじん。
   かたちが ちがうと かたちで えらべてしまい、いろの もんだいに ならない。

   いろは 2歳が たしかに わかる あか・あお・きいろ・みどり を 土台に、
   むらさき・オレンジ を くわえた 6しょく。
   ピンク（あかと まぎらわしい）、しろ（はいけいと 見分けにくい）、
   ちゃいろ（オレンジと まぎらわしい）は いれていない。

   レベル = ならぶ ふうせんの かず - 1（どれかな と 共通の せってい）。 */
(function(){
"use strict";

var COLORS = [
  { id:"red",    name:"あか",     adj:"あかい",     hex:"#e8453c", edge:"#b32f28" },
  { id:"blue",   name:"あお",     adj:"あおい",     hex:"#2d8fd5", edge:"#1f6ca3" },
  { id:"yellow", name:"きいろ",   adj:"きいろい",   hex:"#f5b914", edge:"#c7930a" },
  { id:"green",  name:"みどり",   adj:"みどりの",   hex:"#57b84a", edge:"#3f8c35" },
  { id:"purple", name:"むらさき", adj:"むらさきの", hex:"#9b5de5", edge:"#7840b8" },
  { id:"orange", name:"オレンジ", adj:"オレンジの", hex:"#ef7a3d", edge:"#c25a26" }
];

var CHEERS = ["せいかい！","あたり！","そうそう！","すごい！"];
var COLS = { 2:2, 3:3, 4:2, 5:3, 6:3 };

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

/* ふうせん。いろ いがいの 手がかりが のこらないよう、かたちは ぜんぶ おなじ */
function balloonSvg(c){
  return '<svg viewBox="0 0 100 100" aria-hidden="true">'
    + '<path d="M50,74 Q56,84 48,96" stroke="#8a9a94" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="50" cy="42" rx="30" ry="35" fill="' + c.hex + '"/>'
    + '<path d="M50,77 L44,70 L56,70 Z" fill="' + c.edge + '"/>'
    + '<ellipse cx="38" cy="29" rx="7.5" ry="11" fill="#ffffff" opacity="0.4" transform="rotate(-22 38 29)"/>'
    + '<path d="M28,52 Q34,66 48,72" stroke="#ffffff" stroke-width="3" opacity="0.22" fill="none" stroke-linecap="round"/>'
    + '</svg>';
}

var elGrid, elCall, elCallText, elStars, starEls;
var target = null, locked = false, misses = 0, streak = 0;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

function speakTarget(){
  if(!target) return;
  KP.say(target.adj + " ふうせん、どれかな？");
}

function newRound(){
  locked = false;
  misses = 0;
  clearTimers();

  var n = (KP.S.level | 0) + 1;
  if(n < 2){ n = 2; }
  if(n > 6){ n = 6; }

  var picked = KP.shuffle(COLORS).slice(0, n);
  target = KP.pick(picked);

  elGrid.style.setProperty("--cols", COLS[n] || 3);
  elGrid.innerHTML = "";
  picked.forEach(function(c, i){
    var b = document.createElement("button");
    b.className = "balloon";
    b.type = "button";
    b.setAttribute("data-id", c.id);
    b.setAttribute("aria-label", c.name + "の ふうせん");
    b.style.animationDelay = (i * 0.06) + "s";
    b.innerHTML = balloonSvg(c);
    b.addEventListener("click", function(){ tap(b, c); });
    elGrid.appendChild(b);
  });

  /* おやが よこから 補助できるように、いろの なまえを 文字でも だす */
  elCallText.textContent = target.name;
  speakTarget();
  armHint();
}

function armHint(){
  later(function(){
    if(locked) return;
    var t = elGrid.querySelector('.balloon[data-id="' + target.id + '"]');
    if(t){ t.classList.add("hint"); }
    speakTarget();
  }, 6500);
}

function tap(el, c){
  if(locked) return;

  if(c.id === target.id){
    locked = true;
    clearTimers();
    el.classList.remove("hint");
    /* せいかいの ふうせんは そらへ とんでいく */
    el.classList.add("fly");
    KP.snd.fit();
    KP.cheer(KP.pick(CHEERS));
    KP.say("そう、" + target.name + " だね");
    streak++;
    KP.count("iro");
    drawStars();
    if(streak >= 5){ later(finale, 1000); }
    else{ later(newRound, 1700); }
  }else{
    /* まちがいでも おこらない。ぷるっと ゆれるだけ */
    misses++;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    KP.snd.bounce();
    if(misses >= 2){
      var t = elGrid.querySelector('.balloon[data-id="' + target.id + '"]');
      if(t){ t.classList.add("hint"); }
      clearTimers();
      later(speakTarget, 600);
      armHint();
    }
  }
}

function finale(){
  KP.cheer("できたね！");
  KP.snd.tada();
  KP.say("よく できました");
  KP.confetti();
  streak = 0;
  later(function(){ drawStars(); newRound(); }, 1900);
}

KP.register("iro", {
  start: function(){
    elGrid     = document.getElementById("i-grid");
    elCall     = document.getElementById("i-call");
    elCallText = document.getElementById("i-call-text");
    elStars    = document.getElementById("i-stars");

    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");

    if(!elCall.getAttribute("data-bound")){
      elCall.addEventListener("click", function(){ speakTarget(); });
      elCall.setAttribute("data-bound", "1");
    }

    streak = 0;
    drawStars();
    newRound();
  },
  stop: function(){
    clearTimers();
    locked = false;
  },
  restart: function(){
    clearTimers();
    streak = 0;
    drawStars();
    newRound();
  }
});
})();
