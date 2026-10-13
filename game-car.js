/* くるま はしろう（2歳むけ）
   ゆびを うえに うごかすと、くるまが みちに そって はしる。

   みちを 正確に なぞらせるのは この月齢には むずかしいので、
   ゆびの たかさ だけで すすむ。よこに ずれても すすむ。
   くるまは みちの むきに あわせて まわるので、はしっている ように 見える。
   ゆびを はなしても もどらない。おうちに つけば クラクション。 */
(function(){
"use strict";

/* みちは したから うえへ。3つから えらぶ */
var ROADS = [
  "M50,188 C20,156 80,126 50,96 C20,66 80,42 50,22",
  "M50,188 C72,150 28,120 50,80 C66,50 38,34 50,22",
  "M50,188 Q24,152 40,118 Q60,84 34,54 Q20,34 50,22"
];

/* みちを はしる のりものだけ。でんしゃ と ひこうき は のぞく */
var ROAD_IDS = ["car","bus","fire","ambulance","police","digger","truck","garbage"];

var CHEERS = ["ついた！","とうちゃく！","やったー！"];

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elSvg, elPath, elDash, elCar, elName, elStars, starEls;
var pool = [], kind = null, roadLen = 0, lastRoad = null;
var progress = 0, target = 0, arrived = false, streak = 0, running = false;
var raf = null, timers = [], dragId = null;

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

function newRound(){
  arrived = false;
  progress = 0;
  target = 0;
  clearTimers();

  var prev = kind;
  do { kind = KP.pick(pool); } while(pool.length > 1 && prev && kind.id === prev.id);

  var d;
  do { d = KP.pick(ROADS); } while(ROADS.length > 1 && d === lastRoad);
  lastRoad = d;

  elPath.setAttribute("d", d);
  elDash.setAttribute("d", d);
  roadLen = elPath.getTotalLength();

  /* くるまの えは よこむき。まんなかを 原点に もってきてから まわす */
  elCar.innerHTML = '<g transform="translate(-50,-50)">' + kind.svg + '</g>';
  elName.textContent = kind.name;
  elSvg.setAttribute("aria-label", kind.name + " を はしらせる");

  draw();
  KP.say(kind.call || kind.name);
  armHint();
}

/* 10びょう うごかさなければ、みちが ひかって さそう */
function armHint(){
  later(function(){
    if(arrived) return;
    elPath.classList.add("calling");
    later(function(){ elPath.classList.remove("calling"); }, 2000);
    KP.say(kind.call || kind.name);
    armHint();
  }, 10000);
}

function draw(){
  if(!roadLen) return;
  var at = progress * roadLen;
  var p  = elPath.getPointAtLength(at);
  var p2 = elPath.getPointAtLength(Math.min(roadLen, at + 1.5));
  var ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI;
  elCar.setAttribute("transform",
    "translate(" + p.x.toFixed(2) + "," + p.y.toFixed(2) + ") rotate(" + ang.toFixed(1) + ") scale(0.26)");
}

/* ゆびの いちに むかって なめらかに おいかける。
   いきなり とばすと「はしった」感じが でないので、すこしずつ ちかづける */
function loop(){
  if(!running) return;
  var d = target - progress;
  if(Math.abs(d) < 0.0015){ progress = target; }
  else { progress += d * 0.14; }
  draw();
  check();
  raf = requestAnimationFrame(loop);
}

function check(){
  if(arrived || !running) return;
  if(progress <= 0.965) return;

  arrived = true;
  progress = 1; target = 1;
  draw();
  clearTimers();

  KP.snd.horn();
  KP.cheer(KP.pick(CHEERS));
  KP.say(kind.name + "、ついた！");
  streak++;
  KP.count("car");
  drawStars();

  if(streak >= 5){ later(finale, 1000); }
  else{ later(newRound, 1800); }
}

function fromPointer(e){
  if(arrived) return;
  var r = elSvg.getBoundingClientRect();
  if(r.height < 10) return;
  var t = 1 - (e.clientY - r.top) / r.height;
  if(t < 0){ t = 0; }
  if(t > 1){ t = 1; }
  target = t;
}

function onDown(e){
  if(arrived) return;
  e.preventDefault();
  dragId = e.pointerId;
  try { elSvg.setPointerCapture(e.pointerId); } catch(err){}
  clearTimers();
  elPath.classList.remove("calling");
  fromPointer(e);
}
function onMove(e){
  if(dragId === null || e.pointerId !== dragId) return;
  fromPointer(e);
}
function onUp(e){
  if(dragId === null) return;
  dragId = null;
  /* ゆびを はなしても くるまは その ばしょに のこる */
  if(!arrived){ armHint(); }
}

function finale(){
  KP.cheer("できたね！");
  KP.snd.tada();
  KP.say("よく できました");
  KP.confetti();
  streak = 0;
  later(function(){ drawStars(); newRound(); }, 1800);
}

KP.register("car", {
  start: function(){
    elSvg   = document.getElementById("r-svg");
    elPath  = document.getElementById("r-road");
    elDash  = document.getElementById("r-dash");
    elCar   = document.getElementById("r-car");
    elName  = document.getElementById("r-name");
    elStars = document.getElementById("r-stars");

    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");

    if(!elSvg.getAttribute("data-bound")){
      elSvg.addEventListener("pointerdown", onDown);
      elSvg.addEventListener("pointermove", onMove);
      elSvg.addEventListener("pointerup", onUp);
      elSvg.addEventListener("pointercancel", onUp);
      elSvg.setAttribute("data-bound", "1");
    }

    pool = KP.ART.filter(function(a){ return ROAD_IDS.indexOf(a.id) >= 0; });
    streak = 0;
    kind = null;
    dragId = null;
    running = true;
    drawStars();
    newRound();
    if(!raf){ raf = requestAnimationFrame(loop); }
  },
  stop: function(){
    running = false;
    clearTimers();
    dragId = null;
    if(raf){ cancelAnimationFrame(raf); raf = null; }
    if(elPath){ elPath.classList.remove("calling"); }
  },
  restart: function(){
    clearTimers();
    streak = 0;
    drawStars();
    newRound();
  }
});
})();
