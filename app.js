// =============================================
// 싸이월드 미니홈피 - 미니룸 에디터
// =============================================
(() => {
'use strict';

const TW=64,TH=32,GRID=8,WALL_H=150,CW=660,CH=440,OX=340,OY=155;

// =============================================
// PALETTE
// =============================================
const P={
    floor1:'#EDE0CA',floor2:'#E0D2B8',floorEdge:'#D0C0A8',
    wallBack:'#FFF5F0',wallLeft:'#FFEDE5',
    wallLine:'rgba(255,160,130,0.18)',
    baseboard:'#D4A574',baseboardS:'#C08A5A',
    shadow:'rgba(80,40,20,0.06)',
    hover:'rgba(255,255,255,0.4)',valid:'rgba(120,255,160,0.35)',
    invalid:'rgba(255,100,100,0.3)',select:'rgba(255,140,40,0.3)',
};

// =============================================
// MINI-ME SPRITE SYSTEM
// =============================================
const CPX=3;
const CHAR_BASE=[
    '....HHHH....','...HHHHHH...','..HHHHHHHH..','..HSSSSSSH..',
    '..SEWSSEWS..','..SSSSSSSS..','..SRSSSSRS..','...SSMSSS...',
    '....SSSS....','....TTTT....','...TTttTT...','..aTTttTTa..',
    '..aaTTTTaa..','....BBBB....','....BBbB....','....BBBB....',
    '....B..B....','...FF..FF...',
];

// OUTFIT ITEMS - each has id, name, colors, optional row overrides & extra pixels
const HAIR_ITEMS=[
    {id:'h0',name:'기본 단발',c:'#5D4037'},
    {id:'h1',name:'긴 생머리',c:'#1A1A1A',
     extra:[[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10]]},
    {id:'h2',name:'트윈테일',c:'#8D6E63',
     rows:{0:'HH..HHHH..HH',1:'.H.HHHHHH.H.'}},
    {id:'h3',name:'금발 웨이브',c:'#FFD54F',
     extra:[[3,1],[4,1],[5,1],[6,1],[7,1],[3,10],[4,10],[5,10],[6,10],[7,10]]},
    {id:'h4',name:'핑크 보브',c:'#F48FB1',
     extra:[[3,1],[4,1],[5,1],[3,10],[4,10],[5,10]]},
    {id:'h5',name:'하늘색 숏',c:'#64B5F6'},
];
const TOP_ITEMS=[
    {id:'t0',name:'기본 티셔츠',c:'#FF7043',s:'#E64A19'},
    {id:'t1',name:'파란 후드티',c:'#42A5F5',s:'#1E88E5',
     rows:{8:'...XSSSSX...',9:'...XTTTTX...'},xc:{X:'#1565C0'}},
    {id:'t2',name:'핑크 니트',c:'#F48FB1',s:'#EC407A'},
    {id:'t3',name:'흰 와이셔츠',c:'#FAFAFA',s:'#E0E0E0',
     rows:{9:'....TXXt....'},xc:{X:'#CFD8DC'}},
    {id:'t4',name:'초록 맨투맨',c:'#66BB6A',s:'#43A047'},
    {id:'t5',name:'줄무늬 티',c:'#5C6BC0',s:'#3F51B5',
     rows:{10:'...TsTsTs...',11:'..aTsTsTsa..'},xc:{}},
    {id:'t6',name:'노란 원피스',c:'#FFD54F',s:'#FFC107',
     rows:{13:'...TTTTTT...',14:'..TTTTTTTT..',15:'..TTTTTTTT..',16:'....S..S....'}},
    {id:'t7',name:'보라 크롭',c:'#CE93D8',s:'#AB47BC',
     rows:{12:'............'}},
];
const BOT_ITEMS=[
    {id:'b0',name:'청바지',c:'#5C6BC0',s:'#3F51B5'},
    {id:'b1',name:'핑크 치마',c:'#F48FB1',s:'#EC407A',
     rows:{13:'...BBBBBB...',14:'..BBBBBBBB..',15:'...BBBBBB...',16:'....S..S....'}},
    {id:'b2',name:'카키 반바지',c:'#A1887F',s:'#8D6E63',
     rows:{15:'....S..S....',16:'....S..S....'}},
    {id:'b3',name:'검정 스키니',c:'#424242',s:'#212121'},
    {id:'b4',name:'체크 치마',c:'#EF5350',s:'#C62828',
     rows:{13:'..BsBsBsB...',14:'.BsBsBsBsB..',15:'..BsBsBsB...',16:'....S..S....'}},
    {id:'b5',name:'데님 롱스커트',c:'#78909C',s:'#546E7A',
     rows:{13:'...BBBBBB...',14:'..BBBBBBBB..',15:'..BBBBBBBB..',16:'...BBBBBB...'}},
];
const SHOE_ITEMS=[
    {id:'s0',name:'흰 운동화',c:'#FAFAFA'},
    {id:'s1',name:'갈색 부츠',c:'#795548',rows:{16:'...FB..BF...',17:'...FF..FF...'}},
    {id:'s2',name:'핑크 슬리퍼',c:'#F48FB1'},
    {id:'s3',name:'검정 로퍼',c:'#424242'},
    {id:'s4',name:'빨간 운동화',c:'#EF5350'},
];

let outfit={hair:0,top:0,bottom:0,shoes:0};

// =============================================
// WALLPAPERS & FLOORS
// =============================================
const WALLPAPERS=[
    {id:'w0',name:'기본 핑크',back:'#FFF5F0',left:'#FFEDE5',accent:'rgba(255,170,140,0.18)',pattern:'dots'},
    {id:'w1',name:'민트 그린',back:'#E8F5E9',left:'#DCEDC8',accent:'rgba(120,180,120,0.2)',pattern:'dots'},
    {id:'w2',name:'하늘색',back:'#E3F2FD',left:'#BBDEFB',accent:'rgba(100,160,210,0.18)',pattern:'dots'},
    {id:'w3',name:'베이지',back:'#FFF8E7',left:'#FFECB3',accent:'rgba(200,160,80,0.18)',pattern:'dots'},
    {id:'w4',name:'라벤더',back:'#F3E5F5',left:'#E1BEE7',accent:'rgba(170,100,180,0.18)',pattern:'dots'},
    {id:'w5',name:'레몬',back:'#FFFDE7',left:'#FFF9C4',accent:'rgba(220,180,40,0.2)',pattern:'dots'},
    {id:'w6',name:'하트 무늬',back:'#FFEBEE',left:'#FFCDD2',accent:'rgba(244,143,177,0.55)',pattern:'heart'},
    {id:'w7',name:'별 가득',back:'#283593',left:'#1A237E',accent:'#FFEB3B',pattern:'star'},
    {id:'w8',name:'격자',back:'#FAFAFA',left:'#F5F5F5',accent:'rgba(180,180,180,0.45)',pattern:'grid'},
    {id:'w9',name:'줄무늬',back:'#FFF0F0',left:'#FFE6E6',accent:'rgba(255,140,140,0.25)',pattern:'stripe'},
    {id:'w10',name:'땡땡이',back:'#FFCDD2',left:'#FFB6BC',accent:'#FFFFFF',pattern:'bigdot'},
    {id:'w11',name:'밤하늘',back:'#1A237E',left:'#0D1854',accent:'#FFFFFF',pattern:'star'},
];

const FLOORS=[
    {id:'f0',name:'나무 바닥',c1:'#EDE0CA',c2:'#E0D2B8',edge:'#D0C0A8'},
    {id:'f1',name:'어두운 나무',c1:'#8D6E63',c2:'#795548',edge:'#5D4037'},
    {id:'f2',name:'대리석',c1:'#FAFAFA',c2:'#F0F0F0',edge:'#D8D8D8'},
    {id:'f3',name:'잔디',c1:'#A5D6A7',c2:'#81C784',edge:'#66BB6A'},
    {id:'f4',name:'벽돌',c1:'#D7572F',c2:'#BF360C',edge:'#8B2500'},
    {id:'f5',name:'핑크 타일',c1:'#FCE4EC',c2:'#F8BBD0',edge:'#F48FB1'},
    {id:'f6',name:'하늘 타일',c1:'#E1F5FE',c2:'#B3E5FC',edge:'#81D4FA'},
    {id:'f7',name:'레드 카펫',c1:'#EF5350',c2:'#E53935',edge:'#C62828'},
    {id:'f8',name:'바다',c1:'#4FC3F7',c2:'#29B6F6',edge:'#0288D1'},
    {id:'f9',name:'체크',c1:'#FFFFFF',c2:'#212121',edge:'#666666'},
    {id:'f10',name:'민트',c1:'#B2DFDB',c2:'#80CBC4',edge:'#4DB6AC'},
    {id:'f11',name:'골드',c1:'#FFE082',c2:'#FFD54F',edge:'#FFB300'},
];

let room={wallpaper:0,floor:0};

function getEquipped(){
    return{
        hair:HAIR_ITEMS[outfit.hair],top:TOP_ITEMS[outfit.top],
        bottom:BOT_ITEMS[outfit.bottom],shoes:SHOE_ITEMS[outfit.shoes],
    };
}

function drawCharSprite(cx,centerX,bottomY,outfitOverride,pxSize){
    const px=pxSize||CPX;
    const eq=outfitOverride||getEquipped();
    const W=12,H=18,ox=Math.round(centerX-W*px/2),oy=Math.round(bottomY-H*px);
    const cm={
        'H':eq.hair.c,'S':'#FFCC80','E':'#333','W':'#FFF',
        'M':'#FF8080','R':'#FFCC80','T':eq.top.c,'t':eq.top.s||eq.top.c,
        'a':'#FFCC80','B':eq.bottom.c,'b':eq.bottom.s||eq.bottom.c,
        'F':eq.shoes.c,'s':'#FFF',
    };
    // Merge extra colors from items
    [eq.top,eq.bottom,eq.shoes].forEach(it=>{if(it.xc)Object.assign(cm,it.xc)});
    // Build final rows: base, then apply overrides from each item
    const rows=[...CHAR_BASE];
    [eq.hair,eq.top,eq.bottom,eq.shoes].forEach(it=>{
        if(it.rows)Object.entries(it.rows).forEach(([r,s])=>{if(s)rows[r]=s});
    });
    // Hair extras behind body
    if(eq.hair.extra){
        cx.fillStyle=eq.hair.c;
        eq.hair.extra.forEach(([r,c])=>cx.fillRect(ox+c*px,oy+r*px,px,px));
    }
    // Draw rows
    rows.forEach((row,r)=>{
        for(let c=0;c<row.length;c++){
            const ch=row[c];
            if(ch!=='.'&&cm[ch]){cx.fillStyle=cm[ch];cx.fillRect(ox+c*px,oy+r*px,px,px)}
        }
    });
    // Blush
    cx.fillStyle='rgba(255,130,130,0.35)';
    if(rows[6])for(let c=0;c<rows[6].length;c++)
        if(rows[6][c]==='R')cx.fillRect(ox+c*px,oy+6*px,px,px);
}

// Pets
const PETS={
    cat:{sprite:['..CC.CC.','.CCCCCC.','.CeeCee.','.CCCCCC.','..CnnC..','.CCCCCC.','.CCCCCC.','..C..C..'],
         colors:{C:'#FFE0B2',e:'#333',n:'#FF8A80'}},
    dog:{sprite:['DD...DD.','DDD.DDD.','.DDDDDD.','.DeeDDe.','.DDDDDD.','..DnnD..','.DDDDDD.','..D..D..'],
         colors:{D:'#BCAAA4',e:'#333',n:'#795548'}},
    hamster:{sprite:['...HH...','..HHHH..','.HeHHeH.','.HHnnHH.','.HHHHHH.','.HHHHHH.','..HHHH..','..H..H..'],
         colors:{H:'#D7B896',e:'#222',n:'#6B4423'}},
    rabbit:{sprite:['.R....R.','.R....R.','.RR..RR.','.ReRRRe.','.RRnRRR.','.RRRRRR.','.RRRRRR.','..R..R..'],
         colors:{R:'#F5F5F5',e:'#333',n:'#FF8A80'}},
    turtle:{sprite:['..HH....','.HHHH...','.SSSSSS.','.SgGGgS.','.SGGGGS.','.SgGGgS.','.SSSSSSL','.L....L.'],
         colors:{H:'#A5D6A7',S:'#558B2F',G:'#33691E',g:'#689F38',L:'#6B8E23'}},
    penguin:{sprite:['..BBBB..','.BBBBBB.','.BeWWeB.','.BBrrBB.','.BWWWWB.','.BWWWWB.','.BWWWWB.','.O....O.'],
         colors:{B:'#212121',W:'#FAFAFA',e:'#FFFFFF',r:'#FF9800',O:'#FF6F00'}},
    chick:{sprite:['...YY...','..YYYY..','.YeYYeY.','.YYrrYY.','.YYYYYY.','.YYYYYY.','..YYYY..','.O....O.'],
         colors:{Y:'#FFEB3B',e:'#222',r:'#FF6F00',O:'#FF9800'}},
    panda:{sprite:['.BB..BB.','.WWWWWW.','.WBeeBW.','.WWrrWW.','.WWWWWW.','.BWWWWB.','.BWWWWB.','.B....B.'],
         colors:{B:'#212121',W:'#FAFAFA',e:'#FAFAFA',r:'#FF8A80'}},
};
function drawPet(cx,cX,bY,pet){
    const ps=3,d=PETS[pet],w=8,h=d.sprite.length;
    const ox=Math.round(cX-w*ps/2),oy=Math.round(bY-h*ps);
    d.sprite.forEach((row,r)=>{
        for(let c=0;c<row.length;c++){
            const ch=row[c];
            if(ch!=='.'&&d.colors[ch]){cx.fillStyle=d.colors[ch];cx.fillRect(ox+c*ps,oy+r*ps,ps,ps)}
        }
    });
}

// =============================================
// STATE
// =============================================
let canvas,ctx,tool='place',selectedAssetId=null,selectedItemIdx=-1;
let hoverTile=null,items=[],grid=Array.from({length:GRID},()=>Array(GRID).fill(-1));
let thumbCache={};
let animTick=0,animInterval=null;
let pendingMoveIdx=-1;

// =============================================
// MUSIC
// =============================================
const NF={'R':0,'C3':130.81,'D3':146.83,'E3':164.81,'F3':174.61,'G3':196,'A3':220,'B3':246.94,
'C4':261.63,'D4':293.66,'E4':329.63,'F4':349.23,'F#4':369.99,'G4':392,'A4':440,'B4':493.88,
'C5':523.25,'D5':587.33,'E5':659.25,'F5':698.46,'G5':784};
const TRACKS=[
    {name:'봄날의 오후',bpm:108,wave:'triangle',
     melody:'C4:2 E4:2 G4:4 E4:2 G4:2 C5:4 B4:2 A4:2 G4:4 F4:2 A4:2 G4:4 E4:2 G4:2 C5:4 B4:2 A4:2 G4:4 F4:2 E4:2 D4:4 C4:4 R:4'},
    {name:'별이 빛나는 밤',bpm:78,wave:'sine',
     melody:'E4:4 G4:2 A4:2 B4:4 A4:4 G4:2 A4:2 B4:2 G4:2 A4:8 E4:4 D4:2 E4:2 G4:4 F#4:4 E4:2 D4:2 C4:2 D4:2 E4:8'},
    {name:'신나는 하루',bpm:138,wave:'square',
     melody:'G4:1 G4:1 A4:2 B4:2 D5:2 C5:2 B4:2 A4:2 G4:2 A4:1 A4:1 B4:2 C5:2 E5:2 D5:4 B4:2 R:2 G4:2 C5:2 B4:2 A4:2 G4:1 A4:1 B4:2 A4:2 G4:4 R:4'},
    {name:'비 오는 날',bpm:84,wave:'triangle',
     melody:'D4:4 F4:4 A4:2 G4:2 F4:4 E4:2 D4:2 C4:4 D4:8 D4:4 F4:4 A4:4 G4:2 F4:2 E4:2 D4:2 D4:8'},
    {name:'추억의 멜로디',bpm:100,wave:'sine',
     melody:'F4:2 A4:2 C5:4 A4:2 G4:2 F4:4 G4:2 A4:2 G4:4 F4:2 E4:2 D4:4 F4:2 A4:2 C5:4 D5:2 C5:2 A4:4 G4:2 F4:2 E4:4 F4:8'},
];
function parseMelody(s){return s.trim().split(/\s+/).map(x=>{const[n,d]=x.split(':');return{freq:NF[n]||0,dur:+d}})}

let audioCtx=null,masterGain=null,trackGain=null,loopTO=null,bgmPlaying=false,bgmIdx=0;
function initAudio(){if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();masterGain=audioCtx.createGain();masterGain.gain.value=0.4;masterGain.connect(audioCtx.destination)}}
function schedNotes(tr){
    const ns=parseMelody(tr.melody),bd=60/tr.bpm;let t=audioCtx.currentTime+0.05;const s=t;
    ns.forEach(n=>{if(n.freq>0){
        const o=audioCtx.createOscillator(),e=audioCtx.createGain(),dur=n.dur*bd;
        o.type=tr.wave;o.frequency.value=n.freq;
        e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(0.28,t+0.015);
        e.gain.setValueAtTime(0.28,t+dur*0.6);e.gain.exponentialRampToValueAtTime(0.001,t+dur*0.95);
        o.connect(e);e.connect(trackGain);o.start(t);o.stop(t+dur);
        const s2=audioCtx.createOscillator(),e2=audioCtx.createGain();
        s2.type='sine';s2.frequency.value=n.freq/2;
        e2.gain.setValueAtTime(0,t);e2.gain.linearRampToValueAtTime(0.06,t+0.02);
        e2.gain.exponentialRampToValueAtTime(0.001,t+dur*0.9);
        s2.connect(e2);e2.connect(trackGain);s2.start(t);s2.stop(t+dur);
    }t+=n.dur*bd});return t-s;
}
function playBGM(i){initAudio();stopBGM();bgmIdx=i;bgmPlaying=true;
    trackGain=audioCtx.createGain();trackGain.gain.value=1;trackGain.connect(masterGain);
    (function loop(){if(!bgmPlaying)return;const d=schedNotes(TRACKS[bgmIdx]);loopTO=setTimeout(loop,(d-0.1)*1000)})();
    updateBGMUI();
}
function stopBGM(){bgmPlaying=false;if(loopTO){clearTimeout(loopTO);loopTO=null}
    if(trackGain){try{trackGain.gain.setValueAtTime(0,audioCtx.currentTime);trackGain.disconnect()}catch(e){}trackGain=null}updateBGMUI()}
function toggleBGM(){bgmPlaying?stopBGM():playBGM(bgmIdx)}
function updateBGMUI(){
    const el=document.getElementById('bgm-track-name');if(el)el.textContent=TRACKS[bgmIdx].name;
    const pb=document.getElementById('bgm-play');if(pb){pb.textContent=bgmPlaying?'■':'▶';pb.classList.toggle('playing',bgmPlaying)}
    document.querySelectorAll('.bgm-track').forEach((e,i)=>e.classList.toggle('active',i===bgmIdx));
}

// =============================================
// ISO ENGINE
// =============================================
function toScreen(c,r){return{x:OX+(c-r)*TW/2,y:OY+(c+r)*TH/2}}
function toGrid(sx,sy){const dx=sx-OX,dy=sy-OY;return{col:Math.floor((dx/(TW/2)+dy/(TH/2))/2),row:Math.floor((dy/(TH/2)-dx/(TW/2))/2)}}
function inGrid(c,r){return c>=0&&c<GRID&&r>=0&&r<GRID}
function frontCorner(c,r,gw,gd){return toScreen(c+gw,r+gd)}

function drawIsoBox(cx,fx,fy,rw,lw,h,top,right,left,ol){
    const rx=fx+rw,ry=fy-rw/2,lx=fx-lw,ly=fy-lw/2;
    const fty=fy-h,rty=ry-h,lty=ly-h,btx=fx+rw-lw,bty=fy-rw/2-lw/2-h;
    if(left){cx.fillStyle=left;cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(lx,ly);cx.lineTo(lx,lty);cx.lineTo(fx,fty);cx.closePath();cx.fill()}
    if(right){cx.fillStyle=right;cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(rx,ry);cx.lineTo(rx,rty);cx.lineTo(fx,fty);cx.closePath();cx.fill()}
    if(top){cx.fillStyle=top;cx.beginPath();cx.moveTo(fx,fty);cx.lineTo(rx,rty);cx.lineTo(btx,bty);cx.lineTo(lx,lty);cx.closePath();cx.fill()}
    if(ol){cx.strokeStyle=ol;cx.lineWidth=0.5;
        cx.beginPath();cx.moveTo(fx,fty);cx.lineTo(rx,rty);cx.lineTo(btx,bty);cx.lineTo(lx,lty);cx.closePath();cx.stroke();
        cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(fx,fty);cx.stroke();
        cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(rx,ry);cx.lineTo(rx,rty);cx.stroke();
        cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(lx,ly);cx.lineTo(lx,lty);cx.stroke()}
}
function drawFloorDiamond(cx,x,y,fill,stroke){
    cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+TW/2,y+TH/2);cx.lineTo(x,y+TH);cx.lineTo(x-TW/2,y+TH/2);cx.closePath();
    if(fill){cx.fillStyle=fill;cx.fill()}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=0.5;cx.stroke()}
}
function drawShadow(cx,fx,fy,rw,lw){
    cx.fillStyle=P.shadow;cx.beginPath();
    cx.moveTo(fx,fy+2);cx.lineTo(fx+rw+3,fy-rw/2+3);cx.lineTo(fx+rw-lw+3,fy-rw/2-lw/2+5);cx.lineTo(fx-lw,fy-lw/2+2);
    cx.closePath();cx.fill();
}

