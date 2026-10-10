/* ぱちんと
   ゆっくり のぼってくる しゃぼんだまを タップで われる。

   この月齢は はやい うごきを おいかけられないので、
   「おおきく・ゆっくり」が いちばん だいじ。
   われなくても しゃぼんだまは うえまで いって きえ、つぎが でてくるだけ。 */
(function(){
"use strict";

var COLORS = ["#ff6b8a","#4fb3e8","#ffc93d","#6bd48a","#b58cf0","#ff9a52"];
var MAX = 4;   /* どうじに うかんでいる かず */

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elStage, elStars, starEls;
var wraps = [], streak = 0, running = false;
var timers = [], resizeTimer = null;

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

function clearAll(){
  wraps.forEach(function(w){ if(w.parentNode){ w.parentNode.removeChild(w); } });
  wraps = [];
}
function removeWrap(w){
  var i = wraps.indexOf(w);
  if(i >= 0){ wraps.splice(i, 1); }
  if(w.parentNode){ w.parentNode.removeChild(w); }
}

/* seeded … あそびはじめ用。はじめから がめんの とちゅうに うかんだ じょうたいにする。
   これが ないと さいしょの すうびょう、がめんが からっぽに 見えてしまう */
function spawn(delay, seeded){
  if(!running) return;
  later(function(){
    if(!running) return;

    var r = elStage.getBoundingClientRect();
    /* まだ がめんの おおきさが きまっていないときは、そのまま まちなおす */
    if(r.width < 40 || r.height < 40){ spawn(400, seeded); return; }

    /* 1歳半の指でも ねらえる おおきさ。ちいさい画面でも 84px より ちいさくしない */
    var base = Math.min(r.width, r.height);
    var size = Math.round(base * (0.23 + Math.random()*0.12));
    if(size < 84){ size = 84; }
    if(size > 190){ size = 190; }

    var x = Math.random() * Math.max(8, r.width - size);
    /* 14〜21秒かけて がめんを のぼる。おとなには おそいが、この月齢には ちょうどいい */
    var dur = 14 + Math.random()*7;
    var color = KP.pick(COLORS);

    var wrap = document.createElement("div");
    wrap.className = "bub-wrap";
    wrap.style.left = Math.round(x) + "px";
    wrap.style.width = size + "px";
    wrap.style.height = size + "px";
    wrap.style.setProperty("--rise", Math.round(r.height + size + 40) + "px");
    wrap.style.animationDuration = dur + "s";
    if(seeded){
      /* マイナスの delay で、アニメの とちゅうから はじめる */
      wrap.style.animationDelay = "-" + (dur * (0.12 + Math.random()*0.52)).toFixed(1) + "s";
    }

    var b = document.createElement("button");
    b.className = "bubble";
    b.type = "button";
    b.setAttribute("aria-label", "しゃぼんだま");
    b.style.setProperty("--bub", color);
    b.style.animationDuration = (2.6 + Math.random()*1.8) + "s";
    b.addEventListener("click", function(){ pop(b, wrap, color); });

    wrap.appendChild(b);

    /* うえまで のぼりきったら きえて、また つぎが でてくる */
    wrap.addEventListener("animationend", function(){
      removeWrap(wrap);
      spawn(200 + Math.random()*600);
    });

    elStage.appendChild(wrap);
    wraps.push(wrap);
  }, delay || 0);
}

function pop(b, wrap, color){
  if(b.disabled) return;
  b.disabled = true;
  b.classList.add("pop");
  KP.snd.burst();

  /* われた ばしょから つぶを とばす */
  var p = KP.toCanvas(b.getBoundingClientRect());
  KP.burst(p.x, p.y, color);

  KP.count("pachin");
  streak++;
  drawStars();

  /* れんだする あそびなので、1こごとに ほめない。5こで まとめて ほめる */
  if(streak >= 5){
    streak = 0;
    KP.cheer("できたね！");
    KP.snd.tada();
    KP.confetti();
    later(drawStars, 700);
  }

  later(function(){
    removeWrap(wrap);
    spawn(150 + Math.random()*400);
  }, 330);
}

/* がめんを まわすと のぼる たかさが あわなくなるので、まとめて つくりなおす */
function onResize(){
  if(!running) return;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    if(!running) return;
    clearTimers();
    clearAll();
    for(var i=0;i<MAX;i++){ spawn(i*500, true); }
  }, 350);
}

KP.register("pachin", {
  start: function(){
    elStage = document.getElementById("p-stage");
    elStars = document.getElementById("p-stars");

    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");

    running = true;
    streak = 0;
    drawStars();
    clearAll();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    for(var j=0;j<MAX;j++){ spawn(j*500, true); }
  },
  stop: function(){
    running = false;
    clearTimers();
    clearTimeout(resizeTimer);
    clearAll();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
  },
  restart: function(){
    clearTimers();
    clearAll();
    streak = 0;
    drawStars();
    running = true;
    for(var i=0;i<MAX;i++){ spawn(i*400, true); }
  }
});
})();
