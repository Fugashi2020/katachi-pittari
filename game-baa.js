/* いないいないばあ
   ぬのを タップすると めくれて、なかから どうぶつや のりものが でてくる。
   まちがいは そもそも 存在しない。さわれば かならず なにかが おきる。
   えは art.js から もらう。 */
(function(){
"use strict";

/* ぬのの いろ。まいかい かわると あきにくい */
var CLOTHS = ["#e8453c","#2d8fd5","#f5b914","#57b84a","#9b5de5","#ef7a3d","#41b8a6"];
var CHEERS = ["ばあ！","わあ！","でてきた！","こんにちは！"];

var elAnimal, elCover;
var pool = [], animal = null, open = false, opened = 0, lastCloth = null;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

/* おなじ どうぶつ・おなじ いろが つづかないように えらぶ */
function nextAnimal(){
  var a;
  do { a = KP.pick(pool); } while(pool.length > 1 && animal && a.id === animal.id);
  return a;
}
function nextCloth(){
  var c;
  do { c = KP.pick(CLOTHS); } while(CLOTHS.length > 1 && c === lastCloth);
  lastCloth = c;
  return c;
}

function hide(immediate){
  clearTimers();
  open = false;

  /* さきに ぬのを おろす。おりきってから なかみを いれかえないと、
     おりてくる とちゅうに つぎの どうぶつが ちらっと 見えてしまう */
  elCover.className = "b-cover";
  elCover.disabled = false;
  if(!immediate){ KP.snd.hide(); }

  later(function(){
    animal = nextAnimal();
    elAnimal.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + animal.svg + '</svg>';
    elAnimal.className = "b-animal waiting";
    elAnimal.setAttribute("aria-label", animal.name);
    elCover.style.setProperty("--cloth", nextCloth());

    /* しばらく さわらなければ おおきく ゆれて さそう */
    later(function(){ if(!open){ elCover.classList.add("calling"); } }, 5000);
  }, immediate ? 0 : 380);
}

/* ぬのを めくって なかみを だす */
function reveal(){
  if(open) return;
  open = true;
  clearTimers();

  elCover.classList.remove("calling");
  elCover.classList.add("lifted");
  elCover.disabled = true;
  KP.snd.open();

  later(function(){
    elAnimal.className = "b-animal shown";
    KP.snd.pop();
    KP.cheer(KP.pick(CHEERS));
    KP.say(animal.name + "。" + (animal.voice || animal.name));
    opened++;
    KP.count("baa");
    if(opened % 5 === 0){ KP.confetti(); }
  }, 170);

  /* しばらく あそばせてから、また かくれる */
  later(function(){ hide(); }, 3600);
}

/* でてきた ものを さわると もういちど なく */
function poke(){
  if(!open) return;
  clearTimers();
  elAnimal.classList.remove("poked");
  void elAnimal.offsetWidth;
  elAnimal.classList.add("poked");
  KP.snd.tap();
  KP.say(animal.voice || animal.name);
  /* さわっている あいだは かくれない */
  later(function(){ hide(); }, 3600);
}

KP.register("baa", {
  start: function(){
    elAnimal = document.getElementById("b-animal");
    elCover  = document.getElementById("b-cover");

    if(!elCover.getAttribute("data-bound")){
      elCover.addEventListener("click", reveal);
      elAnimal.addEventListener("click", poke);
      elCover.setAttribute("data-bound", "1");
    }
    pool = KP.artOf("animal", "vehicle");
    opened = 0;
    animal = null;
    hide(true);
  },
  stop: function(){
    clearTimers();
    open = false;
  },
  restart: function(){
    hide();
  }
});
})();