// =============================================
// ROOM ASSETS (furniture/deco)
// =============================================
const ASSETS=[
    {id:'bed',name:'침대',cat:'furniture',gw:2,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,32,64,12,'#D4A574','#B8956A','#A07850','rgba(0,0,0,0.08)');
        drawIsoBox(cx,fx,fy-12,30,62,10,'#FFF0F5','#FFE0EA','#FFD0DF','rgba(0,0,0,0.05)');
        drawIsoBox(cx,fx+18-44,fy-9-22-22,12,16,6,'#FFF','#F5F0F0','#EBE6E6');
        drawIsoBox(cx,fx+30-60,fy-15-30,28,3,22,'#C49060','#A87A50','#926A42','rgba(0,0,0,0.1)');}},
    {id:'desk',name:'책상',cat:'furniture',gw:2,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,3,3,22,'#B08050','#9A7040','#866035');
        drawIsoBox(cx,fx+28-58,fy-14-29,3,3,22,'#B08050','#9A7040','#866035');
        drawIsoBox(cx,fx+28,fy-14,3,3,22,'#B08050','#9A7040','#866035');
        drawIsoBox(cx,fx-58,fy-29,3,3,22,'#B08050','#9A7040','#866035');
        drawIsoBox(cx,fx,fy-22,32,64,4,'#D4B896','#BEA280','#A88C6A','rgba(0,0,0,0.08)');
        drawIsoBox(cx,fx-36,fy-22,8,22,14,'#C8A880','#B09068','#987A56','rgba(0,0,0,0.06)');}},
    {id:'chair',name:'의자',cat:'furniture',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,2,2,16,'#9A7040','#866035','#725028');
        drawIsoBox(cx,fx+26-26,fy-13-13,2,2,16,'#9A7040','#866035','#725028');
        drawIsoBox(cx,fx,fy-16,28,28,5,'#B0C4DE','#9AB0CA','#849CB6','rgba(0,0,0,0.06)');
        drawIsoBox(cx,fx+24-26,fy-12-13-16,22,3,20,'#9AB0CA','#849CB6','#7088A2','rgba(0,0,0,0.08)');}},
    {id:'bookshelf',name:'책장',cat:'furniture',gw:1,gd:2,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,64,32,56,'#A0825C','#8B7050','#765E44','rgba(0,0,0,0.1)');
        drawIsoBox(cx,fx,fy-18,62,30,2,'#BEA07A','#A88A64','#92744E');
        drawIsoBox(cx,fx,fy-36,62,30,2,'#BEA07A','#A88A64','#92744E');
        drawIsoBox(cx,fx+10,fy-7-20,20,24,14,'#E86050','#D05040','#B84030');
        drawIsoBox(cx,fx+32,fy-18-20,14,22,14,'#5088C0','#4078B0','#3068A0');
        drawIsoBox(cx,fx+8,fy-6-38,24,20,14,'#60A060','#509050','#408040');}},
    {id:'sofa',name:'소파',cat:'furniture',gw:2,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,32,64,14,'#88C8B8','#78B8A8','#68A898','rgba(0,0,0,0.06)');
        drawIsoBox(cx,fx+28-58,fy-14-29-14,26,52,18,'#98D8C8','#80C8B0','#70B8A0','rgba(0,0,0,0.06)');
        drawIsoBox(cx,fx-56,fy-28-14,24,6,16,'#90D0C0','#78C0A8','#68B098');
        drawIsoBox(cx,fx,fy-14,6,6,16,'#90D0C0','#78C0A8','#68B098');}},
    {id:'wardrobe',name:'옷장',cat:'furniture',gw:1,gd:2,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,64,32,64,'#B8956A','#A07850','#8A6540','rgba(0,0,0,0.1)');
        drawIsoBox(cx,fx,fy-64,64,32,3,'#C8A87A','#B09060','#987A4A');}},
    {id:'table',name:'탁자',cat:'furniture',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx+10-10,fy-5-5,6,6,18,'#B09068','#9A7A52','#846A3E');
        drawIsoBox(cx,fx,fy-18,32,32,4,'#DCC8A8','#C6B292','#B09C7C','rgba(0,0,0,0.06)');}},
    {id:'computer',name:'컴퓨터',cat:'electronics',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx+2,fy-1,14,22,2,'#D0D0D0','#B8B8B8','#A8A8A8');
        drawIsoBox(cx,fx,fy-14,4,4,18,'#666','#555','#444');
        drawIsoBox(cx,fx,fy-18-18,22,22,22,'#4A4A4A','#3A3A3A','#2A2A2A','rgba(0,0,0,0.15)');
        drawIsoBox(cx,fx,fy-16-18,18,18,16,'#4488CC','#3377BB','#2266AA');}},
    {id:'tv',name:'TV',cat:'electronics',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-12,8,8,10,'#555','#444','#333');
        drawIsoBox(cx,fx,fy-4-10,26,26,22,'#3A3A3A','#2A2A2A','#1A1A1A','rgba(0,0,0,0.12)');
        drawIsoBox(cx,fx,fy-4-12,22,22,16,'#55AADD','#4499CC','#3388BB');}},
    {id:'speaker',name:'스피커',cat:'electronics',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-6,20,20,30,'#555','#444','#383838','rgba(0,0,0,0.1)');
        cx.fillStyle='#777';cx.beginPath();cx.arc(fx+14,fy-7-18,6,0,Math.PI*2);cx.fill();}},
    {id:'plant',name:'화분',cat:'deco',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-8,16,16,16,'#CD853F','#B87333','#A06020','rgba(0,0,0,0.08)');
        drawIsoBox(cx,fx,fy-24,14,14,2,'#6B4423','#5A3318','#4A2810');
        drawIsoBox(cx,fx,fy-26,18,18,10,'#7CB342','#689F38','#558B2F');
        drawIsoBox(cx,fx-2,fy-5-31,14,12,8,'#8BC34A','#7CB342','#689F38');
        drawIsoBox(cx,fx,fy-39,8,8,6,'#9CCC65','#8BC34A','#7CB342');}},
    {id:'lamp',name:'스탠드',cat:'deco',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-8,16,16,4,'#777','#666','#555');
        drawIsoBox(cx,fx,fy-13,3,3,36,'#888','#777','#666');
        drawIsoBox(cx,fx,fy-38-4,20,20,16,'#FFE082','#FFCA28','#FFB300','rgba(0,0,0,0.05)');
        cx.fillStyle='rgba(255,240,180,0.15)';cx.beginPath();cx.arc(fx,fy-36,20,0,Math.PI*2);cx.fill();}},
    {id:'rug',name:'러그',cat:'deco',gw:2,gd:2,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy,64,64,2,'#E8A87C','#D49468','#C08054','rgba(0,0,0,0.06)');
        drawIsoBox(cx,fx,fy-7,44,44,1,'#F0C8A8','#DCB494','#C8A080');}},
    {id:'cushion',name:'쿠션',cat:'deco',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-6,20,20,8,'#CE93D8','#BA68C8','#AB47BC','rgba(0,0,0,0.06)');}},
    {id:'frame',name:'액자',cat:'deco',gw:1,gd:1,draw(cx,fx,fy){
        drawIsoBox(cx,fx,fy-4,24,24,2,'#B8956A','#A07850','#8A6540');
        drawIsoBox(cx,fx,fy-10,16,16,18,'#87CEEB','#78BED8','#69AEC8');
        drawIsoBox(cx,fx,fy-6,20,20,20,null,'#C8A87A','#B09060','rgba(0,0,0,0.12)');}},
    // Characters
    {id:'minime',name:'미니미',cat:'character',gw:1,gd:1,draw(cx,fx,fy){
        drawCharSprite(cx,fx,fy-TH/2+8);}},
    {id:'cat',name:'고양이',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'cat')}},
    {id:'dog',name:'강아지',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'dog')}},
    {id:'hamster',name:'햄스터',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'hamster')}},
    {id:'rabbit',name:'토끼',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'rabbit')}},
    {id:'turtle',name:'거북이',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'turtle')}},
    {id:'penguin',name:'펭귄',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'penguin')}},
    {id:'chick',name:'병아리',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'chick')}},
    {id:'panda',name:'판다',cat:'character',gw:1,gd:1,draw(cx,fx,fy){drawPet(cx,fx,fy-TH/2+6,'panda')}},
];
function getAsset(id){return ASSETS.find(a=>a.id===id)}

