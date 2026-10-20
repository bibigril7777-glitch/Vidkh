<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>VidKH</title>
<style>
:root{--bg:#fff;--bg2:#f2f4f8;--tx:#10131a;--mu:#5c6577;--ln:#e1e5ec;--ac:#2f6bff;--acx:#fff;--hh:56px;--bn:0px}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0f1218;--bg2:#1b2029;--tx:#eef1f6;--mu:#9aa4b6;--ln:#2a3140;--ac:#6b93ff;--acx:#0f1218}}
:root[data-theme=dark]{--bg:#0f1218;--bg2:#1b2029;--tx:#eef1f6;--mu:#9aa4b6;--ln:#2a3140;--ac:#6b93ff;--acx:#0f1218}
*{box-sizing:border-box;margin:0}
html,body{height:100%}
body{background:var(--bg);color:var(--tx);font:15px/1.5 "Noto Sans Khmer","Khmer OS",system-ui,sans-serif;padding-top:env(safe-area-inset-top)}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
header{position:sticky;top:env(safe-area-inset-top,0);z-index:5;height:var(--hh);background:var(--bg);border-bottom:1px solid var(--ln);display:flex;gap:8px;align-items:center;padding:0 12px}
.logo{font-weight:800;font-size:20px;display:flex;align-items:center;gap:6px;white-space:nowrap}
.logo i{width:30px;height:22px;border-radius:7px;background:var(--ac);display:inline-grid;place-items:center}
.logo i:after{content:"";border-left:8px solid var(--acx);border-top:5px solid transparent;border-bottom:5px solid transparent;margin-left:2px}
.search{flex:1;max-width:520px;margin:0 auto;display:flex}
.search input{flex:1;min-width:0;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);border-radius:20px;padding:7px 16px;font:inherit}
.ib{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:18px;background:var(--bg2);flex:none;overflow:hidden}
.ib img{width:100%;height:100%;object-fit:cover}
.layout{display:flex}
nav{width:190px;flex:none;padding:10px 8px;position:sticky;top:calc(var(--hh) + env(safe-area-inset-top,0px));height:calc(100vh - var(--hh));border-right:1px solid var(--ln)}
nav button{display:flex;gap:12px;width:100%;padding:9px 12px;border-radius:10px;text-align:left}
nav button:hover,nav button.on{background:var(--bg2)}
nav button.on{font-weight:700;color:var(--ac)}
main{flex:1;min-width:0;padding:14px}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px}
.chips button{padding:5px 14px;border-radius:8px;background:var(--bg2);white-space:nowrap}
.chips button.on{background:var(--tx);color:var(--bg)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px 12px}
.grid.p{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.grid.ph{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px}
.card{cursor:pointer;text-align:left;display:block;width:100%}
.th{position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:var(--bg2)}
.th.po{aspect-ratio:2/3}
.th video,.th img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}
.dur{position:absolute;right:6px;bottom:6px;background:#000c;color:#fff;font-size:12px;padding:1px 6px;border-radius:5px}
.meta{display:flex;gap:10px;margin-top:9px}
.av{width:36px;height:36px;border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;font-weight:700;object-fit:cover}
.av.big{width:84px;height:84px;font-size:32px}
.t{font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.s{color:var(--mu);font-size:13px}
.watch{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px}
.player{width:100%;aspect-ratio:16/9;background:#000;border-radius:12px;display:block}
.watch h1{font-size:19px;margin:12px 0 8px}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}
.act{display:flex;gap:8px;flex-wrap:wrap}
.pill{padding:7px 14px;border-radius:20px;background:var(--bg2)}
.pill.on{background:var(--ac);color:var(--acx)}
.sub{background:var(--tx);color:var(--bg);padding:7px 16px;border-radius:20px;font-weight:600;margin-left:6px}
.sub.on{background:var(--bg2);color:var(--tx)}
.desc{background:var(--bg2);border-radius:12px;padding:12px;margin:14px 0}
.cm{display:flex;gap:10px;margin:14px 0;align-items:center}
.cm.top{align-items:flex-start}
.cmi{display:flex;gap:8px;margin:12px 0}
.cmi input{flex:1;background:none;color:var(--tx);border:0;border-bottom:1px solid var(--ln);padding:6px 2px;font:inherit}
.rel{display:flex;gap:10px;margin-bottom:12px;cursor:pointer;text-align:left;width:100%}
.rel .th{width:160px;flex:none}
.empty{padding:60px 10px;text-align:center;color:var(--mu)}
.hero{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;align-items:center;margin-bottom:22px}
.hero h2{font-size:26px;margin-bottom:6px}
.hero p{color:var(--mu);margin-bottom:12px}
.reels{height:calc(100dvh - var(--hh) - var(--bn) - env(safe-area-inset-top,0px));max-width:430px;margin:0 auto;overflow-y:auto;scroll-snap-type:y mandatory;border-radius:14px;background:#000}
.reel{height:100%;scroll-snap-align:start;scroll-snap-stop:always;position:relative}
.reel video{width:100%;height:100%;object-fit:contain;display:block}
.ra{position:absolute;right:8px;bottom:70px;display:flex;flex-direction:column;gap:12px;align-items:center}
.ra button{width:46px;height:46px;border-radius:50%;background:#0007;color:#fff;font-size:20px;display:grid;place-items:center;position:relative}
.ra button.on{color:#ff5470}
.ra small{position:absolute;bottom:-14px;font-size:11px}
.rc{position:absolute;left:12px;right:70px;bottom:14px;color:#fff;text-shadow:0 1px 4px #000}
.chead{display:flex;gap:16px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
.chead h2{font-size:22px}
.tabs{display:flex;gap:8px;overflow-x:auto;margin:6px 0 14px}
.ph-t{position:relative;aspect-ratio:1;border-radius:6px;overflow:hidden;cursor:pointer;display:block;width:100%;background:var(--bg2)}
.ph-t img{width:100%;height:100%;object-fit:cover}
dialog{border:1px solid var(--ln);border-radius:14px;background:var(--bg);color:var(--tx);padding:18px;width:min(92vw,420px);margin:auto}
dialog::backdrop{background:#0008}
dialog label{display:block;margin:10px 0 4px;font-size:13px;color:var(--mu)}
dialog input[type=text],dialog select{width:100%;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);border-radius:8px;padding:8px;font:inherit}
dialog input[type=file]{width:100%}
.bar{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
#lb{width:min(96vw,900px)}
#lb img{width:100%;max-height:75vh;object-fit:contain;border-radius:8px}
[hidden]{display:none!important}
button:disabled{opacity:.5;cursor:default}
.clk{text-align:right;line-height:1.12;font-variant-numeric:tabular-nums;padding:2px 2px;flex:none;white-space:nowrap}
.clk b{display:block;font-size:15px}
.clk small{display:block;color:var(--mu);font-size:11px}
.coin{padding:5px 10px;flex:none;font-weight:700;white-space:nowrap}
#toast{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--bn) + 18px + env(safe-area-inset-bottom,0px));background:var(--tx);color:var(--bg);padding:10px 16px;border-radius:12px;z-index:20;max-width:90vw;text-align:center}
.wal{max-width:640px;margin:0 auto}
.box{border:1px solid var(--ln);border-radius:14px;padding:14px;margin-bottom:14px}
.days{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin:12px 0}
.day{background:var(--bg2);border-radius:10px;padding:8px 2px;text-align:center;font-size:12px}
.day b{display:block;font-size:13px}
.day.ok{opacity:.5}
.day.cur{outline:2px solid var(--ac)}
.bar2{height:10px;border-radius:6px;background:var(--bg2);overflow:hidden;margin-top:8px}
.bar2 i{display:block;height:100%;background:var(--ac)}
.shop{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
#de{width:min(94vw,460px);max-height:92vh;overflow:auto}
#de input[type=range]{width:100%}
#ecv{width:100%;height:auto;max-height:45vh;object-fit:contain;border-radius:8px;background:var(--bg2)}
.ph0{height:100%;display:grid;place-items:center;align-content:center;gap:2px;font-size:30px;background:linear-gradient(135deg,var(--bg2),var(--ln));text-align:center}
.ph0 small{font-size:12px;color:var(--mu)}
#ed{position:fixed;inset:0;z-index:15;background:#8a93a3;display:flex;flex-direction:column;padding-top:env(safe-area-inset-top)}
.edtop{display:flex;gap:6px;align-items:center;padding:8px;background:var(--bg);overflow-x:auto}
.edtop button{white-space:nowrap;flex:none}
.edtop input{flex:1;min-width:110px;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);border-radius:8px;padding:6px 10px;font:inherit}
.hb{display:flex;gap:4px;align-items:center;overflow-x:auto;padding:6px 8px;background:var(--bg);border-top:1px solid var(--ln);border-bottom:1px solid var(--ln)}
.hb button{min-width:34px;height:34px;border-radius:8px;background:var(--bg2);flex:none;font-size:14px}
.hb select{height:34px;border-radius:8px;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);max-width:110px;flex:none;font:inherit;font-size:13px}
.hb input[type=color]{width:34px;height:34px;padding:0;border:0;background:none;flex:none}
.edwrap{flex:1;overflow:auto;padding:12px}
#paperbox{margin:0 auto;position:relative}
#paper{position:absolute;left:0;top:0;transform-origin:top left;color:#111;box-shadow:0 2px 14px #0005;outline:0;overflow-wrap:anywhere;font:16px/1.6 "Noto Sans Khmer","Khmer OS",system-ui,sans-serif}
#paper h1{font-size:28px;margin:.4em 0}#paper h2{font-size:21px;margin:.8em 0 .3em}#paper h3{font-size:17px}
#paper ul,#paper ol{padding-left:24px}
button.sc{border:0;text-align:left;width:100%;cursor:pointer}
@media print{body{padding:0!important}body>*:not(#ed){display:none!important}#ed{position:static!important;display:block!important;background:#fff!important;padding:0!important}.edtop,.hb{display:none!important}.edwrap{overflow:visible!important;padding:0!important}#paperbox{width:auto!important;height:auto!important}#paper{position:static!important;transform:none!important;box-shadow:none!important}}
.dgm{max-height:40vh;overflow:auto;margin:8px 0}
.bm{max-width:92%;padding:8px 12px;border-radius:12px;margin:6px 0;background:var(--bg2);white-space:pre-wrap;overflow-wrap:anywhere}
.bm.me{margin-left:auto;background:var(--ac);color:var(--acx)}
.bm .pill{margin-top:6px;display:inline-block}
.lockbox{display:grid;place-items:center;align-content:center;gap:2px;text-align:center;padding:16px;background:var(--bg2);border-radius:12px;min-height:160px}
.lockbox.wl{aspect-ratio:16/9;width:100%}
.lockbox.rl{height:100%;background:#111;color:#fff;border-radius:0}
.lockbox.rl .s{color:#ccc}
.ptag{position:absolute;left:6px;bottom:6px;background:#000c;color:#fff;font-size:12px;padding:1px 6px;border-radius:5px}
.ptag.inl{position:static;display:inline-block;background:var(--bg2);color:var(--tx)}
.chk{display:flex;gap:8px;align-items:flex-start;margin:8px 0;font-size:13px;color:var(--mu)}
.chk input{margin-top:3px;flex:none}
.apl{border-radius:12px;overflow:hidden;background:var(--bg2)}
.apl .ph0{height:auto}
.aud{width:100%;display:block}
.tvp{margin-bottom:12px}
.tvp video{width:100%;aspect-ratio:16/9;background:#000;border-radius:12px;display:block}
.tvi{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:8px;border-radius:10px;border:1px solid var(--ln);margin-bottom:6px;cursor:pointer}
.tvi img,.tvi .lg0{width:40px;height:40px;border-radius:8px;background:var(--bg2);flex:none;object-fit:contain;display:grid;place-items:center}
.fvid{width:100%;border-radius:12px;margin-top:8px;max-height:60vh;background:#000;display:block}
.mc{min-width:0;border:1px solid var(--ln);border-radius:12px;padding:8px}
.mc .t{margin-top:6px}
.sel{width:100%;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);border-radius:8px;padding:8px;font:inherit}
.ib.bell{position:relative;overflow:visible}
.bdg{position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;padding:0 4px;border-radius:9px;background:#e5252a;color:#fff;font:700 11px/18px system-ui,sans-serif;text-align:center;font-style:normal;box-shadow:0 0 0 2px var(--bg)}
.bdg.pop{animation:bpop .5s}
@keyframes bpop{0%{transform:scale(.4)}55%{transform:scale(1.35)}100%{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){.bdg.pop{animation:none}}
.nt{display:flex;gap:10px;width:100%;text-align:left;padding:10px;border-radius:10px;align-items:flex-start;position:relative}
.nt.un{background:var(--bg2)}
.nt .ni{font-size:22px;flex:none}
.nt .dt{position:absolute;right:10px;top:14px;width:9px;height:9px;border-radius:50%;background:#e5252a}
.ta{width:100%;background:var(--bg2);color:var(--tx);border:1px solid var(--ln);border-radius:10px;padding:10px;font:inherit;resize:vertical}
.pimg{display:grid;gap:4px;margin-top:8px;border-radius:10px;overflow:hidden}
.pimg.n1{grid-template-columns:1fr}.pimg.n2,.pimg.n4{grid-template-columns:1fr 1fr}.pimg.n3{grid-template-columns:1fr 1fr 1fr}
.pimg button{padding:0;aspect-ratio:1;overflow:hidden;background:var(--bg2);display:block;width:100%}
.pimg.n1 button{aspect-ratio:4/3}
.pimg img{width:100%;height:100%;object-fit:cover;display:block}
.pv{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.pv img{width:56px;height:56px;object-fit:cover;border-radius:8px}
.lw{font-size:20px;font-weight:700;line-height:1.3}
:root{--sb:50px}
.logo{margin-right:auto}
.sbar{position:sticky;top:calc(var(--hh) + env(safe-area-inset-top,0px));z-index:4;background:var(--bg);padding:8px 12px;border-bottom:1px solid var(--ln)}
.sbar .search{margin:0 auto}
nav{top:calc(var(--hh) + var(--sb) + env(safe-area-inset-top,0px));height:calc(100vh - var(--hh) - var(--sb))}
.card .t{font-size:14px}
.card .s{font-size:12px}
.card .av{width:32px;height:32px;font-size:14px}
a.pill{display:inline-block;text-decoration:none;color:inherit}
a.pill.on{color:var(--acx)}
.socg{display:grid;gap:8px;margin-top:10px}
.soc{display:flex;gap:8px;align-items:center}
.sc{flex:1;display:flex;align-items:center;gap:12px;padding:10px;border-radius:12px;background:var(--bg2);text-decoration:none;color:inherit}
.si{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:800}
.res{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--ln);align-items:flex-start}
@media(max-width:900px){.watch,.hero{grid-template-columns:1fr}}
@media(max-width:720px){
 :root{--bn:58px}
 nav{position:fixed;inset:auto 0 0 0;top:auto;width:auto;height:auto;display:flex;justify-content:space-around;background:var(--bg);border-top:1px solid var(--ln);border-right:0;z-index:6;padding:4px 4px env(safe-area-inset-bottom,0px)}
 nav button{flex-direction:column;align-items:center;gap:0;font-size:10px;padding:4px 1px;width:auto;flex:1;min-width:0;overflow:hidden;white-space:nowrap}
 main{padding:10px 10px 80px}
 .logo span{display:none}
 header{gap:5px;padding:0 8px}
 #th{display:none}
 .grid{grid-template-columns:repeat(2,1fr);gap:14px 8px}
 .card .av{width:28px;height:28px;font-size:12px}
 .card .t{font-size:13px}
 .card .s{font-size:11px}
 .chips button{padding:4px 12px;font-size:13px}
 .grid.p{grid-template-columns:repeat(3,1fr)}
 .grid.ph{grid-template-columns:repeat(3,1fr)}
 .reels{border-radius:0}
 main.rm{padding:0 0 var(--bn)}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style>
<style id="pgs"></style>
</head>
<body>
<header>
 <button class="logo" data-p="home" aria-label="ទំព័រដើម"><i></i><span>VidKH</span></button>
 <button class="ib" data-a="up" title="បង្ហោះ" aria-label="បង្ហោះ">＋</button>
 <button class="ib bell" data-a="bell" title="ការជូនដំណឹង" aria-label="ការជូនដំណឹង">🔔<i class="bdg" id="bdg" hidden>0</i></button>
 <button class="ib" id="th" title="ផ្លាស់ប្តូរពណ៌" aria-label="ផ្លាស់ប្តូរពណ៌">◐</button>
 <button class="pill coin" id="coin" data-p="wallet" aria-label="កាក់"></button>
 <button class="ib" id="acc" aria-label="គណនី"></button>
 <button class="clk" id="clk" aria-label="ម៉ោង"></button>
</header>
<div class="sbar" id="sbar"><form class="search" id="sf"><input id="q" type="search" placeholder="ស្វែងរក" aria-label="ស្វែងរក"></form></div>
<div class="layout"><nav id="nav"></nav><main id="app"></main></div>

<dialog id="din">
 <h3>ចូលគណនី</h3>
 <div id="gbtn" style="margin:14px 0;min-height:4px"></div>
 <p class="s" id="gnote" hidden>ដើម្បីប្រើ Google សូមដាក់ GOOGLE_CLIENT_ID ក្នុងកូដ (មើលការណែនាំ)។</p>
 <label>ឬបង្កើតគណនីក្នុងឧបករណ៍នេះ</label>
 <input type="text" id="ln" placeholder="ឈ្មោះរបស់អ្នក">
 <div class="bar"><button class="pill" onclick="this.closest('dialog').close()">បោះបង់</button><button class="pill on" id="lok">បង្កើត</button></div>
</dialog>

<dialog id="du">
 <h3>បង្ហោះ</h3>
 <label>ប្រភេទ</label>
 <select id="uk"><option value="video">វីដេអូ</option><option value="reel">Reels (វីដេអូខ្លី)</option><option value="movie">ភាពយន្ត</option><option value="photo">រូបថត</option><option value="audio">🎵 ចម្លេង (អូឌីយ៉ូ)</option></select>
 <label>ប្រភេទមាតិកា</label><select id="ucat"><option value="">ទូទៅ</option><option value="music">🎵 តន្ត្រី</option><option value="game">🎮 ហ្គេម</option><option value="place">📍 កន្លែង</option><option value="cartoon">🧸 តុក្កតា</option><option value="story">សម្រាយរឿង</option><option value="tech">បច្ចេកវិទ្យា</option><option value="news">ព័ត៌មាន</option></select>
 <label>ចំណងជើង</label><input type="text" id="ut">
 <label>ឯកសារ</label><input type="file" id="uf" accept="video/*">
 <p class="s" style="margin-top:6px">💾 កម្មវិធីរក្សាទុកច្បាប់ចម្លងផ្ទាល់ខ្លួន។ បង្ហោះរួច អ្នកអាចលុបឯកសារដើមពីទូរស័ព្ទបាន ហើយនៅតែមើលក្នុងកម្មវិធីបាន (លុបទិន្នន័យកម្មវិធី ឬ uninstall នឹងបាត់ទាំងអស់)។</p>
 <label>🪙 តម្លៃមើល (កាក់) · 0 = ឥតគិតថ្លៃ</label><input type="text" id="upr" inputmode="numeric" value="10">
 <label class="chk"><input type="checkbox" id="ufr" checked> ឥតគិតថ្លៃ ៧ ថ្ងៃដំបូង រួចទើបបង់កាក់</label>
 <label class="chk"><input type="checkbox" id="uow"> ខ្ញុំជាម្ចាស់ ឬមានសិទ្ធិលក់មាតិកានេះ (ត្រូវបញ្ជាក់បើដាក់តម្លៃ)</label>
 <p class="s" id="um" style="margin-top:8px"></p>
 <div class="bar"><button class="pill" onclick="this.closest('dialog').close()">បោះបង់</button><button class="pill on" id="us">បង្ហោះ</button></div>
</dialog>

<dialog id="lb">
 <img id="lbi" alt="">
 <div class="row" style="margin-top:10px"><b id="lbt"></b><div class="act"><button class="pill" id="lbe" data-a="edit">✂ កាត់ត</button><button class="pill" id="lbd" data-a="del">លុប</button><button class="pill" onclick="this.closest('dialog').close()">បិទ</button></div></div>
</dialog>

<dialog id="de">
 <h3 id="det"></h3>
 <div id="dep">
  <canvas id="ecv"></canvas>
  <div class="act" style="margin:8px 0"><button class="pill" data-a="auto">✨ ស្វ័យប្រវត្តិ</button><button class="pill" data-a="rot">⟳ បង្វិល</button></div>
  <label>ពន្លឺ</label><input type="range" id="eb" min="50" max="150" value="100">
  <label>កុងត្រាស្ត</label><input type="range" id="ec" min="50" max="150" value="100">
  <label>ពណ៌ស្រស់</label><input type="range" id="es" min="0" max="200" value="100">
  <label>ឆ្លុះពណ៌</label><select id="ef"><option value="n">ដើម</option><option value="bw">ស-ខ្មៅ</option><option value="sp">ពណ៌ចាស់</option><option value="wm">កក់ក្តៅ</option><option value="cl">ត្រជាក់</option></select>
  <label>កាត់ទំហំ</label><select id="ek"><option value="0">ដើម</option><option value="1:1">1:1</option><option value="16:9">16:9</option><option value="9:16">9:16</option><option value="4:5">4:5</option></select>
 </div>
 <div id="dev">
  <video id="evp" controls playsinline style="width:100%;max-height:45vh;background:#000;border-radius:8px"></video>
  <label>ចាប់ផ្តើម (វិនាទី)</label><input type="range" id="e1" min="0" value="0">
  <label>បញ្ចប់ (វិនាទី)</label><input type="range" id="e2" min="0" value="0">
  <p class="s" id="evl"></p>
 </div>
 <p class="s" id="dem" style="margin-top:8px"></p>
 <div class="bar"><button class="pill" onclick="this.closest('dialog').close()">បោះបង់</button><button class="pill on" id="dok">រក្សាទុក (ប្រើ ១ ក្រេឌីត)</butto
