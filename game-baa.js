/* いないいないばあ
   ぬのを タップすると めくれて、なかから どうぶつが でてくる。
   まちがいは そもそも 存在しない。さわれば かならず なにかが おきる。 */
(function(){
"use strict";

/* どうぶつは まるい かおに 耳や 鼻を たしただけの おなじ骨格でつくる。
   そろっていた ほうが この月齢には わかりやすい。 */
var ANIMALS = [
  { name:"いぬ", voice:"わんわん", svg:
      '<ellipse cx="19" cy="45" rx="12" ry="21" fill="#a9752f"/>' +
      '<ellipse cx="81" cy="45" rx="12" ry="21" fill="#a9752f"/>' +
      '<circle cx="50" cy="55" r="33" fill="#c68642"/>' +
      '<circle cx="39" cy="50" r="4.6" fill="#3b2a1a"/>' +
      '<circle cx="61" cy="50" r="4.6" fill="#3b2a1a"/>' +
      '<ellipse cx="50" cy="64" rx="7" ry="5.5" fill="#3b2a1a"/>' +
      '<path d="M50,69 Q50,75 43,74" stroke="#3b2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,69 Q50,75 57,74" stroke="#3b2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' },

  { name:"ねこ", voice:"にゃーん", svg:
      '<polygon points="25,32 20,6 45,21" fill="#ef9a4d"/>' +
      '<polygon points="75,32 80,6 55,21" fill="#ef9a4d"/>' +
      '<circle cx="50" cy="55" r="33" fill="#f7b267"/>' +
      '<circle cx="39" cy="51" r="4.6" fill="#3b2a1a"/>' +
      '<circle cx="61" cy="51" r="4.6" fill="#3b2a1a"/>' +
      '<polygon points="50,60 45,65 55,65" fill="#d9614c"/>' +
      '<path d="M50,65 Q50,71 44,70" stroke="#3b2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,65 Q50,71 56,70" stroke="#3b2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M19,54 L36,57" stroke="#3b2a1a" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M19,64 L36,62" stroke="#3b2a1a" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M81,54 L64,57" stroke="#3b2a1a" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M81,64 L64,62" stroke="#3b2a1a" stroke-width="2" stroke-linecap="round"/>' },

  { name:"うさぎ", voice:"ぴょんぴょん", svg:
      '<ellipse cx="36" cy="23" rx="9.5" ry="23" fill="#fdf4f5"/>' +
      '<ellipse cx="64" cy="23" rx="9.5" ry="23" fill="#fdf4f5"/>' +
      '<ellipse cx="36" cy="25" rx="4.6" ry="15" fill="#f6c3ce"/>' +
      '<ellipse cx="64" cy="25" rx="4.6" ry="15" fill="#f6c3ce"/>' +
      '<circle cx="50" cy="61" r="30" fill="#fdf4f5"/>' +
      '<circle cx="40" cy="57" r="4.4" fill="#4a3340"/>' +
      '<circle cx="60" cy="57" r="4.4" fill="#4a3340"/>' +
      '<ellipse cx="50" cy="67" rx="5" ry="4" fill="#f08ca0"/>' +
      '<path d="M50,71 Q50,76 44,75" stroke="#4a3340" stroke-width="2.3" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,71 Q50,76 56,75" stroke="#4a3340" stroke-width="2.3" fill="none" stroke-linecap="round"/>' },

  { name:"ぞう", voice:"ぱおーん", svg:
      '<ellipse cx="17" cy="48" rx="16" ry="21" fill="#7e9bbd"/>' +
      '<ellipse cx="83" cy="48" rx="16" ry="21" fill="#7e9bbd"/>' +
      '<circle cx="50" cy="50" r="30" fill="#8fa8c8"/>' +
      '<path d="M50,60 Q45,76 52,85 Q57,91 64,86" stroke="#8fa8c8" stroke-width="12" fill="none" stroke-linecap="round"/>' +
      '<circle cx="39" cy="45" r="4.4" fill="#2e3f54"/>' +
      '<circle cx="61" cy="45" r="4.4" fill="#2e3f54"/>' },

  { name:"ぶた", voice:"ぶーぶー", svg:
      '<polygon points="27,29 22,7 44,19" fill="#e98fa5"/>' +
      '<polygon points="73,29 78,7 56,19" fill="#e98fa5"/>' +
      '<circle cx="50" cy="55" r="33" fill="#f4a6b8"/>' +
      '<circle cx="38" cy="49" r="4.4" fill="#5a2f3a"/>' +
      '<circle cx="62" cy="49" r="4.4" fill="#5a2f3a"/>' +
      '<ellipse cx="50" cy="65" rx="14" ry="10.5" fill="#e98fa5"/>' +
      '<ellipse cx="45" cy="65" rx="2.7" ry="3.8" fill="#8c4a5a"/>' +
      '<ellipse cx="55" cy="65" rx="2.7" ry="3.8" fill="#8c4a5a"/>' },

  { name:"くま", voice:"がおー", svg:
      '<circle cx="24" cy="26" r="14" fill="#8d6748"/>' +
      '<circle cx="76" cy="26" r="14" fill="#8d6748"/>' +
      '<circle cx="24" cy="26" r="7" fill="#c49a70"/>' +
      '<circle cx="76" cy="26" r="7" fill="#c49a70"/>' +
      '<circle cx="50" cy="57" r="32" fill="#a07853"/>' +
      '<circle cx="39" cy="51" r="4.4" fill="#3b2a1a"/>' +
      '<circle cx="61" cy="51" r="4.4" fill="#3b2a1a"/>' +
      '<ellipse cx="50" cy="66" rx="13" ry="10" fill="#e6d2b3"/>' +
      '<ellipse cx="50" cy="62" rx="5.5" ry="4" fill="#3b2a1a"/>' +
      '<path d="M50,66 L50,70" stroke="#3b2a1a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M50,70 Q46,73 43,70" stroke="#3b2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M50,70 Q54,73 57,70" stroke="#3b2a1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' },

  { name:"ひよこ", voice:"ぴよぴよ", svg:
      '<circle cx="50" cy="55" r="33" fill="#f7d154"/>' +
      '<circle cx="27" cy="62" r="6.5" fill="#f2a08c" opacity="0.75"/>' +
      '<circle cx="73" cy="62" r="6.5" fill="#f2a08c" opacity="0.75"/>' +
      '<circle cx="39" cy="49" r="4.4" fill="#3b2a1a"/>' +
      '<circle cx="61" cy="49" r="4.4" fill="#3b2a1a"/>' +
      '<polygon points="50,58 41,64 50,71 59,64" fill="#f19a3e"/>' },

  { name:"かえる", voice:"けろけろ", svg:
      '<circle cx="30" cy="27" r="15" fill="#7cc576"/>' +
      '<circle cx="70" cy="27" r="15" fill="#7cc576"/>' +
      '<circle cx="30" cy="27" r="10" fill="#ffffff"/>' +
      '<circle cx="70" cy="27" r="10" fill="#ffffff"/>' +
      '<circle cx="30" cy="28" r="5" fill="#27482a"/>' +
      '<circle cx="70" cy="28" r="5" fill="#27482a"/>' +
      '<circle cx="50" cy="59" r="30" fill="#8ed086"/>' +
      '<circle cx="42" cy="55" r="2.5" fill="#27482a"/>' +
      '<circle cx="58" cy="55" r="2.5" fill="#27482a"/>' +
      '<path d="M34,63 Q50,77 66,63" stroke="#27482a" stroke-width="3.2" fill="none" stroke-linecap="round"/>' }
];

/* ぬのの いろ。まいかい かわると あきにくい */
var CLOTHS = ["#e8453c","#2d8fd5","#f5b914","#57b84a","#9b5de5","#ef7a3d","#41b8a6"];

var CHEERS = ["ばあ！","わあ！","でてきた！","こんにちは！"];

var elStage, elAnimal, elCover;
var animal = null, open = false, opened = 0, lastCloth = null;
var timers = [];

function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

/* おなじ どうぶつ・おなじ いろが つづかないように えらぶ */
function nextAnimal(){
  var a;
  do { a = KP.pick(ANIMALS); } while(ANIMALS.length > 1 && animal && a.name === animal.name);
  return a;
}
function nextCloth(){
  var c;
  do { c = KP.pick(CLOTHS); } while(CLOTHS.length > 1 && c === lastCloth);
  lastCloth = c;
  return c;
}

/* ぬのを かぶせて、なかで なにかが うごいている じょうたいにする */
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

/* ぬのを めくって どうぶつを だす */
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
    KP.say(animal.name + "。" + animal.voice);
    opened++;
    KP.count("baa");
    if(opened % 5 === 0){ KP.confetti(); }
  }, 170);

  /* しばらく あそばせてから、また かくれる */
  later(function(){ hide(); }, 3600);
}

/* でてきた どうぶつを さわると もういちど なく */
function poke(){
  if(!open) return;
  clearTimers();
  elAnimal.classList.remove("poked");
  void elAnimal.offsetWidth;
  elAnimal.classList.add("poked");
  KP.snd.tap();
  KP.say(animal.voice);
  /* さわっている あいだは かくれない */
  later(function(){ hide(); }, 3600);
}

KP.register("baa", {
  start: function(){
    elStage  = document.getElementById("b-stage");
    elAnimal = document.getElementById("b-animal");
    elCover  = document.getElementById("b-cover");

    if(!elCover.getAttribute("data-bound")){
      elCover.addEventListener("click", reveal);
      elAnimal.addEventListener("click", poke);
      elCover.setAttribute("data-bound", "1");
    }
    opened = 0;
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