// =============================================
// PATTERN HELPERS
// =============================================
function drawHeart(cx,x,y,c){cx.fillStyle=c;cx.fillRect(x-2,y-1,2,1);cx.fillRect(x+1,y-1,2,1);cx.fillRect(x-3,y,7,1);cx.fillRect(x-2,y+1,5,1);cx.fillRect(x-1,y+2,3,1);cx.fillRect(x,y+3,1,1)}
function drawStar(cx,x,y,c){cx.fillStyle=c;cx.fillRect(x,y-2,1,1);cx.fillRect(x-2,y,5,1);cx.fillRect(x-1,y+1,3,1);cx.fillRect(x-1,y+2,1,1);cx.fillRect(x+1,y+2,1,1)}
function fillWallPattern(cx,wp,x,y,w,h){
    if(wp.pattern==='dots'){
        cx.fillStyle=wp.accent;
        for(let py=y;py<y+h;py+=22)for(let px=x;px<x+w;px+=28){
            const o=(Math.floor((py-y)/22)%2)*14;cx.beginPath();cx.arc(px+o,py,2,0,Math.PI*2);cx.fill();}
    }else if(wp.pattern==='heart'){
        for(let py=y+8;py<y+h;py+=24)for(let px=x+8;px<x+w;px+=28){
            const o=(Math.floor((py-y)/24)%2)*14;drawHeart(cx,px+o,py,wp.accent);}
    }else if(wp.pattern==='star'){
        for(let py=y+6;py<y+h;py+=22)for(let px=x+6;px<x+w;px+=24){
            const o=(Math.floor((py-y)/22)%2)*12;drawStar(cx,px+o,py,wp.accent);}
    }else if(wp.pattern==='grid'){
        cx.strokeStyle=wp.accent;cx.lineWidth=0.5;
        for(let py=y;py<y+h;py+=18){cx.beginPath();cx.moveTo(x,py);cx.lineTo(x+w,py);cx.stroke();}
        for(let px=x;px<x+w;px+=18){cx.beginPath();cx.moveTo(px,y);cx.lineTo(px,y+h);cx.stroke();}
    }else if(wp.pattern==='stripe'){
        cx.fillStyle=wp.accent;
        for(let py=y;py<y+h;py+=14)cx.fillRect(x,py,w,4);
    }else if(wp.pattern==='bigdot'){
        cx.fillStyle=wp.accent;
        for(let py=y+10;py<y+h;py+=26)for(let px=x+10;px<x+w;px+=30){
            const o=(Math.floor((py-y)/26)%2)*15;cx.beginPath();cx.arc(px+o,py,4,0,Math.PI*2);cx.fill();}
    }
}

