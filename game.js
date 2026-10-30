
"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W, H;
let playing = false;
let player, enemies;
let hp = 100, ammo = 12, reserve = 60;
let moveX = 0, moveY = 0;
let jump = 0, reloadTimer = 0;
let damageTimer = 0, toastTimer = 0;
let last = 0, muzzle = 0;
let look = null;

const map = [
 "1111111111111111",
 "1000000000000001",
 "1011100010110001",
 "1000100000010001",
 "1000101111010001",
 "1000001000010001",
 "1110001000010001",
 "1000000000000001",
 "1001110001110001",
 "1000010000010001",
 "1000010000010001",
 "1000000000000001",
 "1011000110011001",
 "1000000000000001",
 "1111111111111111"
];

const MW = map[0].length;
const MH = map.length;
const FOV = 1.05;

function resize() {
  const scale = Math.min(devicePixelRatio || 1, 1.2);
  W = canvas.width = Math.floor(innerWidth * scale);
  H = canvas.height = Math.floor(innerHeight * scale);
}
addEventListener("resize", resize);
resize();

function isWall(x, y) {
  const mx = Math.floor(x);
  const my = Math.floor(y);
  return my < 0 || my >= MH ||
    mx < 0 || mx >= MW || map[my][mx] === "1";
}

function clearPath(x1, y1, x2, y2) {
  const d = Math.hypot(x2-x1, y2-y1);
  for (let i=1; i<d*10; i++) {
    const t = i/(d*10);
    if (isWall(
      x1+(x2-x1)*t,
      y1+(y2-y1)*t
    )) return false;
  }
  return true;
}

function reset() {
  player = {x:2.5, y:2.5, angle:0, walking:0};

  const positions = [
    [12.5,2.5],
    [8.5,5.5],
    [13.5,7.5],
    [3.5,10.5],
    [10.5,12.5]
  ];

  enemies = positions.map(([x,y]) => ({
    x, y, hp:100,
    fire:1+Math.random()*2,
    think:0,
    hit:0
  }));

  hp=100;
  ammo=12;
  reserve=60;
  reloadTimer=0;
  jump=0;
  updateHUD();
}

function updateHUD() {
  document.getElementById("hp").textContent = hp;
  document.getElementById("ammo").textContent =
    ammo + "/" + reserve;
  document.getElementById("enemyCount").textContent =
    enemies.filter(e=>e.hp>0).length;
}

function notify(text) {
  const el=document.getElementById("toast");
  el.textContent=text;
  el.style.opacity=1;
  toastTimer=1.5;
}

function cast(angle, max=20) {
  for(let d=.03; d<max; d+=.025) {
    const x=player.x+Math.cos(angle)*d;
    const y=player.y+Math.sin(angle)*d;
    if(isWall(x,y)) return d;
  }
  return max;
}

function projection(e) {
  const dx=e.x-player.x;
  const dy=e.y-player.y;
  const distance=Math.hypot(dx,dy);
  let angle=Math.atan2(dy,dx)-player.angle;

  while(angle>Math.PI) angle-=Math.PI*2;
  while(angle< -Math.PI) angle+=Math.PI*2;

  return {
    distance,
    angle,
    x:W*(.5+angle/FOV)
  };
}

function shoot() {
  if(!playing || reloadTimer>0) return;

  if(ammo<=0) {
    notify("អស់គ្រាប់! ចុចបញ្ចូលគ្រាប់");
    return;
  }

  ammo--;
  muzzle=.1;

  let target=null;
  let best=999;

  for(const e of enemies) {
    if(e.hp<=0) continue;

    const p=projection(e);
    if(Math.abs(p.angle)<.07 &&
       p.distance<best &&
       clearPath(player.x,player.y,e.x,e.y)) {
      target=e;
      best=p.distance;
    }
  }

  if(target) {
    target.hp-=35;
    target.hit=.15;

    if(target.hp<=0) {
      notify("សត្រូវត្រូវបានកម្ចាត់!");
    }
  }

  updateHUD();

  if(enemies.every(e=>e.hp<=0)) {
    finish(true);
  }
}

function reload() {
  if(!playing || reloadTimer>0 ||
     ammo===12 || reserve<=0) return;

  reloadTimer=1.3;
  notify("កំពុងបញ្ចូលគ្រាប់...");
}

function finish(win) {
  playing=false;

  document.getElementById("resultTitle").textContent =
    win ? "MISSION COMPLETE" : "MISSION FAILED";

  document.getElementById("resultText").textContent =
    win ? "អ្នកបានកម្ចាត់សត្រូវទាំងអស់!" :
    "សុខភាពរបស់អ្នកអស់ហើយ!";

  document.getElementById("result").classList.remove("hidden");
}

