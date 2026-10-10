/* かたちぴったり
   あなに あう かたちを タップすると、ピースが とんでいって はまる。
   ドラッグは つかわない。まちがえても おこらない。 */
(function(){
"use strict";

/* かたちの ていぎは art.js に ある（はこんでぴったり と 共有） */
var CHEERS = ["ぴったり！","やったね！","すごい！","できたね！","じょうず！"];

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elHole, elTray, elStars, starEls;
var streak = 0, target = null, locked = false;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

function newRound(){
  locked = false;
  clearTimers();

  var picked = KP.shuffle(KP.SHAPE_KEYS).slice(0, KP.S.pieces);
  var colors = KP.shuffle(KP.SHAPE_COLORS).slice(0, KP.S.pieces);
  target = KP.pick(picked);

  elHole.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><g class="hole-fill">'
    + KP.SHAPES[target].svg + '</g></svg>';

  elTray.innerHTML = "";
  KP.shuffle(picked).forEach(function(key, i){
    var b = document.createElement("button");
    b.className = "piece idle";
    b.type = "button";
    b.setAttribute("data-key", key);
    b.style.animationDelay = (i*0.28) + "s";
    b.setAttribute("aria-label", KP.SHAPES[key].name);
    b.innerHTML = KP.shapeSvg(key, colors[i]);
    b.addEventListener("click", function(){ tap(b, key); });
    elTray.appendChild(b);
  });
  armHint();
}

/* 7びょう さわらなければ こたえが ぷるぷる する */
function armHint(){
  later(function(){
    var t = elTray.querySelector('.piece[data-key="' + target + '"]');
    if(t && !locked){
      t.classList.remove("idle");
      t.classList.add("hint");
      KP.say(KP.SHAPES[target].name);
    }
  }, 7000);
}

function tap(el, key){
  if(locked) return;
  locked = true;
  clearTimers();
  el.classList.remove("idle","hint");

  /* あなの まんなかへ とばす */
  var a = el.getBoundingClientRect();
  var b = elHole.getBoundingClientRect();
  var dx = (b.left + b.width/2) - (a.left + a.width/2);
  var dy = (b.top + b.height/2) - (a.top + a.height/2);

  if(key === target){
    el.style.setProperty("--dx", dx + "px");
    el.style.setProperty("--dy", dy + "px");
    el.classList.add("flying");
    el.style.transform = "translate(" + dx + "px," + dy + "px)";
    KP.snd.fit();
    later(function(){
      el.classList.add("fitted");
      KP.say(KP.SHAPES[target].name);
      KP.cheer(KP.pick(CHEERS));
      streak++;
      KP.count("katachi");
      drawStars();
      if(streak >= 5){ later(finale, 700); }
      else{ later(newRound, 1150); }
    }, 340);
  }else{
    /* まちがいでも おこらない：ふちで ぽよんと はねて もどる */
    el.classList.add("flying");
    el.style.transform = "translate(" + (dx*0.62) + "px," + (dy*0.62) + "px) scale(1.04)";
    KP.snd.bounce();
    later(function(){
      el.style.transform = "translate(" + (dx*0.74) + "px," + (dy*0.74) + "px) rotate(-7deg)";
      later(function(){
        el.style.transform = "";
        later(function(){
          el.classList.remove("flying");
          el.classList.add("idle");
          locked = false;
          armHint();
        }, 300);
      }, 120);
    }, 300);
  }
}

function finale(){
  KP.cheer("できたね！");
  KP.snd.tada();
  KP.say("よく できました");
  KP.confetti();
  streak = 0;
  later(function(){ drawStars(); newRound(); }, 1800);
}

KP.register("katachi", {
  start: function(){
    elHole  = document.getElementById("k-hole");
    elTray  = document.getElementById("k-tray");
    elStars = document.getElementById("k-stars");
    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");
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
