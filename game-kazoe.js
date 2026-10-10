/* かぞえよう（2歳むけ）
   ならんだ えを、ひとつずつ タップしながら かぞえる。

   2歳に「いくつ？」と きいて こたえさせるのは まだ はやい。
   タップするたび「いち」「に」「さん」と こえが でて、
   さいごに「ぜんぶで さんこ」と まとめる。
   かぞえる という 行為 そのものを させる のが ねらい。
   まちがいは なく、ぜんぶ さわれば すすむ。 */
(function(){
"use strict";

var NUM   = ["いち","に","さん","よん","ご"];
var COUNT = ["", "いっこ","にこ","さんこ","よんこ","ごこ"];

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elRow, elCall, elCallText, elStars, starEls;
var kind = null, total = 0, counted = 0, streak = 0, locked = false;
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
  if(!kind) return;
  KP.say((kind.call || kind.name) + "、いくつ かな？");
}

function newRound(){
  locked = false;
  counted = 0;
  clearTimers();

  /* 2歳が おえる かずは だいたい 3つまで。4つは すこし のびしろ */
  total = 2 + Math.floor(Math.random()*3);

  var prev = kind;
  do { kind = KP.pick(KP.ART); } while(prev && kind.id === prev.id);

  elCallText.textContent = kind.call || kind.name;

  elRow.innerHTML = "";
  for(var i=0;i<total;i++){
    var b = document.createElement("button");
    b.className = "n-item";
    b.type = "button";
    b.setAttribute("aria-label", kind.name);
    b.style.animationDelay = (i*0.07) + "s";
    b.innerHTML = '<span class="n-art"><svg viewBox="0 0 100 100" aria-hidden="true">'
      + kind.svg + '</svg></span><span class="n-num"></span>';
    (function(el){ el.addEventListener("click", function(){ tap(el); }); })(b);
    elRow.appendChild(b);
  }

  speakTarget();
  armHint();
}

/* 9びょう さわらなければ、まだ かぞえていない えが ゆれる */
function armHint(){
  later(function(){
    if(locked) return;
    var next = elRow.querySelector(".n-item:not(.counted)");
    if(next){
      next.classList.add("hint");
      later(function(){ next.classList.remove("hint"); }, 1800);
    }
    speakTarget();
  }, 9000);
}

function tap(el){
  if(locked || el.classList.contains("counted")) return;
  clearTimers();

  counted++;
  el.classList.remove("hint");
  el.classList.add("counted");
  el.querySelector(".n-num").textContent = String(counted);
  KP.snd.tap();
  KP.say(NUM[counted-1] || String(counted));

  if(counted < total){ armHint(); return; }

  /* ぜんぶ かぞえた。さいごに まとめて いう */
  locked = true;
  later(function(){
    KP.cheer(total + "こ！");
    KP.say("ぜんぶで " + (COUNT[total] || (total + "こ")));
    KP.snd.fit();
    streak++;
    KP.count("kazoe");
    drawStars();
    if(streak >= 5){ later(finale, 1100); }
    else{ later(newRound, 1900); }
  }, 700);
}

function finale(){
  KP.cheer("できたね！");
  KP.snd.tada();
  KP.say("よく できました");
  KP.confetti();
  streak = 0;
  later(function(){ drawStars(); newRound(); }, 1800);
}

KP.register("kazoe", {
  start: function(){
    elRow      = document.getElementById("n-row");
    elCall     = document.getElementById("n-call");
    elCallText = document.getElementById("n-call-text");
    elStars    = document.getElementById("n-stars");

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
    kind = null;
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