function drawWorld() {
  const horizon=H*.49+jump*H*.07;

  let sky=ctx.createLinearGradient(0,0,0,horizon);
  sky.addColorStop(0,"#819493");
  sky.addColorStop(1,"#c2c0a2");
  ctx.fillStyle=sky;
  ctx.fillRect(0,0,W,horizon);

  let ground=ctx.createLinearGradient(0,horizon,0,H);
  ground.addColorStop(0,"#68704e");
  ground.addColorStop(1,"#202b1d");
  ctx.fillStyle=ground;
  ctx.fillRect(0,horizon,W,H-horizon);

  const strip=2;
  const depth=[];

  for(let x=0;x<W;x+=strip) {
    const camera=(x/W-.5)*FOV;
    const angle=player.angle+camera;
    const distance=cast(angle)*Math.cos(camera);
    depth[x]=distance;

    const wallHeight=Math.min(
      H*1.5,
      H*.82/(distance+.01)
    );

    const top=horizon-wallHeight/2;
    const shade=Math.max(25,150-distance*9);
    const side=Math.floor(distance*3)%2;

    ctx.fillStyle=side
      ? `rgb(${shade*.45},${shade*.65},${shade*.38})`
      : `rgb(${shade*.58},${shade*.78},${shade*.48})`;

    ctx.fillRect(x,top,strip+1,wallHeight);

    ctx.fillStyle="#18231955";
    ctx.fillRect(x,top,strip+1,wallHeight*.035);
  }

  drawEnemies(horizon,depth);
  drawWeapon(horizon);
}

function drawEnemies(horizon,depth) {
  const visible=enemies
    .filter(e=>e.hp>0)
    .map(e=>({e,...projection(e)}))
    .filter(o=>Math.abs(o.angle)<FOV*.65)
    .sort((a,b)=>b.distance-a.distance);

  for(const o of visible) {
    const {e,distance,x}=o;
    if(x<0 || x>W) continue;

    const height=Math.min(H*.8,H*.8/(distance+.01));
    const width=height*.42;
    const y=horizon-height*.42+jump*H*.07;

    if(distance>(depth[Math.max(0,Math.min(W-1,Math.floor(x/2)*2))]||20)+.3)
      continue;

    ctx.save();
    ctx.translate(x,y);

    // Legs
    ctx.fillStyle="#303b2b";
    ctx.fillRect(-width*.32,height*.18,width*.25,height*.3);
    ctx.fillRect(width*.08,height*.18,width*.25,height*.3);

    // Uniform
    ctx.fillStyle="#536143";
    ctx.fillRect(-width*.43,0,width*.86,height*.29);

    // Vest
    ctx.fillStyle="#30392b";
    ctx.fillRect(-width*.29,height*.02,width*.58,height*.21);

    // Arms
    ctx.fillStyle="#66734c";
    ctx.fillRect(-width*.53,height*.02,width*.18,height*.2);
    ctx.fillRect(width*.35,height*.02,width*.18,height*.2);

    // Rifle
    ctx.fillStyle="#171d17";
    ctx.fillRect(-width*.02,height*.1,width*.68,height*.035);

    // Head
    ctx.fillStyle="#9a8767";
    ctx.beginPath();
    ctx.arc(0,-height*.1,width*.2,0,Math.PI*2);
    ctx.fill();

    // Helmet
    ctx.fillStyle="#263729";
    ctx.beginPath();
    ctx.ellipse(0,-height*.14,width*.24,height*.1,
      0,Math.PI,Math.PI*2);
    ctx.fill();

    // Face cover
    ctx.fillStyle="#222a22";
    ctx.fillRect(-width*.17,-height*.12,width*.34,height*.11);

    // Health bar
    ctx.fillStyle="#171717";
    ctx.fillRect(-width*.45,-height*.27,width*.9,4);
    ctx.fillStyle="#a9df76";
    ctx.fillRect(-width*.45,-height*.27,width*.9*Math.max(0,e.hp/100),4);

    ctx.restore();
  }
}

function drawWeapon(horizon) {
  const bob=Math.sin(player.walking*9)*3;
  const y=H*.84+bob-jump*H*.07;

  // Hand
  ctx.fillStyle="#947d5d";
  ctx.fillRect(W*.49,y,W*.13,H*.12);

  // Rifle
  ctx.fillStyle="#242a22";
  ctx.fillRect(W*.53,y-H*.055,W*.29,H*.07);

  ctx.fillStyle="#4b553e";
  ctx.fillRect(W*.59,y-H*.09,W*.17,H*.05);

  ctx.fillStyle="#171c17";
  ctx.fillRect(W*.76,y-H*.07,W*.17,H*.018);

  if(muzzle>0) {
    ctx.fillStyle="#ffe59a";
    ctx.beginPath();
    ctx.arc(W*.94,y-H*.06,15,0,Math.PI*2);
    ctx.fill();
  }
}