// =============================================
// ANIMATION & WALKING
// =============================================
function startAnimation(){
    if(animInterval)return;
    animInterval=setInterval(()=>{
        animTick++;
        updateWalks();
        if(animTick%22===0)maybeWanderPets();
        render();
    },110);
}

function updateWalks(){
    items.forEach(it=>{
        if(!it.walk)return;
        it.walk.t+=0.18;
        if(it.walk.t>=1){it.walk=null}
    });
}

function canWalkTo(col,row,selfIdx){
    if(!inGrid(col,row))return false;
    const idx=grid[col][row];
    if(idx<0||idx===selfIdx)return true;
    const a=getAsset(items[idx].assetId);
    // Characters can overlap; floor decor (rug/cushion) ok too
    return a.cat==='character'||a.id==='rug'||a.id==='cushion';
}

function startWalk(idx,nc,nr){
    const it=items[idx];
    if(it.col===nc&&it.row===nr)return false;
    if(!canWalkTo(nc,nr,idx))return false;
    // Release old tile, claim new tile
    if(grid[it.col][it.row]===idx)grid[it.col][it.row]=-1;
    const prev=grid[nc][nr];
    grid[nc][nr]=idx;
    it.walk={srcCol:it.col,srcRow:it.row,t:0};
    it.col=nc;it.row=nr;
    // If we overwrote another character, re-assert their position in grid
    if(prev>=0&&prev!==idx){
        const other=items[prev];
        if(other&&grid[other.col][other.row]!==prev)grid[other.col][other.row]=prev;
    }
    return true;
}

