// Original, animated canvas artwork. All graphics are drawn locally.
export class CampScene{
  constructor(canvas,getState){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;this.mode='idle';this.until=0;this.particles=[];this.last=0;this.loop=this.loop.bind(this);requestAnimationFrame(this.loop);}
  animate(mode,duration=2800){this.mode=mode;this.until=performance.now()+duration;if(mode==='celebrate')this.burst();}
  burst(){for(let i=0;i<28;i++)this.particles.push({x:250,y:155,vx:(Math.random()-.5)*2.8,vy:-Math.random()*2.4-.6,life:70+Math.random()*30,color:['#f5d96e','#e9f677','#f7a087','#fff8e8','#ad9ed7'][i%5]});}
  r(x,y,w,h,c){this.ctx.fillStyle=c;this.ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  line(points,color,width=2){const c=this.ctx;c.strokeStyle=color;c.lineWidth=width;c.lineCap='square';c.lineJoin='miter';c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.stroke();}
  cloud(x,y,s=1){const c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));c.scale(s,s);this.r(0,5,38,7,'#edf7e9');this.r(6,0,22,7,'#edf7e9');this.r(13,-5,10,6,'#edf7e9');this.r(4,12,33,3,'#bddad4');c.restore();}
  tree(x,y,s=1){const c=this.ctx;c.save();c.translate(x,y);c.scale(s,s);this.r(-3,-2,6,43,'#8e9b78');this.r(2,1,3,37,'#718968');this.r(-16,-21,32,25,'#8eb897');this.r(-23,-11,45,14,'#8eb897');this.r(-12,-30,25,14,'#8eb897');this.r(-17,-16,11,12,'#a2c6a0');this.r(-9,-27,15,10,'#a2c6a0');this.r(-12,2,31,8,'#709c83');c.restore();}
  background(t,mode){const c=this.ctx;
    this.r(0,0,500,290,'#d4e9df');this.r(0,0,500,110,'#cce4df');
    this.r(390,24,25,25,'#f4ecb9');this.r(385,29,35,15,'#f4ecb9');this.r(395,19,15,35,'#f4ecb9');this.r(397,27,15,14,'#fff4c3');
    this.cloud(53+Math.sin(t*.07)*4,54,.85);this.cloud(205+Math.sin(t*.06)*5,31,.6);this.cloud(429+Math.sin(t*.06)*4,81,.7);
    this.r(0,107,500,55,'#a4c9ba');
    [[0,112,60,30],[34,103,60,42],[79,93,35,55],[102,87,39,60],[130,99,65,48],[171,109,44,34],[225,111,40,34],[260,104,60,42],[306,91,70,51],[358,102,80,45],[418,113,84,35]].forEach(a=>this.r(...a,'#b1cec0'));
    [[18,120,90,32],[75,112,105,30],[125,106,15,10],[165,119,70,29],[296,116,120,35],[327,109,40,10],[408,127,80,25]].forEach(a=>this.r(...a,'#94b7a5'));
    this.r(0,145,500,48,'#85c0c4');this.r(0,145,500,5,'#a4d1ca');this.r(0,160,500,3,'#a4d1ca');this.r(0,182,500,10,'#acd5c7');
    for(let i=0;i<17;i++){const x=(i*43+Math.floor(t*2))%520-20,y=151+(i%5)*7;this.r(x,y,11+(i%3)*5,1,i%2?'#b4ddd0':'#c1e0d4');}
    this.r(0,189,500,25,'#cedbb2');this.r(0,188,500,3,'#e7e6c6');
    this.r(0,211,500,79,'#d9a78a');this.r(0,213,500,5,'#bd9277');this.r(0,221,500,5,'#e6c6a6');this.r(0,255,500,4,'#f1d9b7');this.r(0,285,500,4,'#e9c4a3');
    // Lane lines, with perspective and a few hand-placed chalk markers.
    for(let i=0;i<7;i++){const x=i*95-35;this.line([[x,258],[x-31,289]],'#eac9a7',2);}
    this.r(349,237,33,2,'#ebc8a7');this.r(374,239,8,2,'#ebc8a7');this.r(361,244,21,2,'#ebc8a7');
    // Camp hut and striped awning.
    this.r(14,141,87,57,'#e9d5ac');this.r(20,153,27,45,'#f4e5bd');this.r(52,153,40,34,'#a2c4b2');this.r(56,157,32,26,'#7aab9b');this.r(70,156,3,30,'#e8d7ae');
    this.r(9,137,97,10,'#7c9780');this.r(14,128,87,11,'#8daa8e');this.r(23,122,67,7,'#8daa8e');
    for(let i=0;i<5;i++)this.r(11+i*19,138,9,9,'#f3e9bf');
    this.r(17,153,74,12,'#f2ebc8');c.fillStyle='#6f8a70';c.font='bold 5px monospace';c.fillText('СЪЕДОБНАЯ АТЛЕТИКА',19,161);
    this.r(25,180,16,18,'#b9a780');this.r(37,186,2,2,'#78856b');this.r(9,199,97,4,'#b5b68e');
    // The club's cake stand: training and treats belong in the same world.
    this.r(65,181,22,9,'#f1c6b5');this.r(65,179,22,3,'#fff1cf');this.r(65,186,22,2,'#a97f67');this.r(63,190,26,3,'#eee4bf');this.r(71,175,4,4,'#db8878');this.r(80,176,3,3,'#db8878');
    // Flower beds, shade trees and a park bench.
    this.tree(433,164,.9);this.tree(478,185,1.1);this.tree(5,176,.8);
    this.r(390,194,58,5,'#a7946f');this.r(392,201,54,5,'#a7946f');this.r(396,203,3,12,'#75826c');this.r(439,203,3,12,'#75826c');this.r(391,194,3,11,'#79866c');this.r(445,194,3,11,'#79866c');
    this.r(105,201,45,9,'#a4b28a');this.r(108,198,35,5,'#89a37c');for(let i=0;i<5;i++){this.r(109+i*7,195-(i%2)*3,3,5,'#eecca3');this.r(110+i*7,199,1,4,'#789373');}
    // A parked bicycle, towel and water station.
    this.bicycle(134,217,.66,0,'#6b8d7a');this.r(349,197,20,24,'#b4bf8f');this.r(346,195,25,4,'#dbe3b4');this.r(352,183,11,13,'#aad4c9');this.r(354,181,7,3,'#7ba89a');this.r(357,202,5,3,'#6f967c');
    this.r(171,214,26,4,'#d8e0b5');this.r(173,211,24,4,'#f4e9bd');this.r(176,211,3,5,'#aec6a2');
    // Foreground planting frames the world.
    this.r(0,270,42,20,'#86a980');this.r(0,263,21,27,'#9cb98a');this.r(18,277,45,13,'#9cb98a');this.r(22,269,23,10,'#adc798');this.r(477,272,23,18,'#8fae81');this.r(465,282,35,8,'#aac28e');
    for(let i=0;i<7;i++){this.r(280+i*14,203+i%3,3,1,'#9bac7a');this.r(190+i*19,194+i%2,2,2,'#adc496');}
    // Little seagull in the distance.
    const gx=290+Math.sin(t*.2)*17,gy=83+Math.sin(t*1.2)*2;this.line([[gx-5,gy-1],[gx-2,gy+1],[gx,gy],[gx+3,gy+1],[gx+5,gy-1]],'#819f91',1);
    if(mode==='sleep'){c.fillStyle='#344b6538';c.fillRect(0,0,500,290);}
  }
  bicycle(x,y,scale,spin=0,color='#477d73'){
    const c=this.ctx;c.save();c.translate(x,y);c.scale(scale,scale);
    for(const wx of [-22,23]){c.strokeStyle='#3e5c56';c.lineWidth=3;c.beginPath();c.arc(wx,-2,17,0,Math.PI*2);c.stroke();c.strokeStyle='#c0cfad';c.lineWidth=1.5;c.beginPath();c.arc(wx,-2,13.5,0,Math.PI*2);c.stroke();for(let i=0;i<4;i++){const a=i*Math.PI/2+spin;this.line([[wx,-2],[wx+Math.cos(a)*13,-2+Math.sin(a)*13]],'#819f89',1);}this.r(wx-2,-4,4,4,'#425d55');}
    this.line([[-22,-2],[-8,-25],[5,-2],[-22,-2],[-8,-25],[14,-25],[5,-2]],color,3);this.line([[14,-31],[23,-2]],color,3);this.line([[12,-31],[19,-32],[23,-28]],'#405e54',3);this.line([[-8,-25],[-10,-32]],'#405e54',2);this.r(-17,-34,14,3,'#426354');this.r(2,-5,6,6,'#547663');c.restore();
  }
  athlete(x,y,t,mode,s){
    const c=this.ctx,kit={mint:'#d9ed74',sunset:'#ef9870',violet:'#b7a0d8'}[s.kit]||'#d9ed74',kitShade={mint:'#acc05f',sunset:'#cc7458',violet:'#9681b7'}[s.kit]||'#acc05f';
    c.fillStyle='#8c79582b';c.beginPath();c.ellipse(x,y+2,27,5,0,0,Math.PI*2);c.fill();
    if(mode==='bike'){
      this.bicycle(x,y-1,1.15,t*5,kitShade);c.save();c.translate(x-2,y-39);c.rotate(.35);this.r(-8,-17,17,20,kit);this.r(4,-14,6,20,'#e3b591');this.r(7,3,12,5,'#e3b591');this.r(-7,0,16,9,'#4e6961');c.restore();
      const pedal=Math.sin(t*8)*6;this.line([[x-4,y-32],[x-12+pedal,y-18],[x+pedal,y-7]],'#d2a384',6);this.r(x-3+pedal,y-9,10,5,'#f4efdc');this.head(x+12,y-67,t,s,true);return;
    }
    if(mode==='swim'){
      this.r(x-61,y-19,122,32,'#83c2c7');this.r(x-67,y-12,132,22,'#87c9cb');this.r(x-61,y+3,125,3,'#b3e0d6');
      c.save();c.translate(x+3,y-8);c.rotate(Math.PI/2-.15);this.r(-8,-13,16,23,kit);this.r(-7,9,14,10,'#4e6961');this.r(-8,17,6,19,'#deb08c');this.r(3,18,6,19,'#e6ba97');c.restore();this.head(x+28,y-21,t,s,true);
      this.line([[x+4,y-13],[x+9+Math.sin(t*5)*15,y-35],[x+27,y-35+Math.sin(t*5)*8]],'#e4b491',7);
      for(let i=0;i<5;i++)this.r(x-48+i*23,y+4+Math.sin(t*4+i)*3,13,2,'#d3eee1');return;
    }
    if(mode==='sleep'){
      this.r(x-45,y-4,90,11,'#a2b59b');this.r(x-46,y-10,91,11,'#c5d3b5');this.r(x+20,y-14,22,13,'#f7efcf');
      c.save();c.translate(x+18,y-12);c.rotate(Math.PI/2);this.r(-9,0,18,30,kit);this.r(-8,21,16,18,kitShade);c.restore();this.head(x+28,y-22,t,s,false,true);
      c.fillStyle='#6e8981';c.font='bold 11px monospace';c.fillText('z',x+45,y-39-Math.sin(t*1.5)*3);c.font='bold 8px monospace';c.fillText('z',x+55,y-51-Math.sin(t*1.5)*3);return;
    }
    const moving=['run','walk','celebrate'].includes(mode);const bounce=moving?Math.abs(Math.sin(t*(mode==='walk'?5:9)))*3:Math.sin(t*2)*1.1;
    c.save();c.translate(x,y-bounce);
    const stride=moving?Math.sin(t*(mode==='walk'?5:9))*7:0;
    // Large head, short, expressive limbs, crisp pixel edges.
    this.r(-12,-33,10,17+stride*.4,'#d4aa8b');this.r(3,-33,10,17-stride*.4,'#e7bb96');
    this.r(-13-stride,-19,11,17,'#dfb391');this.r(3+stride,-19,11,17,'#ecc19d');
    this.r(-16-stride,-7,15,7,'#f5edd2');this.r(3+stride,-7,17,7,'#fff4d8');this.r(-16-stride,-2,16,3,'#718b78');this.r(3+stride,-2,18,3,'#718b78');
    this.r(-14,-43,28,16,'#4a6961');this.r(-13,-31,11,8,'#48635b');this.r(3,-31,10,8,'#45645b');
    this.r(-14,-65,28,27,kit);this.r(-11,-69,23,8,kit);this.r(-14,-47,28,8,kitShade);this.r(-10,-64,4,17,'#edf4b2');this.r(10,-63,4,19,kitShade);
    // Race bib.
    this.r(-8,-49,16,9,'#f9f4dc');c.fillStyle='#667e63';c.font='bold 6px monospace';c.fillText('СА',-4,-42);
    if(mode==='celebrate'){
      this.r(-21,-66,7,21,'#d5a987');this.r(-23,-83,8,24,'#e6ba95');this.r(16,-66,7,21,'#dfb28e');this.r(18,-83,8,23,'#f0c4a0');
    }else if(mode==='eat'||mode==='drink'){
      this.r(-21,-61,7,22,'#dfb391');this.r(-20,-44,20,7,'#e6bb96');this.r(15,-61,7,16,'#e5b993');this.r(0,-51,20,7,'#ebbd98');
      if(mode==='eat'){this.r(-11,-47,24,7,'#f0eddb');this.r(-7,-40,17,5,'#c1cbb1');this.r(-9,-49,19,3,'#e2b074');this.r(-4,-51,8,2,'#90ae74');}else{this.r(4,-65,10,20,'#8fc4bd');this.r(5,-68,8,4,'#f2edcd');this.r(6,-59,6,7,'#cfebd6');}
    }else if(mode==='rest'){
      this.r(-25,-59,12,7,'#e2b591');this.r(-25,-74,7,18,'#e4b993');this.r(15,-59,13,7,'#e3b695');this.r(22,-74,7,18,'#efbf99');
    }else{
      this.r(-21,-61,7,21-stride*.4,'#dab18d');this.r(-22+stride*.5,-44,7,15,'#e8bd98');this.r(15,-61,7,21+stride*.4,'#e5b995');this.r(16-stride*.5,-44,7,15,'#f0c4a0');
    }
    this.head(0,-80,t,s,mode==='run');c.restore();
  }
  head(x,y,t,s,sport=false,sleep=false){
    const c=this.ctx;c.save();c.translate(Math.round(x),Math.round(y));
    this.r(-15,-16,30,30,'#e9bd99');this.r(-18,-9,5,15,'#dba883');this.r(14,-8,5,14,'#edc09a');this.r(-10,11,22,5,'#dcae8b');
    this.r(-14,-19,27,8,'#5b5445');this.r(-18,-14,12,8,'#5b5445');this.r(-17,-7,5,10,'#5b5445');this.r(6,-16,10,6,'#5b5445');this.r(-9,-21,17,5,'#6e624d');
    if(sport){this.r(-18,-13,34,5,'#f2edd4');this.r(-17,-12,19,2,'#d7dfb8');}
    const blink=Math.sin(t*.9)> .997||sleep;
    this.r(-8,0,4,blink?1:5,'#4d5145');this.r(6,0,4,blink?1:5,'#4d5145');
    if(!blink){this.r(-7,0,1,1,'#fff9e0');this.r(7,0,1,1,'#fff9e0');}
    this.r(-13,6,5,3,'#dda18a');this.r(10,6,5,3,'#dda18a');
    if(s.mood<30){this.r(-1,10,6,2,'#936f59');this.r(0,8,4,2,'#936f59');}else{this.r(-1,8,6,2,'#976b52');this.r(0,10,4,2,'#976b52');}
    c.restore();
  }
  loop(time){
    requestAnimationFrame(this.loop);if(document.hidden||time-this.last<33)return;this.last=time;
    const s=this.getState();if(!s)return;const motion=s.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;const t=motion?time/1000:0;
    if(time>this.until)this.mode='idle';const mode=this.mode;this.ctx.setTransform(2,0,0,2,0,0);this.ctx.imageSmoothingEnabled=false;this.background(t,mode);this.athlete(256,238,t,mode,s);
    if(motion){for(const p of this.particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.life--;this.r(p.x,p.y,3,3,p.color);}this.particles=this.particles.filter(p=>p.life>0);}else this.particles=[];
  }
}