function update(dt) {
  if(!playing) return;

  if(reloadTimer>0) {
    reloadTimer-=dt;
    if(reloadTimer<=0) {
      const amount=Math.min(12-ammo,reserve);
      ammo+=amount;
      reserve-=amount;
      updateHUD();
      notify("បញ្ចូលគ្រាប់រួចរាល់");
    }
  }

  if(jump>0) jump=Math.max(0,jump-dt*1.7);
  if(muzzle>0) muzzle-=dt;

  if(damageTimer>0) {
    damageTimer-=dt;
    document.getElementById("damage").style.opacity =
      Math.max(0,damageTimer);
  }

  if(toastTimer>0) {
    toastTimer-=dt;
    if(toastTimer<=0)
      document.getElementById("toast").style.opacity=0;
  }

  const speed=2.2*dt;
  const forward=-moveY;
  const strafe=moveX;

  const nx=player.x+
    (Math.cos(player.angle)*forward+
     Math.cos(player.angle+Math.PI/2)*strafe)*speed;

  const ny=player.y+
    (Math.sin(player.angle)*forward+
     Math.sin(player.angle+Math.PI/2)*strafe)*speed;

  if(!isWall(nx,player.y)) player.x=nx;
  if(!isWall(player.x,ny)) player.y=ny;

  if(Math.abs(moveX)+Math.abs(moveY)>.05)
    player.walking+=dt*3;

  enemies.forEach(e=>{
    if(e.hp<=0) return;

    const dx=player.x-e.x;
    const dy=player.y-e.y;
    const d=Math.hypot(dx,dy);

    e.think-=dt;
    e.fire-=dt;
    e.hit=Math.max(0,e.hit-dt);

    if(e.think<=0) {
      e.think=.4+Math.random()*.3;

      if(d>2.2 && d<10) {
        const angle=Math.atan2(dy,dx);
        const nx=e.x+Math.cos(angle)*dt*.55;
        const ny=e.y+Math.sin(angle)*dt*.55;

        if(!isWall(nx,e.y)) e.x=nx;
        if(!isWall(e.x,ny)) e.y=ny;
      }
    }

    if(d<8 && e.fire<=0 &&
       clearPath(e.x,e.y,player.x,player.y)) {
      e.fire=1.3+Math.random()*1.2;

      if(Math.random()<.4) {
        hp=Math.max(0,hp-8);
        damageTimer=.25;
        updateHUD();

        if(hp<=0) finish(false);
      }
    }
  });
}

function loop(time) {
  const dt=Math.min(.05,(time-last)/1000||0);
  last=time;
  update(dt);
  drawWorld();
  requestAnimationFrame(loop);
}

// Mobile movement controls
function bindMove(id,x,y) {
  const el=document.getElementById(id);

  el.addEventListener("pointerdown",e=>{
    e.preventDefault();
    moveX=x;
    moveY=y;
    el.setPointerCapture(e.pointerId);
  });

  const stop=()=>{
    moveX=0;
    moveY=0;
  };

  el.addEventListener("pointerup",stop);
  el.addEventListener("pointercancel",stop);
  el.addEventListener("lostpointercapture",stop);
}

bindMove("forward",0,-1);
bindMove("backward",0,1);
bindMove("left",-1,0);
bindMove("right",1,0);

// Look around by dragging the game
canvas.addEventListener("pointerdown",e=>{
  if(!playing) return;
  look={id:e.pointerId,x:e.clientX};
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove",e=>{
  if(!look || look.id!==e.pointerId) return;
  player.angle+=(e.clientX-look.x)*.006;
  look.x=e.clientX;
});

function stopLook(e) {
  if(look && look.id===e.pointerId) look=null;
}
canvas.addEventListener("pointerup",stopLook);
canvas.addEventListener("pointercancel",stopLook);

document.getElementById("shoot").addEventListener("pointerdown",e=>{
  e.preventDefault();
  shoot();
});

document.getElementById("reload").addEventListener("pointerdown",reload);

document.getElementById("jump").addEventListener("pointerdown",()=>{
  if(playing && jump===0) jump=1;
});

document.getElementById("start").onclick=()=>{
  document.getElementById("intro").classList.add("hidden");
  reset();
  playing=true;
};

document.getElementById("restart").onclick=()=>{
  document.getElementById("result").classList.add("hidden");
  reset();
  playing=true;
};

// Keyboard controls for computer
addEventListener("keydown",e=>{
  if(e.key==="w") moveY=-1;
  if(e.key==="s") moveY=1;
  if(e.key==="a") moveX=-1;
  if(e.key==="d") moveX=1;
  if(e.key===" ") shoot();
  if(e.key.toLowerCase()==="r") reload();
});

addEventListener("keyup",e=>{
  if(["w","s"].includes(e.key)) moveY=0;
  if(["a","d"].includes(e.key)) moveX=0;
});

reset();
requestAnimationFrame(loop);