function maybeWanderPets(){
    items.forEach((it,idx)=>{
        const a=getAsset(it.assetId);
        if(!a||a.cat!=='character'||it.assetId==='minime')return;
        if(it.walk)return;
        if(Math.random()<0.6)return; // 40% chance
        const dirs=[[0,1],[1,0],[-1,0],[0,-1]].sort(()=>Math.random()-0.5);
        for(const[dc,dr]of dirs){
            if(startWalk(idx,it.col+dc,it.row+dr))break;
        }
    });
}

// =============================================
// ROOM RENDERING
// =============================================
function drawWalls(cx){
    const wp=WALLPAPERS[room.wallpaper];
    const tl=toScreen(0,0),tr=toScreen(GRID,0),bl=toScreen(0,GRID);
    // Back wall
    cx.save();cx.beginPath();cx.moveTo(tl.x,tl.y-WALL_H);cx.lineTo(tr.x,tr.y-WALL_H);cx.lineTo(tr.x,tr.y);cx.lineTo(tl.x,tl.y);cx.closePath();cx.clip();
    cx.fillStyle=wp.back;cx.fillRect(tl.x-10,tl.y-WALL_H-10,tr.x-tl.x+20,WALL_H+20);
    fillWallPattern(cx,wp,tl.x-10,tl.y-WALL_H,tr.x-tl.x+20,WALL_H);
    cx.restore();
    // Left wall
    cx.save();cx.beginPath();cx.moveTo(tl.x,tl.y-WALL_H);cx.lineTo(tl.x,tl.y);cx.lineTo(bl.x,bl.y);cx.lineTo(bl.x,bl.y-WALL_H);cx.closePath();cx.clip();
    cx.fillStyle=wp.left;cx.fillRect(bl.x-10,tl.y-WALL_H-10,tl.x-bl.x+20,WALL_H+bl.y-tl.y+20);
    fillWallPattern(cx,wp,bl.x-10,tl.y-WALL_H,tl.x-bl.x+20,WALL_H+bl.y-tl.y);
    cx.restore();
    // Baseboards
    cx.fillStyle=P.baseboard;cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(tr.x,tr.y);cx.lineTo(tr.x,tr.y-10);cx.lineTo(tl.x,tl.y-10);cx.closePath();cx.fill();
    cx.fillStyle=P.baseboardS;cx.beginPath();cx.moveTo(tl.x,tl.y);cx.lineTo(bl.x,bl.y);cx.lineTo(bl.x,bl.y-10);cx.lineTo(tl.x,tl.y-10);cx.closePath();cx.fill();
    cx.strokeStyle='rgba(0,0,0,0.08)';cx.lineWidth=1;cx.beginPath();cx.moveTo(tl.x,tl.y-WALL_H);cx.lineTo(tl.x,tl.y);cx.stroke();
    // Window - isometric parallelogram on back wall (slope = TH/TW = 0.5)
    drawWindow(cx,tl,tr);
}

