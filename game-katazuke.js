/* おかたづけ（2歳むけ）
   でてきた えを、あう はこに いれる。

   てで やることは タップだけ。むずかしいのは
   「いぬも ねこも ぞうも、ぜんぶ どうぶつ」という まとめかた のほう。
   2歳は この「かたまりで とらえる」ちからが そだつ 時期。 */
(function(){
"use strict";

var GROUPS = [
  { id:"animal",  name:"どうぶつ", icon:"dog" },
  { id:"vehicle", name:"のりもの", icon:"car" },
  { id:"food",    name:"たべもの", icon:"apple" }
];
var CHEERS = ["そうそう！","はいった！","せいかい！","じょうず！"];

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

var elItem, elBoxes, elStars, starEls;
var pool = [], item = null, streak = 0, locked = false;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function drawStars(){
  for(var i=0;i<starEls.length;i++){
    if(i < streak){ starEls[i].classList.add("on"); }
    else{ starEls[i].classList.remove("on"); }
  }
}

/* はこは いちど つくれば そのまま つかう。
   なかみが わからないと えらべないので、はこには えの ラベルを つける */
function buildBoxes(){
  elBoxes.innerHTML = "";
  GROUPS.forEach(function(g){
    var ic = KP.ART.filter(function(a){ return a.id === g.icon; })[0];
    var b = document.createElement("button");
    b.className = "z-box";
    b.type = "button";
    b.setAttribute("data-group", g.id);
    b.setAttribute("aria-label", g.name + "の はこ");
    b.innerHTML = '<span class="z-mouth"></span>'
      + '<span class="z-icon"><svg viewBox="0 0 100 100" aria-hidden="true">' + ic.svg + '</svg></span>';
    b.addEventListener("click", function(){ drop(b, g); });
    elBoxes.appendChild(b);
  });
}

function newRound(){
  locked = false;
  clearTimers();

  var prev = item;
  do { item = KP.pick(pool); } while(pool.length > 1 && prev && item.id === prev.id);

  elItem.style.transition = "none";
  elItem.style.transform = "";
  elItem.style.opacity = "";
  elItem.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + item.svg + '</svg>';
  elItem.setAttribute("aria-label", item.name);
  elItem.classList.remove("pop");
  void elItem.offsetWidth;
  elItem.classList.add("pop");

  KP.say(item.call || item.name);
  armHint();
}

/* 8びょう さわらなければ、あう はこが ゆれて もういちど よびかける */
function armHint(){
  later(function(){
    if(locked) return;
    var b = elBoxes.querySelector('.z-box[data-group="' + item.group + '"]');
    if(b){
      b.classList.add("hint");
      later(function(){ b.classList.remove("hint"); }, 1800);
    }
    KP.say(item.call || item.name);
  }, 8000);
}

function drop(box, g){
  if(locked) return;
  if(g.id === item.group){ accept(box, g); }
  else{ refuse(box); }
}

function accept(box, g){
  locked = true;
  clearTimers();

  /* えが はこに すいこまれる */
  var ir = elItem.getBoundingClientRect();
  var br = box.getBoundingClientRect();
  var dx = (br.left + br.width/2) - (ir.left + ir.width/2);
  var dy = (br.top + br.height*0.3) - (ir.top + ir.height/2);

  elItem.classList.remove("pop");
  elItem.style.transition = "transform .42s cubic-bezier(.4,.1,.3,1), opacity .22s .22s";
  elItem.style.transform = "translate(" + dx + "px," + dy + "px) scale(.28) rotate(9deg)";
  elItem.style.opacity = "0";

  box.classList.add("gulp");
  KP.snd.fit();
  later(function(){ box.classList.remove("gulp"); }, 420);

  later(function(){
    KP.cheer(KP.pick(CHEERS));
    /* かたまりの なまえを おしえる。ここが この あそびの ねらい */
    KP.say("そう、" + g.name + " だね");
    streak++;
    KP.count("katazuke");
    drawStars();
    if(streak >= 5){ later(finale, 800); }
    else{ later(newRound, 1450); }
  }, 320);
}

/* ちがう はこでも おこらない。はこが ぷるっと ゆれて、えは もどる */
function refuse(box){
  KP.snd.bounce();
  box.classList.remove("shake");
  void box.offsetWidth;
  box.classList.add("shake");

  var ir = elItem.getBoundingClientRect();
  var br = box.getBoundingClientRect();
  var dx = ((br.left + br.width/2) - (ir.left + ir.width/2)) * 0.22;
  var dy = ((br.top + br.height/2) - (ir.top + ir.height/2)) * 0.22;

  elItem.classList.remove("pop");
  elItem.style.transition = "transform .16s ease-out";
  elItem.style.transform = "translate(" + dx + "px," + dy + "px)";
  later(function(){
    elItem.style.transition = "transform .32s cubic-bezier(.3,1.3,.5,1)";
    elItem.style.transform = "";
  }, 170);
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

KP.register("katazuke", {
  start: function(){
    elItem  = document.getElementById("z-item");
    elBoxes = document.getElementById("z-boxes");
    elStars = document.getElementById("z-stars");

    if(!elStars.childElementCount){
      var html = "";
      for(var i=0;i<5;i++){ html += STAR_SVG; }
      elStars.innerHTML = html;
    }
    starEls = elStars.querySelectorAll(".s");

    if(!elBoxes.childElementCount){ buildBoxes(); }

    /* はこが 3つ なので、その3グループだけ つかう */
    pool = KP.artOf("animal", "vehicle", "food");
    streak = 0;
    item = null;
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
