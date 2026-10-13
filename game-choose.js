/* 「こえで いわれた えを えらぶ」あそび の 骨組み。
   2つの あそびが この 土台を 共有する。

   どれかな    … ぜんぶの えから えらぶ（いぬ と くるま のように おおきく ちがう）
   どのくるま？ … のりものだけから えらぶ（しょうぼうしゃ と きゅうきゅうしゃ の
                  ように にた ものの なかから えらぶので、ひとつ むずかしい）

   1歳半〜2歳は はなすより きいて わかるほうが さきに そだつ。
   レベル = ならぶ えの まいすう - 1（レベル1で2まい、レベル5で6まい）。 */
(function(){
"use strict";

var CHEERS = ["せいかい！","あたり！","そうそう！","すごい！"];

/* まいすうごとの れつ数。たて画面で きれいに ならぶように */
var COLS = { 2:2, 3:3, 4:2, 5:3, 6:3 };

var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><polygon class="s" points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/></svg>';

function makeChooser(cfg){
  var elGrid, elCall, elCallText, elStars, starEls;
  var pool = [], target = null, locked = false, misses = 0, streak = 0;
  var timers = [];

  function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

  function drawStars(){
    for(var i=0;i<starEls.length;i++){
      if(i < streak){ starEls[i].classList.add("on"); }
      else{ starEls[i].classList.remove("on"); }
    }
  }

  /* おだいの 言い方。
     どれかな は つたわりやすい よびかけ（わんわん・ブーブー）。
     どのくるま？ は しゃしゅめいを おぼえるのが ねらいなので せいしきな なまえ。
     のりものだけが ならぶ ばめんで「ブーブー」と いうと、
     トラックも ゴミしゅうしゅうしゃも ブーブー なので えらべない。 */
  function label(){
    if(!target) return "";
    return cfg.useName ? target.name : (target.call || target.name);
  }
  function speakTarget(){
    if(!target) return;
    KP.say(label() + "、どれかな？");
  }

  function newRound(){
    locked = false;
    misses = 0;
    clearTimers();

    var n = (KP.S.level | 0) + 1;
    if(n < 2){ n = 2; }
    if(n > 6){ n = 6; }
    if(n > pool.length){ n = pool.length; }

    var picked = KP.shuffle(pool).slice(0, n);
    target = KP.pick(picked);

    elGrid.style.setProperty("--cols", COLS[n] || 3);
    elGrid.innerHTML = "";
    picked.forEach(function(it, i){
      var b = document.createElement("button");
      b.className = "card";
      b.type = "button";
      b.setAttribute("data-id", it.id);
      b.setAttribute("aria-label", it.name);
      b.style.animationDelay = (i * 0.06) + "s";
      b.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true">' + it.svg + '</svg>';
      b.addEventListener("click", function(){ tap(b, it); });
      elGrid.appendChild(b);
    });

    /* おやが よこから 補助できるように、おだいを 文字でも だす */
    elCallText.textContent = label();

    /* タイルを おした そうさの ながれの なかなので、iOS でも よみあげが とおる */
    speakTarget();
    armHint();
  }

  /* しばらく さわらなければ こたえが ぷるぷるして、もういちど よびかける */
  function armHint(){
    later(function(){
      if(locked) return;
      var t = elGrid.querySelector('.card[data-id="' + target.id + '"]');
      if(t){ t.classList.add("hint"); }
      speakTarget();
    }, 6500);
  }

  function tap(el, it){
    if(locked) return;

    if(it.id === target.id){
      locked = true;
      clearTimers();
      el.classList.remove("hint");
      el.classList.add("correct");
      KP.snd.fit();
      KP.cheer(KP.pick(CHEERS));
      /* せいかいの ときだけ せいしきな なまえも おしえる */
      KP.say(target.name + " だね");
      streak++;
      KP.count(cfg.countKey);
      drawStars();
      if(streak >= 5){ later(finale, 900); }
      else{ later(newRound, 1700); }
    }else{
      /* まちがいでも おこらない。ぷるっと ゆれて そのまま つづける */
      misses++;
      el.classList.remove("shake");
      void el.offsetWidth;
      el.classList.add("shake");
      KP.snd.bounce();
      if(misses >= 2){
        var t = elGrid.querySelector('.card[data-id="' + target.id + '"]');
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

  return {
    start: function(){
      elGrid     = document.getElementById(cfg.prefix + "-grid");
      elCall     = document.getElementById(cfg.prefix + "-call");
      elCallText = document.getElementById(cfg.prefix + "-call-text");
      elStars    = document.getElementById(cfg.prefix + "-stars");

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

      pool = cfg.pool();
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
  };
}

/* どれかな … ぜんぶの えから */
KP.register("doreka", makeChooser({
  prefix: "d",
  countKey: "doreka",
  pool: function(){ return KP.ART; }
}));

/* どのくるま？ … のりものだけから。にた ものの なかで 見わける */
KP.register("kuruma", makeChooser({
  prefix: "u",
  countKey: "kuruma",
  pool: function(){ return KP.artOf("vehicle"); },
  useName: true
}));
})();