function drawWindow(cx,tl,tr){
    const t=0.58; // position along wall (0=left, 1=right)
    const vt=0.55; // vertical position (0=floor, 1=ceiling)
    const hw=28,hh=22,slope=(tr.y-tl.y)/(tr.x-tl.x); // 0.5 for back wall
    const cxw=tl.x+t*(tr.x-tl.x);
    const cyw=tl.y+t*(tr.y-tl.y)-WALL_H*vt;
    // 4 corners of the window parallelogram
    const TL={x:cxw-hw,y:cyw-hw*slope-hh};
    const TR={x:cxw+hw,y:cyw+hw*slope-hh};
    const BR={x:cxw+hw,y:cyw+hw*slope+hh};
    const BL={x:cxw-hw,y:cyw-hw*slope+hh};
    // Frame (behind)
    const fpad=3;
    cx.fillStyle='#8B6F47';
    cx.beginPath();
    cx.moveTo(TL.x-fpad,TL.y-fpad);cx.lineTo(TR.x+fpad,TR.y-fpad);
    cx.lineTo(BR.x+fpad,BR.y+fpad);cx.lineTo(BL.x-fpad,BL.y+fpad);
    cx.closePath();cx.fill();
    // Sky gradient background
    const grad=cx.createLinearGradient(TL.x,TL.y,BL.x,BL.y);
    grad.addColorStop(0,'#B8E0FF');grad.addColorStop(0.6,'#D8EFFF');grad.addColorStop(1,'#FFE8B8');
    cx.fillStyle=grad;
    cx.beginPath();cx.moveTo(TL.x,TL.y);cx.lineTo(TR.x,TR.y);cx.lineTo(BR.x,BR.y);cx.lineTo(BL.x,BL.y);cx.closePath();cx.fill();
    // Sun / cloud
    const midX=(TL.x+TR.x)/2,midY=(TL.y+TR.y)/2+hh*0.3;
    cx.fillStyle='#FFD580';cx.beginPath();cx.arc(midX+hw*0.4,midY-hh*0.3,6,0,Math.PI*2);cx.fill();
    cx.fillStyle='rgba(255,255,255,0.8)';
    cx.beginPath();cx.arc(midX-hw*0.3,midY+2,4,0,Math.PI*2);cx.arc(midX-hw*0.1,midY,5,0,Math.PI*2);cx.arc(midX+hw*0.1,midY+1,4,0,Math.PI*2);cx.fill();
    // Cross dividers (vertical straight, horizontal sloped)
    const TM={x:cxw,y:cyw-hh}; // top-mid (on top edge between TL and TR)
    const BM={x:cxw,y:cyw+hh}; // bottom-mid
    const LM={x:cxw-hw,y:cyw-hw*slope}; // left-mid
    const RM={x:cxw+hw,y:cyw+hw*slope}; // right-mid
    cx.strokeStyle='#FFF';cx.lineWidth=2.5;cx.lineCap='square';
    cx.beginPath();cx.moveTo(TM.x,TM.y);cx.lineTo(BM.x,BM.y);cx.stroke();
    cx.beginPath();cx.moveTo(LM.x,LM.y);cx.lineTo(RM.x,RM.y);cx.stroke();
    // Inner frame (white border)
    cx.strokeStyle='#FFF';cx.lineWidth=3;cx.lineJoin='miter';
    cx.beginPath();cx.moveTo(TL.x,TL.y);cx.lineTo(TR.x,TR.y);cx.lineTo(BR.x,BR.y);cx.lineTo(BL.x,BL.y);cx.closePath();cx.stroke();
    // Outer frame outline
    cx.strokeStyle='#5D4B32';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(TL.x-fpad,TL.y-fpad);cx.lineTo(TR.x+fpad,TR.y-fpad);cx.lineTo(BR.x+fpad,BR.y+fpad);cx.lineTo(BL.x-fpad,BL.y+fpad);cx.closePath();cx.stroke();
    // Windowsill (bottom)
    cx.fillStyle='#A87850';
    cx.beginPath();
    cx.moveTo(BL.x-fpad-2,BL.y+fpad);cx.lineTo(BR.x+fpad+2,BR.y+fpad);
    cx.lineTo(BR.x+fpad+2,BR.y+fpad+4);cx.lineTo(BL.x-fpad-2,BL.y+fpad+4);
    cx.closePath();cx.fill();
    cx.strokeStyle='#5D4B32';cx.lineWidth=0.5;cx.stroke();
}
function drawFloor(cx){const fl=FLOORS[room.floor];for(let r=0;r<GRID;r++)for(let c=0;c<GRID;c++){const s=toScreen(c,r);drawFloorDiamond(cx,s.x,s.y,(c+r)%2===0?fl.c1:fl.c2,fl.edge)}}
function drawHighlight(cx,col,row,gw,gd,color){for(let dc=0;dc<gw;dc++)for(let dr=0;dr<gd;dr++){const s=toScreen(col+dc,row+dr);drawFloorDiamond(cx,s.x,s.y,color,null)}}
function itemPos(it){
    // Returns interpolated (col,row) position accounting for walking
    if(it.walk){
        const t=it.walk.t;
        return{col:it.walk.srcCol+(it.col-it.walk.srcCol)*t,row:it.walk.srcRow+(it.row-it.walk.srcRow)*t};
    }
    return{col:it.col,row:it.row};
}

function drawItems(cx){
    const arr=items.map((it,i)=>{
        const p=itemPos(it);return{...it,idx:i,_col:p.col,_row:p.row};
    }).sort((a,b)=>(a._col+a._row)-(b._col+b._row)||a._row-b._row);
    arr.forEach(it=>{
        const a=getAsset(it.assetId);if(!a)return;
        const fc=frontCorner(it._col,it._row,a.gw,a.gd);
        let bobY=0;
        if(a.cat==='character'){
            if(it.walk){bobY=animTick%2===0?0:-2}
            else{bobY=(Math.floor(animTick/4)%2===0)?0:-1}
        }
        drawShadow(cx,fc.x,fc.y,a.gd*TW/2,a.gw*TW/2);
        a.draw(cx,fc.x,fc.y+bobY);
        if(it.idx===selectedItemIdx)drawHighlight(cx,it.col,it.row,a.gw,a.gd,P.select);
    });
}
function drawHoverPreview(cx){
    if(!hoverTile||!inGrid(hoverTile.col,hoverTile.row))return;
    if(tool==='place'&&selectedAssetId){
        const a=getAsset(selectedAssetId);if(!a)return;
        const v=canPlace(hoverTile.col,hoverTile.row,a.gw,a.gd,-1,a);
        drawHighlight(cx,hoverTile.col,hoverTile.row,a.gw,a.gd,v?P.valid:P.invalid);
        if(v){const fc=frontCorner(hoverTile.col,hoverTile.row,a.gw,a.gd);cx.globalAlpha=0.5;a.draw(cx,fc.x,fc.y);cx.globalAlpha=1}
    }else{
        const idx=getItemAt(hoverTile.col,hoverTile.row);
        if(idx>=0){const it=items[idx],a=getAsset(it.assetId);drawHighlight(cx,it.col,it.row,a.gw,a.gd,tool==='delete'?P.invalid:P.hover)}
        else{const s=toScreen(hoverTile.col,hoverTile.row);drawFloorDiamond(cx,s.x,s.y,P.hover,null)}
    }
}
function render(){
    ctx.clearRect(0,0,CW,CH);
    const g=ctx.createLinearGradient(0,0,0,CH);g.addColorStop(0,'#FDF8F4');g.addColorStop(1,'#FFF6EE');ctx.fillStyle=g;ctx.fillRect(0,0,CW,CH);
    drawWalls(ctx);drawFloor(ctx);drawHoverPreview(ctx);drawItems(ctx);
}

