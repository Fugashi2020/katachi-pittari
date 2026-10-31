/* いろ あてっこ（2歳むけ）
   「あかい ふうせん、どれかな？」と きいて、その いろの ふうせんを えらぶ。

   えらぶ ものを ぜんぶ おなじ かたち（ふうせん）に してあるのが かんじん。
   かたちが ちがうと かたちで えらべてしまい、いろの もんだいに ならない。

   いろは 20しょく。
   「なまえが わかれている」ことを 基準に えらんである。
   きんいろ・ぎんいろ のように、ひらたい 絵では きいろ・はいいろ と
   見分けが つかない（＝ただしく こたえても まちがいに なる）ものは いれない。

   レベルは 段階方式。かずだけでなく、でてくる いろ そのものが ふえる。

     レベル1 … 4しょく から 2まい   あか あお きいろ みどり
     レベル2 … 8しょく から 3まい   ＋ オレンジ むらさき ちゃいろ しろ
     レベル3 … 12しょく から 4まい  ＋ ピンク みずいろ きみどり くろ
     レベル4 … 16しょく から 5まい  ＋ こんいろ ふかみどり あおみどり はいいろ
     レベル5 … 20しょく から 6まい  ＋ えんじ ベージュ クリームいろ あかむらさき

   どの だんかいも、まえの だんかいで おぼえた いろの「となり」を たす。
   レベル2の オレンジ は あかの となり、レベル3の ピンク も あかの となり。
   いきなり にた いろ どうしが ならばないので、つまずく ところが わかる。 */
(function(){
"use strict";

/* tier = この いろが でてくる レベル（このレベル いじょうで 出題に くわわる）
   hex = ふうせんの いろ / edge = ふちと むすびめ（くらい いろ）
   しろ・クリーム でも 見えるように、ふうせんには ふちを つけてある */
var COLORS = [
  { id:"red", tier:1,       name:"あか",         adj:"あかい",         hex:"#e8453c", edge:"#b32f28" },
  { id:"pink", tier:3,      name:"ピンク",       adj:"ピンクの",       hex:"#f58bb4", edge:"#c9618a" },
  { id:"crimson", tier:5,   name:"えんじ",       adj:"えんじの",       hex:"#8e2436", edge:"#5e141f" },
  { id:"orange", tier:2,    name:"オレンジ",     adj:"オレンジの",     hex:"#ef7a3d", edge:"#c25a26" },
  { id:"brown", tier:2,     name:"ちゃいろ",     adj:"ちゃいろい",     hex:"#8a5a33", edge:"#5e3b1f" },
  { id:"beige", tier:5,     name:"ベージュ",     adj:"ベージュの",     hex:"#d9b887", edge:"#ab8b5d" },
  { id:"yellow", tier:1,    name:"きいろ",       adj:"きいろい",       hex:"#f5b914", edge:"#c7930a" },
  { id:"cream", tier:5,     name:"クリームいろ", adj:"クリームいろの", hex:"#fbf4a8", edge:"#c9c179" },
  { id:"lime", tier:3,      name:"きみどり",     adj:"きみどりの",     hex:"#a7d13f", edge:"#7da521" },
  { id:"green", tier:1,     name:"みどり",       adj:"みどりの",       hex:"#4caf4a", edge:"#3a8536" },
  { id:"darkgreen", tier:4, name:"ふかみどり",   adj:"ふかみどりの",   hex:"#17663a", edge:"#0d4425" },
  { id:"teal", tier:4,      name:"あおみどり",   adj:"あおみどりの",   hex:"#1aab9b", edge:"#0f7d71" },
  { id:"skyblue", tier:3,   name:"みずいろ",     adj:"みずいろの",     hex:"#79d2ea", edge:"#4aa5bd" },
  { id:"blue", tier:1,      name:"あお",         adj:"あおい",         hex:"#2d8fd5", edge:"#1f6ca3" },
  { id:"navy", tier:4,      name:"こんいろ",     adj:"こんいろの",     hex:"#1f2f6b", edge:"#121c45" },
  { id:"purple", tier:2,    name:"むらさき",     adj:"むらさきの",     hex:"#9b5de5", edge:"#7840b8" },
  { id:"magenta", tier:5,   name:"あかむらさき", adj:"あかむらさきの", hex:"#c43a92", edge:"#94246c" },
  { id:"white", tier:2,     name:"しろ",         adj:"しろい",         hex:"#ffffff", edge:"#bfc7cb" },
  { id:"gray", tier:4,      name:"はいいろ",     adj:"はいいろの",     hex:"#9aa3a9", edge:"#6f787e" },
  { id:"black", tier:3,     name:"くろ",         adj:"くろい",         hex:"#333a3f", edge:"#15191c" }
];

var CHEERS = ["せいかい！","あたり！","そうそう！","すごい！"];
var COLS = { 2:2, 3:3, 4:2, 5:3, 6:3 };

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

/* ふうせん。いろ いがいの 手がかりが のこらないよう、かたちは ぜんぶ おなじ。
   くらい いろでも つやが 見えるよう、ハイライトは しろで かさねる */
function balloonSvg(c){
  return '<svg viewBox="0 0 100 100" aria-hidden="true">'
    + '<path d="M50,74 Q56,84 48,96" stroke="#8a9a94" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
    + '<ellipse cx="50" cy="42" rx="30" ry="35" fill="' + c.hex + '" stroke="' + c.edge + '" stroke-width="2"/>'
    + '<path d="M50,77 L44,70 L56,70 Z" fill="' + c.edge + '"/>'
    + '<ellipse cx="38" cy="29" rx="7.5" ry="11" fill="#ffffff" opacity="0.4" transform="rotate(-22 38 29)"/>'
    + '<path d="M28,52 Q34,66 48,72" stroke="#ffffff" stroke-width="3" opacity="0.22" fill="none" stroke-linecap="round"/>'
    + '</svg>';
}

var elGrid, elCall, elCallText, elStars, starEls;
var target = null, locked = false, misses = 0, streak = 0;
var lastId = null;
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

  var lv = KP.S.level | 0;
  if(lv < 1){ lv = 1; }
  if(lv > 5){ lv = 5; }
  var n = lv + 1;

  /* レベルの ぶんだけ いろを あける（段階方式）。
     レベル1は 4しょく、レベル5で 20しょく ぜんぶ。 */
  var pool = COLORS.filter(function(c){ return c.tier <= lv; });

  /* おなじ いろが つづけて おだいに ならないようにする */
  var picked, t;
  for(var tries = 0; tries < 24; tries++){
    picked = KP.shuffle(pool).slice(0, n);
    t = KP.pick(picked);
    if(t.id !== lastId){ break; }
  }
  target = t;
  lastId = t.id;

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
    lastId = null;
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
