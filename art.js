/* えの ライブラリ。
   いないいないばあ と どれかな で 共有する。ここに1つ足すと 両方で つかえる。

   name  … せいしきな なまえ（「いぬ」）
   call  … よびかけ。1歳半に つたわる 言い方（「わんわん」）
   voice … いないいないばあ で だすときの こえ
   group … animal / vehicle / food / thing

   どの えも viewBox 0 0 100 100。まんなかに おさまるように 描く。 */
(function(){
"use strict";

KP.ART = [

/* ============ どうぶつ ============ */
{ id:"dog", name:"いぬ", call:"わんわん", voice:"わんわん", group:"animal", svg:
  '<ellipse cx="19" cy="45" rx="12" ry="21" fill="#a9752f"/>' +
  '<ellipse cx="81" cy="45" rx="12" ry="21" fill="#a9752f"/>' +
  '<circle cx="50" cy="55" r="33" fill="#c68642"/>' +
  '<circle cx="39" cy="50" r="4.6" fill="#3b2a1a"/>' +
  '<circle cx="61" cy="50" r="4.6" fill="#3b2a1a"/>' +
  '<ellipse cx="50" cy="64" rx="7" ry="5.5" fill="#3b2a1a"/>' +
  '<path d="M50,69 Q50,75 43,74" stroke="#3b2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '<path d="M50,69 Q50,75 57,74" stroke="#3b2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' },

{ id:"cat", name:"ねこ", call:"にゃんにゃん", voice:"にゃーん", group:"animal", svg:
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

{ id:"rabbit", name:"うさぎ", call:"うさぎさん", voice:"ぴょんぴょん", group:"animal", svg:
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

{ id:"elephant", name:"ぞう", call:"ぞうさん", voice:"ぱおーん", group:"animal", svg:
  '<ellipse cx="17" cy="48" rx="16" ry="21" fill="#7e9bbd"/>' +
  '<ellipse cx="83" cy="48" rx="16" ry="21" fill="#7e9bbd"/>' +
  '<circle cx="50" cy="50" r="30" fill="#8fa8c8"/>' +
  '<path d="M50,60 Q45,76 52,85 Q57,91 64,86" stroke="#8fa8c8" stroke-width="12" fill="none" stroke-linecap="round"/>' +
  '<circle cx="39" cy="45" r="4.4" fill="#2e3f54"/>' +
  '<circle cx="61" cy="45" r="4.4" fill="#2e3f54"/>' },

{ id:"pig", name:"ぶた", call:"ぶたさん", voice:"ぶーぶー", group:"animal", svg:
  '<polygon points="27,29 22,7 44,19" fill="#e98fa5"/>' +
  '<polygon points="73,29 78,7 56,19" fill="#e98fa5"/>' +
  '<circle cx="50" cy="55" r="33" fill="#f4a6b8"/>' +
  '<circle cx="38" cy="49" r="4.4" fill="#5a2f3a"/>' +
  '<circle cx="62" cy="49" r="4.4" fill="#5a2f3a"/>' +
  '<ellipse cx="50" cy="65" rx="14" ry="10.5" fill="#e98fa5"/>' +
  '<ellipse cx="45" cy="65" rx="2.7" ry="3.8" fill="#8c4a5a"/>' +
  '<ellipse cx="55" cy="65" rx="2.7" ry="3.8" fill="#8c4a5a"/>' },

{ id:"bear", name:"くま", call:"くまさん", voice:"がおー", group:"animal", svg:
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

{ id:"chick", name:"ひよこ", call:"ひよこ", voice:"ぴよぴよ", group:"animal", svg:
  '<circle cx="50" cy="55" r="33" fill="#f7d154"/>' +
  '<circle cx="27" cy="62" r="6.5" fill="#f2a08c" opacity="0.75"/>' +
  '<circle cx="73" cy="62" r="6.5" fill="#f2a08c" opacity="0.75"/>' +
  '<circle cx="39" cy="49" r="4.4" fill="#3b2a1a"/>' +
  '<circle cx="61" cy="49" r="4.4" fill="#3b2a1a"/>' +
  '<polygon points="50,58 41,64 50,71 59,64" fill="#f19a3e"/>' },

{ id:"frog", name:"かえる", call:"かえる", voice:"けろけろ", group:"animal", svg:
  '<circle cx="30" cy="27" r="15" fill="#7cc576"/>' +
  '<circle cx="70" cy="27" r="15" fill="#7cc576"/>' +
  '<circle cx="30" cy="27" r="10" fill="#ffffff"/>' +
  '<circle cx="70" cy="27" r="10" fill="#ffffff"/>' +
  '<circle cx="30" cy="28" r="5" fill="#27482a"/>' +
  '<circle cx="70" cy="28" r="5" fill="#27482a"/>' +
  '<circle cx="50" cy="59" r="30" fill="#8ed086"/>' +
  '<circle cx="42" cy="55" r="2.5" fill="#27482a"/>' +
  '<circle cx="58" cy="55" r="2.5" fill="#27482a"/>' +
  '<path d="M34,63 Q50,77 66,63" stroke="#27482a" stroke-width="3.2" fill="none" stroke-linecap="round"/>' },

/* ============ のりもの ============ */
{ id:"car", name:"くるま", call:"ブーブー", voice:"ブーブー", group:"vehicle", svg:
  '<rect x="12" y="46" width="76" height="27" rx="9" fill="#e8453c"/>' +
  '<path d="M27,47 L33,29 Q35,25 40,25 L63,25 Q68,25 70,29 L75,47 Z" fill="#e8453c"/>' +
  '<rect x="36" y="30" width="13" height="13" rx="3" fill="#bfe3f5"/>' +
  '<rect x="53" y="30" width="13" height="13" rx="3" fill="#bfe3f5"/>' +
  '<rect x="78" y="54" width="9" height="7" rx="3" fill="#f7d154"/>' +
  '<circle cx="32" cy="74" r="11" fill="#38363a"/>' +
  '<circle cx="32" cy="74" r="4.6" fill="#cfcfcf"/>' +
  '<circle cx="69" cy="74" r="11" fill="#38363a"/>' +
  '<circle cx="69" cy="74" r="4.6" fill="#cfcfcf"/>' },

{ id:"train", name:"でんしゃ", call:"でんしゃ", voice:"ガタンゴトン", group:"vehicle", svg:
  '<rect x="21" y="14" width="58" height="64" rx="12" fill="#2d8fd5"/>' +
  '<rect x="29" y="24" width="42" height="23" rx="6" fill="#bfe3f5"/>' +
  '<rect x="29" y="55" width="42" height="11" rx="5" fill="#f5b914"/>' +
  '<circle cx="33" cy="72" r="4.5" fill="#fff6d8"/>' +
  '<circle cx="67" cy="72" r="4.5" fill="#fff6d8"/>' +
  '<rect x="13" y="82" width="74" height="7" rx="3.5" fill="#8d6748"/>' +
  '<rect x="26" y="89" width="8" height="6" fill="#6f4f34"/>' +
  '<rect x="66" y="89" width="8" height="6" fill="#6f4f34"/>' },

{ id:"bus", name:"バス", call:"バス", voice:"プップー", group:"vehicle", svg:
  '<rect x="10" y="28" width="80" height="44" rx="10" fill="#f5b914"/>' +
  '<rect x="17" y="36" width="17" height="16" rx="4" fill="#bfe3f5"/>' +
  '<rect x="41" y="36" width="17" height="16" rx="4" fill="#bfe3f5"/>' +
  '<rect x="65" y="36" width="17" height="16" rx="4" fill="#bfe3f5"/>' +
  '<rect x="10" y="57" width="80" height="6" fill="#e07a1f"/>' +
  '<circle cx="29" cy="74" r="10" fill="#38363a"/>' +
  '<circle cx="29" cy="74" r="4.2" fill="#cfcfcf"/>' +
  '<circle cx="71" cy="74" r="10" fill="#38363a"/>' +
  '<circle cx="71" cy="74" r="4.2" fill="#cfcfcf"/>' },

{ id:"plane", name:"ひこうき", call:"ひこうき", voice:"ブーン", group:"vehicle", svg:
  '<path d="M44,45 L34,18 L49,18 L65,43 Z" fill="#9db6c9"/>' +
  '<path d="M44,57 L34,84 L49,84 L65,59 Z" fill="#9db6c9"/>' +
  '<path d="M20,44 L9,28 L19,28 L30,42 Z" fill="#9db6c9"/>' +
  '<ellipse cx="52" cy="51" rx="41" ry="12" fill="#e7eef3"/>' +
  '<circle cx="76" cy="50" r="4.4" fill="#8fb8d0"/>' +
  '<circle cx="64" cy="50" r="4.4" fill="#8fb8d0"/>' +
  '<path d="M86,51 Q93,51 93,47" stroke="#c9d8e2" stroke-width="4" fill="none" stroke-linecap="round"/>' },

/* ============ たべもの ============ */
{ id:"banana", name:"バナナ", call:"バナナ", group:"food", svg:
  '<path d="M27,20 Q15,54 40,76 Q66,96 88,72 L79,62 Q61,80 45,64 Q30,48 36,23 Z" fill="#f5d24a"/>' +
  '<path d="M79,62 Q86,66 88,72" fill="none" stroke="#e0b93a" stroke-width="3"/>' +
  '<path d="M27,20 L36,23" stroke="#8d6748" stroke-width="7" stroke-linecap="round"/>' },

{ id:"apple", name:"りんご", call:"りんご", group:"food", svg:
  '<circle cx="50" cy="59" r="31" fill="#e8453c"/>' +
  '<path d="M50,31 Q49,21 45,14" stroke="#8d6748" stroke-width="5" fill="none" stroke-linecap="round"/>' +
  '<path d="M52,27 Q66,15 76,22 Q71,36 54,33 Z" fill="#57b84a"/>' +
  '<ellipse cx="37" cy="49" rx="6" ry="9" fill="#ffffff" opacity="0.32" transform="rotate(-22 37 49)"/>' },

{ id:"bread", name:"パン", call:"パン", group:"food", svg:
  '<path d="M20,46 Q20,24 50,24 Q80,24 80,46 L80,76 Q80,82 74,82 L26,82 Q20,82 20,76 Z" fill="#e0a95f"/>' +
  '<path d="M28,49 Q28,34 50,34 Q72,34 72,49 L72,74 L28,74 Z" fill="#fbe6bd"/>' },

{ id:"strawberry", name:"いちご", call:"いちご", group:"food", svg:
  '<path d="M50,90 Q19,71 21,47 Q23,33 50,33 Q77,33 79,47 Q81,71 50,90 Z" fill="#e8453c"/>' +
  '<path d="M34,33 Q42,21 50,26 Q58,21 66,33 Q57,37 50,35 Q43,37 34,33 Z" fill="#57b84a"/>' +
  '<path d="M50,26 L50,15" stroke="#57b84a" stroke-width="4.5" stroke-linecap="round"/>' +
  '<circle cx="39" cy="50" r="2.3" fill="#fff0b8"/>' +
  '<circle cx="52" cy="46" r="2.3" fill="#fff0b8"/>' +
  '<circle cx="63" cy="52" r="2.3" fill="#fff0b8"/>' +
  '<circle cx="45" cy="62" r="2.3" fill="#fff0b8"/>' +
  '<circle cx="58" cy="66" r="2.3" fill="#fff0b8"/>' +
  '<circle cx="50" cy="76" r="2.3" fill="#fff0b8"/>' },

/* ============ みのまわりの もの ============ */
{ id:"ball", name:"ボール", call:"ボール", group:"thing", svg:
  '<circle cx="50" cy="52" r="32" fill="#f7d154"/>' +
  '<path d="M18,52 Q50,30 82,52" stroke="#e8453c" stroke-width="8" fill="none"/>' +
  '<path d="M18,52 Q50,74 82,52" stroke="#2d8fd5" stroke-width="8" fill="none"/>' +
  '<circle cx="50" cy="52" r="32" fill="none" stroke="#d8b13c" stroke-width="2.5"/>' },

{ id:"shoe", name:"くつ", call:"くつ", group:"thing", svg:
  '<path d="M17,54 Q17,42 28,42 L40,42 L50,51 L74,57 Q87,60 87,70 L87,74 L17,74 Z" fill="#2d8fd5"/>' +
  '<rect x="14" y="72" width="76" height="9" rx="4.5" fill="#f2f2f2"/>' +
  '<path d="M31,47 L44,54" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>' +
  '<path d="M27,53 L41,60" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>' }

];

/* ============ かたち ============
   かたちぴったり（タップ）と はこんでぴったり（ドラッグ）で 共有する。
   おなじ かたちを つかうので、ここを 1か所 なおせば 両方に きく。 */
KP.SHAPES = {
  circle:   { name:"まる",    svg:'<circle cx="50" cy="50" r="46"/>' },
  square:   { name:"しかく",  svg:'<rect x="7" y="7" width="86" height="86" rx="10"/>' },
  triangle: { name:"さんかく", svg:'<polygon points="50,6 95,90 5,90"/>' },
  star:     { name:"ほし",    svg:'<polygon points="50,3 61.8,33.8 94.7,35.5 69,56.2 77.6,88 50,70 22.4,88 31,56.2 5.3,35.5 38.2,33.8"/>' },
  heart:    { name:"ハート",  svg:'<path d="M50,89 C19,66 7,48 7,34 C7,19.5 18.5,10 31,10 C39,10 46,14 50,21 C54,14 61,10 69,10 C81.5,10 93,19.5 93,34 C93,48 81,66 50,89 Z"/>' }
};
KP.SHAPE_KEYS = Object.keys(KP.SHAPES);
KP.SHAPE_COLORS = ["var(--c1)","var(--c2)","var(--c3)","var(--c4)","var(--c5)"];

/* かたちを SVG に くるむ */
KP.shapeSvg = function(key, color){
  return '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="' + color + '">'
    + KP.SHAPES[key].svg + '</g></svg>';
};

/* グループで しぼりこむ */
KP.artOf = function(){
  var want = Array.prototype.slice.call(arguments);
  return KP.ART.filter(function(x){ return want.indexOf(x.group) >= 0; });
};
})();