// =============================================
// ITEM MANAGEMENT
// =============================================
function canPlace(c,r,gw,gd,ig,placingAsset){
    for(let dc=0;dc<gw;dc++)for(let dr=0;dr<gd;dr++){
        if(!inGrid(c+dc,r+dr))return false;
        const occ=grid[c+dc][r+dr];
        if(occ>=0&&occ!==ig){
            // Characters can overlap with other characters and floor decor
            if(placingAsset&&placingAsset.cat==='character'){
                const occA=getAsset(items[occ].assetId);
                if(occA.cat==='character'||occA.id==='rug'||occA.id==='cushion')continue;
            }
            return false;
        }
    }
    return true;
}
function placeItem(id,c,r){const a=getAsset(id);if(!a||!canPlace(c,r,a.gw,a.gd,-1,a))return false;const i=items.length;items.push({assetId:id,col:c,row:r});for(let dc=0;dc<a.gw;dc++)for(let dr=0;dr<a.gd;dr++)grid[c+dc][r+dr]=i;return true}
function removeItem(i){if(i<0||i>=items.length)return;const it=items[i],a=getAsset(it.assetId);for(let dc=0;dc<a.gw;dc++)for(let dr=0;dr<a.gd;dr++)if(grid[it.col+dc][it.row+dr]===i)grid[it.col+dc][it.row+dr]=-1;items.splice(i,1);rebuildGrid()}
function moveItem(i,nc,nr){if(i<0||i>=items.length)return false;const it=items[i],a=getAsset(it.assetId);if(!canPlace(nc,nr,a.gw,a.gd,i,a))return false;for(let dc=0;dc<a.gw;dc++)for(let dr=0;dr<a.gd;dr++)if(grid[it.col+dc][it.row+dr]===i)grid[it.col+dc][it.row+dr]=-1;it.col=nc;it.row=nr;for(let dc=0;dc<a.gw;dc++)for(let dr=0;dr<a.gd;dr++)grid[nc+dc][nr+dr]=i;return true}
function getItemAt(c,r){return inGrid(c,r)?grid[c][r]:-1}
function rebuildGrid(){grid=Array.from({length:GRID},()=>Array(GRID).fill(-1));items.forEach((it,i)=>{const a=getAsset(it.assetId);for(let dc=0;dc<a.gw;dc++)for(let dr=0;dr<a.gd;dr++)grid[it.col+dc][it.row+dr]=i})}
function clearRoom(){items=[];grid=Array.from({length:GRID},()=>Array(GRID).fill(-1));selectedItemIdx=-1;render()}

// =============================================
// SAVE/LOAD
// =============================================
function saveRoom(){
    localStorage.setItem('cy_miniroom_v4',JSON.stringify({items:items.map(i=>({id:i.assetId,c:i.col,r:i.row})),outfit,room}));
    showToast('저장 완료!');
}
function loadRoom(){
    try{const r=localStorage.getItem('cy_miniroom_v4');if(!r)return false;const s=JSON.parse(r);
    items=[];grid=Array.from({length:GRID},()=>Array(GRID).fill(-1));
    (s.items||[]).forEach(d=>placeItem(d.id,d.c,d.r));
    if(s.outfit)outfit={...outfit,...s.outfit};
    if(s.room)room={...room,...s.room};
    selectedItemIdx=-1;render();return true}catch{return false}
}

// =============================================
// THUMBNAILS
// =============================================
function genThumb(asset){
    const k=asset.id+'_'+JSON.stringify(outfit);
    if(thumbCache[k])return thumbCache[k];
    const tc=document.createElement('canvas');tc.width=128;tc.height=104;
    const tx=tc.getContext('2d');tx.imageSmoothingEnabled=false;
    const rw=asset.gd*TW/2,lw=asset.gw*TW/2;
    asset.draw(tx,64+(lw-rw)/2,84);
    thumbCache[k]=tc.toDataURL();return thumbCache[k];
}
function genOutfitThumb(cat,item){
    const k='outfit_'+item.id+'_'+JSON.stringify(outfit);
    if(thumbCache[k])return thumbCache[k];
    const tc=document.createElement('canvas');tc.width=72;tc.height=72;
    const tx=tc.getContext('2d');tx.imageSmoothingEnabled=false;
    const tmpEq={...getEquipped()};tmpEq[cat]=item;
    drawCharSprite(tx,36,66,tmpEq);
    thumbCache[k]=tc.toDataURL();return thumbCache[k];
}

function genWallpaperThumb(wp){
    const k='wp_'+wp.id;if(thumbCache[k])return thumbCache[k];
    const tc=document.createElement('canvas');tc.width=64;tc.height=52;
    const tx=tc.getContext('2d');tx.imageSmoothingEnabled=false;
    tx.fillStyle=wp.back;tx.fillRect(0,0,64,52);
    fillWallPattern(tx,wp,0,0,64,52);
    tx.strokeStyle='rgba(0,0,0,0.15)';tx.lineWidth=1;tx.strokeRect(0,0,64,52);
    thumbCache[k]=tc.toDataURL();return thumbCache[k];
}

function genFloorThumb(fl){
    const k='fl_'+fl.id;if(thumbCache[k])return thumbCache[k];
    const tc=document.createElement('canvas');tc.width=64;tc.height=52;
    const tx=tc.getContext('2d');tx.imageSmoothingEnabled=false;
    // Draw 2x2 isometric tiles
    const cx=32,cy=10;
    [[0,0],[1,0],[0,1],[1,1]].forEach(([c,r])=>{
        const sx=cx+(c-r)*16,sy=cy+(c+r)*8;
        tx.beginPath();tx.moveTo(sx,sy);tx.lineTo(sx+16,sy+8);tx.lineTo(sx,sy+16);tx.lineTo(sx-16,sy+8);tx.closePath();
        tx.fillStyle=(c+r)%2===0?fl.c1:fl.c2;tx.fill();
        tx.strokeStyle=fl.edge;tx.lineWidth=0.5;tx.stroke();
    });
    thumbCache[k]=tc.toDataURL();return thumbCache[k];
}

// =============================================
// MOUSE
// =============================================
function getCP(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*CW/r.width,y:(e.clientY-r.top)*CH/r.height}}
function onMove(e){const p=getCP(e),g=toGrid(p.x,p.y);hoverTile=inGrid(g.col,g.row)?g:null;render()}
function onLeave(){hoverTile=null;render()}
function onClick(e){
    const p=getCP(e),g=toGrid(p.x,p.y);if(!inGrid(g.col,g.row))return;
    const i=getItemAt(g.col,g.row);

    // Delete tool: click item → delete
    if(tool==='delete'){
        if(i>=0){const nm=getAsset(items[i].assetId).name;removeItem(i);if(selectedItemIdx===i)selectedItemIdx=-1;else if(selectedItemIdx>i)selectedItemIdx--;pendingMoveIdx=-1;updateItemActions();info(nm+' 삭제됨');render()}
        return;
    }

    // If a move is pending (user clicked 이동 button), this click is the destination
    if(pendingMoveIdx>=0){
        const sel=items[pendingMoveIdx],sa=getAsset(sel.assetId);
        let ok=false;
        if(sa.cat==='character'){ok=startWalk(pendingMoveIdx,g.col,g.row)}
        else if(i<0){ok=moveItem(pendingMoveIdx,g.col,g.row)}
        if(ok){info('이동 완료!');selectedItemIdx=-1;pendingMoveIdx=-1;updateItemActions()}
        else{info('이동할 수 없는 곳이에요')}
        render();return;
    }

    // Click on existing item → select it for editing
    if(i>=0){
        if(selectedItemIdx===i){selectedItemIdx=-1}
        else{selectedItemIdx=i}
        updateItemActions();render();return;
    }

    // Click on empty tile
    if(selectedItemIdx>=0){
        // Was selected, deselect
        selectedItemIdx=-1;updateItemActions();render();return;
    }
    if(tool==='place'&&selectedAssetId){
        if(placeItem(selectedAssetId,g.col,g.row))render();
    }
}

function updateItemActions(){
    const infoEl=document.getElementById('info-text');
    const actionsEl=document.getElementById('item-actions');
    if(selectedItemIdx>=0){
        const it=items[selectedItemIdx];const a=getAsset(it.assetId);
        infoEl.style.display='none';actionsEl.style.display='flex';
        const nameEl=document.getElementById('item-actions-name');
        nameEl.textContent=a.name+(pendingMoveIdx>=0?' (이동할 곳 클릭)':' 편집');
        document.getElementById('btn-item-move').classList.toggle('pending',pendingMoveIdx>=0);
    }else{
        infoEl.style.display='';actionsEl.style.display='none';
        pendingMoveIdx=-1;
    }
}

// =============================================
// UI
// =============================================
function info(t){document.getElementById('info-text').textContent=t}
function showToast(m){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000)}

function setupUI(){
    document.querySelectorAll('.tool-btn').forEach(b=>b.addEventListener('click',()=>{
        tool=b.dataset.tool;document.querySelectorAll('.tool-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedItemIdx=-1;pendingMoveIdx=-1;updateItemActions();render();
    }));
    document.getElementById('save-btn').addEventListener('click',saveRoom);
    document.getElementById('clear-btn').addEventListener('click',()=>{clearRoom();showToast('초기화 완료')});
    canvas.addEventListener('mousemove',onMove);canvas.addEventListener('mouseleave',onLeave);canvas.addEventListener('click',onClick);

    // Item edit action buttons
    document.getElementById('btn-item-move').addEventListener('click',()=>{
        if(selectedItemIdx<0)return;
        pendingMoveIdx=selectedItemIdx;
        const a=getAsset(items[selectedItemIdx].assetId);
        info(a.name+' - 이동할 곳을 클릭하세요');
        updateItemActions();
    });
    document.getElementById('btn-item-delete').addEventListener('click',()=>{
        if(selectedItemIdx<0)return;
        const idx=selectedItemIdx,nm=getAsset(items[idx].assetId).name;
        removeItem(idx);
        selectedItemIdx=-1;pendingMoveIdx=-1;
        updateItemActions();info(nm+' 삭제됨');render();
    });
    document.getElementById('btn-item-cancel').addEventListener('click',()=>{
        selectedItemIdx=-1;pendingMoveIdx=-1;updateItemActions();render();
    });

    // BGM
    document.getElementById('bgm-play').addEventListener('click',toggleBGM);
    document.getElementById('bgm-next').addEventListener('click',()=>playBGM((bgmIdx+1)%TRACKS.length));
    document.getElementById('bgm-prev').addEventListener('click',()=>playBGM((bgmIdx-1+TRACKS.length)%TRACKS.length));
    document.getElementById('bgm-volume').addEventListener('input',e=>{if(masterGain)masterGain.gain.value=e.target.value/100});
    const bl=document.getElementById('bgm-list');
    TRACKS.forEach((tr,i)=>{const el=document.createElement('div');el.className='bgm-track'+(i===0?' active':'');el.textContent='♪ '+tr.name;el.addEventListener('click',()=>playBGM(i));bl.appendChild(el)});
    updateBGMUI();

    // Shop tabs
    document.querySelectorAll('.stab').forEach(b=>b.addEventListener('click',()=>{
        document.querySelectorAll('.stab').forEach(x=>x.classList.remove('active'));b.classList.add('active');
        populateShop(b.dataset.cat);
    }));
    populateShop('furniture');
    updateNavAvatar();
}

function populateShop(cat){
    const grid=document.getElementById('shop-grid');grid.innerHTML='';
    const outfitCats={hair:HAIR_ITEMS,top:TOP_ITEMS,bottom:BOT_ITEMS,shoes:SHOE_ITEMS};
    if(cat==='wallpaper'){
        WALLPAPERS.forEach((wp,idx)=>{
            const card=document.createElement('div');
            card.className='item-card'+(room.wallpaper===idx?' equipped':'');
            const thumb=document.createElement('img');thumb.className='thumb';
            thumb.src=genWallpaperThumb(wp);thumb.alt=wp.name;
            const nm=document.createElement('div');nm.className='iname';nm.textContent=wp.name;
            const tag=document.createElement('div');tag.className='itag';tag.textContent=room.wallpaper===idx?'적용중':'';
            card.append(thumb,nm,tag);
            card.addEventListener('click',()=>{room.wallpaper=idx;render();populateShop(cat);info(wp.name+' 벽지로 변경됨')});
            grid.appendChild(card);
        });
    }else if(cat==='floor'){
        FLOORS.forEach((fl,idx)=>{
            const card=document.createElement('div');
            card.className='item-card'+(room.floor===idx?' equipped':'');
            const thumb=document.createElement('img');thumb.className='thumb';
            thumb.src=genFloorThumb(fl);thumb.alt=fl.name;
            const nm=document.createElement('div');nm.className='iname';nm.textContent=fl.name;
            const tag=document.createElement('div');tag.className='itag';tag.textContent=room.floor===idx?'적용중':'';
            card.append(thumb,nm,tag);
            card.addEventListener('click',()=>{room.floor=idx;render();populateShop(cat);info(fl.name+' 바닥으로 변경됨')});
            grid.appendChild(card);
        });
    }else if(outfitCats[cat]){
        outfitCats[cat].forEach((item,idx)=>{
            const card=document.createElement('div');
            card.className='item-card'+(outfit[cat]===idx?' equipped':'');
            const thumb=document.createElement('img');thumb.className='thumb';
            thumb.src=genOutfitThumb(cat,item);thumb.alt=item.name;
            const nm=document.createElement('div');nm.className='iname';nm.textContent=item.name;
            const tag=document.createElement('div');tag.className='itag';tag.textContent=outfit[cat]===idx?'착용중':'';
            card.append(thumb,nm,tag);
            card.addEventListener('click',()=>{
                outfit[cat]=idx;thumbCache={};render();populateShop(cat);updateNavAvatar();
            });
            grid.appendChild(card);
        });
    }else{
        ASSETS.filter(a=>a.cat===cat).forEach(asset=>{
            const card=document.createElement('div');
            card.className='item-card'+(selectedAssetId===asset.id?' selected':'');
            const thumb=document.createElement('img');thumb.className='thumb';
            thumb.src=genThumb(asset);thumb.alt=asset.name;
            const nm=document.createElement('div');nm.className='iname';nm.textContent=asset.name;
            card.append(thumb,nm);
            card.addEventListener('click',()=>{
                selectedAssetId=asset.id;tool='place';
                document.querySelectorAll('.tool-btn').forEach(b=>b.classList.remove('active'));
                document.querySelector('[data-tool="place"]').classList.add('active');
                info(asset.name+' 배치 모드');populateShop(cat);
            });
            grid.appendChild(card);
        });
    }
}

function updateNavAvatar(){
    const el=document.getElementById('nav-avatar');
    const tc=document.createElement('canvas');tc.width=48;tc.height=48;
    const tx=tc.getContext('2d');tx.imageSmoothingEnabled=false;
    // Draw with smaller pixel size (2px) so the full 12x18 character fits in 24x36
    drawCharSprite(tx,24,45,null,2);
    el.style.backgroundImage='url('+tc.toDataURL()+')';
    el.style.backgroundSize='contain';el.style.backgroundPosition='center';el.style.backgroundRepeat='no-repeat';
}

// =============================================
// INIT
// =============================================
function init(){
    canvas=document.getElementById('room-canvas');canvas.width=CW;canvas.height=CH;
    ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
    setupUI();
    if(!loadRoom()){
        placeItem('bed',0,0);placeItem('desk',0,5);placeItem('chair',2,6);
        placeItem('bookshelf',6,0);placeItem('plant',5,0);placeItem('lamp',3,2);
        placeItem('rug',3,4);placeItem('minime',5,3);placeItem('cat',6,5);placeItem('rabbit',7,3);
    }
    render();
    startAnimation();
}
window.addEventListener('DOMContentLoaded',init);
})();
