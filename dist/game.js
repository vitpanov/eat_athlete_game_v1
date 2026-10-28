export const SAVE_KEY = 'tribuddy-v1';
export const RACES = [
  {name:'Спринт за круассаном', short:'Спринт', tag:'WILL RACE FOR CROISSANTS', distances:['750 м','20 км','5 км'], target:30, minutes:[19,49,31], reward:180},
  {name:'Олимпийский аппетит', short:'Олимпийка', tag:'HUNGRY FOR MORE', distances:['1,5 км','40 км','10 км'], target:47, minutes:[36,92,60], reward:280},
  {name:'Половинка с начинкой', short:'70.3', tag:'HALF THE DISTANCE. ALL THE APPETITE.', distances:['1,9 км','90 км','21,1 км'], target:64, minutes:[45,190,130], reward:400},
  {name:'Полный фарш', short:'226', tag:'THE FULL COURSE', distances:['3,8 км','180 км','42,2 км'], target:80, minutes:[90,390,270], reward:600}
];
export const TRAININGS = {
  swim:{name:'Плавание', english:'Swim', energy:17,fuel:11,water:12,fatigue:12,gain:5,xp:18,unit:'800 м',line:'Поймай свою волну.'},
  bike:{name:'Велосипед', english:'Bike', energy:21,fuel:14,water:16,fatigue:15,gain:6,xp:22,unit:'20 км',line:'Крути педали к мечте.'},
  run:{name:'Бег', english:'Run', energy:19,fuel:13,water:17,fatigue:14,gain:5,xp:20,unit:'5 км',line:'Ещё один шаг вперёд.'}
};
export const GEAR = [
  {id:'goggles',name:'Быстрые очки',desc:'+1 к росту плавания',price:100,icon:'swim',color:'blue'},
  {id:'bike',name:'Карбоновый друг',desc:'+1 к росту велосипеда',price:180,icon:'bike',color:'orange'},
  {id:'shoes',name:'Пара с характером',desc:'+1 к росту бега',price:130,icon:'run',color:'purple'},
  {id:'bed',name:'Облачная подушка',desc:'+10 энергии после сна',price:160,icon:'moon',color:'blue'},
  {id:'sunset',name:'Костюм «Закат»',desc:'Новый цвет твоего атлета',price:90,icon:'shirt',color:'orange'},
  {id:'violet',name:'Костюм «Космос»',desc:'Для неземных финишей',price:90,icon:'shirt',color:'purple'}
];
export const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
export const level=s=>1+Math.floor(s.xp/100);
export const fitness=s=>Math.round((s.skills.swim+s.skills.bike+s.skills.run)/3);
export const readiness=s=>Math.round(clamp(s.energy*.34+s.fuel*.2+s.water*.16+s.mood*.1+(100-s.fatigue)*.2));
export const raceIndex=s=>Math.min(s.wins.length,3);
export function createGame(name='Батон'){
  return {version:1,name:name.trim().slice(0,24)||'Батон',day:1,ap:4,energy:84,fuel:76,water:78,mood:85,fatigue:10,
    skills:{swim:18,bike:22,run:20},xp:0,coins:80,gear:[],kit:'mint',wins:[],raceHistory:[],nextRaceDay:3,
    trainingCounts:{swim:0,bike:0,run:0},today:{training:false,meal:false,water:false,bonus:false,drinks:0,dessert:false},
    log:[{day:1,text:'Ты в «Съедобной атлетике». Здесь тренируются с аппетитом!',icon:'flag'}],badges:[],sound:false,motion:true,welcomed:false};
}
export function restoreGame(raw){
  const d=JSON.parse(raw);
  if(!d||d.version!==1||!Number.isFinite(d.day)||!d.skills)throw Error('Invalid save');
  const s={...createGame(),...d};
  s.name=typeof d.name==='string' ? d.name.trim().slice(0,24)||'Батон':'Батон';
  for(const k of ['energy','fuel','water','mood','fatigue'])s[k]=clamp(Number.isFinite(d[k])?d[k]:70);
  s.day=Math.floor(clamp(d.day,1,10000));s.ap=Math.floor(clamp(d.ap??4,0,4));
  for(const k of ['xp','coins'])s[k]=Math.floor(clamp(Number.isFinite(d[k])?d[k]:0,0,100000));
  s.skills=Object.fromEntries(['swim','bike','run'].map(k=>[k,clamp(Number.isFinite(d.skills[k])?d.skills[k]:20)]));
  for(const k of ['gear','wins','raceHistory','log','badges'])if(!Array.isArray(s[k]))s[k]=[];
  s.gear=s.gear.filter(id=>GEAR.some(g=>g.id===id));
  s.trainingCounts={...createGame().trainingCounts,...d.trainingCounts};s.today={...createGame().today,...d.today};
  s.nextRaceDay=Math.max(1,Number.isFinite(d.nextRaceDay)?Math.floor(d.nextRaceDay):3);
  // Existing first-time players can also enjoy the earlier first start.
  if(s.nextRaceDay===7 && !s.wins.length && !s.raceHistory.length && !d.activeRace) s.nextRaceDay=3;
  if(!['mint','sunset','violet'].includes(s.kit))s.kit='mint';
  return s;
}
function addLog(s,text,icon='spark'){s.log.unshift({day:s.day,text,icon});s.log=s.log.slice(0,35);}
function rewardDaily(s){
  if(s.today.training&&s.today.meal&&s.today.water&&!s.today.bonus){s.today.bonus=true;s.coins+=20;addLog(s,'Дневной баланс: тренировка, еда и вода. +20 крошек!','check');return true;}return false;
}
export function clubChallenge(s){
  const id=['swim','bike','run'][(s.day-1)%3];
  return {id,name:TRAININGS[id].name,done:!!s.today.clubBonus};
}
function badges(s){
  const list=[];
  if(Object.values(s.trainingCounts).some(n=>n>0))list.push('first');
  if(Object.values(s.trainingCounts).every(n=>n>0))list.push('triple');
  if(s.wins.length)list.push('finisher');
  if(s.wins.length>=3)list.push('half');
  if(s.wins.length>=4)list.push('iron');
  const fresh=list.filter(id=>!s.badges.includes(id));s.badges.push(...fresh);return fresh;
}
export function trainingPreview(s,id,intense=false){
  const t=TRAININGS[id];if(!t)return null;
  const mult=intense?1.45:1;
  const gearBonus=s.gear.includes({swim:'goggles',bike:'bike',run:'shoes'}[id])?1:0;
  const readinessMult=s.fatigue>65?.55:s.fatigue>45?.8:1;
  return {...t,energy:Math.round(t.energy*mult),fuel:Math.round(t.fuel*mult),water:Math.round(t.water*mult),fatigue:Math.round(t.fatigue*mult),gain:Math.max(1,Math.round((t.gain*(intense?1.4:1)+gearBonus)*readinessMult)),xp:Math.round(t.xp*mult)};
}
export function canTrain(s,id,intense=false){
  const t=trainingPreview(s,id,intense);
  if(!t)return 'Нет такой тренировки';
  if(s.ap<1)return 'Все дела на сегодня сделаны';
  if(s.energy<t.energy+5)return 'Сначала восстанови энергию';
  if(s.fuel<Math.max(20,t.fuel))return 'Сначала нужно поесть';
  if(s.water<Math.max(20,t.water))return 'Сначала попей воды';
  if(s.fatigue>=85)return 'Пора восстановиться';
  return '';
}
export function act(s,id,intense=false){
  let text='',animation=id;
  if(TRAININGS[id]){
    const error=canTrain(s,id,intense);if(error)return {ok:false,message:error};
    const t=trainingPreview(s,id,intense);s.ap--;s.energy-=t.energy;s.fuel-=t.fuel;s.water-=t.water;
    s.fatigue=clamp(s.fatigue+t.fatigue);s.mood=clamp(s.mood+5);s.skills[id]=clamp(s.skills[id]+t.gain);s.xp+=t.xp;s.coins+=8;
    s.trainingCounts[id]++;s.today.training=true;
    text=`${t.name}${intense?' · темпово':''}: +${t.gain} к навыку, +${t.xp} XP, +8 крошек.`;
  }else if(id==='water'){
    if(s.water>=95)return {ok:false,message:'Воды уже достаточно. Всё в балансе!'};
    if(s.today.drinks>=3)return {ok:false,message:'Три фляги выпиты. Новые будут завтра.'};
    const gain=Math.min(45,100-s.water);s.water=clamp(s.water+45);s.today.water=true;s.today.drinks++;text=`Запасы воды пополнены: +${gain}.`;animation='drink';
  }else if(id==='meal'){
    if(s.ap<1)return {ok:false,message:'Пора спать — завтрак будет утром.'};
    if(s.fuel>=96)return {ok:false,message:'Атлет уже сыт!'};
    s.ap--;s.fuel=clamp(s.fuel+42);s.energy=clamp(s.energy+8);s.mood=clamp(s.mood+6);s.today.meal=true;text='Хороший обед: +42 сытости, +8 энергии.';animation='eat';
  }else if(id==='rest'){
    if(s.ap<1)return {ok:false,message:'Дела закончились. Ночной сон уже ждёт.'};
    s.ap--;s.energy=clamp(s.energy+22);s.fatigue=clamp(s.fatigue-24);s.mood=clamp(s.mood+10);text='Восстановление: +22 энергии, −24 усталости.';animation='rest';
  }else if(id==='dessert'){
    if(s.today.dessert)return {ok:false,message:'Десерт дня уже съеден. Новая порция — завтра!'};
    if(s.coins<15)return {ok:false,message:'Для десерта нужно 15 крошек. За тренировку дают 8.'};
    s.coins-=15;s.fuel=clamp(s.fuel+18);s.mood=clamp(s.mood+20);s.energy=clamp(s.energy+5);s.today.dessert=true;
    const treat=['круассан финишёра','тирамису с характером','эклер на разгоне','сырник чемпиона'][((s.day-1)%4)];
    text=`Клубный десерт сегодня — ${treat}: +20 настроения, +18 сытости, +5 энергии. Вкусно жить!`;animation='eat';
  }else if(id==='joy'){
    if(s.ap<1)return {ok:false,message:'Прогуляемся завтра. Сейчас пора спать.'};
    s.ap--;s.mood=clamp(s.mood+30);s.energy=clamp(s.energy+10);s.fatigue=clamp(s.fatigue-8);text='Прогулка у моря: +30 настроения, +10 энергии.';animation='walk';
  }else return {ok:false,message:'Неизвестное действие'};
  addLog(s,text,TRAININGS[id]?id:id==='meal'?'food':id==='water'?'drop':'heart');
  const bonus=rewardDaily(s);
  let clubBonus=false;
  if(id===clubChallenge(s).id&&!s.today.clubBonus){s.today.clubBonus=true;s.coins+=12;clubBonus=true;addLog(s,'Клубное задание выполнено: +12 крошек!', 'spark');}
  const fresh=badges(s);
  return {ok:true,message:text+(bonus?' Бонус дня: +20 крошек!':'')+(clubBonus?' Клубное задание: +12 крошек!':''),animation,badges:fresh};
}
export function sleep(s){
  const good=s.fuel>=30&&s.water>=25;
  const gain=(good?42:25)+(s.gear.includes('bed')?10:0);
  s.day++;s.ap=4;s.energy=clamp(s.energy+gain);s.fuel=clamp(s.fuel-20);s.water=clamp(s.water-18);s.mood=clamp(s.mood-3);s.fatigue=clamp(s.fatigue-(good?30:19));
  s.today={training:false,meal:false,water:false,bonus:false,drinks:0,dessert:false};
  const message=good?`Доброе утро! Сон вернул ${gain} энергии и убрал 30 усталости.`:`Сон вернул ${gain} энергии. Еда и вода перед сном помогут восстановиться лучше.`;
  addLog(s,message,'moon');return {ok:true,message,animation:'sleep'};
}
export function buy(s,id){
  const g=GEAR.find(x=>x.id===id);if(!g)return {ok:false,message:'Нет такого предмета'};
  if(s.gear.includes(id)){
    if(['sunset','violet'].includes(id)){s.kit=id;return {ok:true,message:'Новый образ готов.'};}
    return {ok:false,message:'Это снаряжение уже у тебя.'};
  }
  if(s.coins<g.price)return {ok:false,message:`Не хватает ${g.price-s.coins} крошек. Тренируйся и выходи на старты!`};
  s.coins-=g.price;s.gear.push(id);if(['sunset','violet'].includes(id))s.kit=id;
  addLog(s,`Новое снаряжение: ${g.name}.`,'bag');return {ok:true,message:`${g.name} теперь у тебя!`};
}
export function raceEligibility(s){
  if(s.day<s.nextRaceDay)return `Старт откроется в день ${s.nextRaceDay}`;
  if(s.energy<30||s.fuel<25||s.water<25)return 'Для старта нужны: энергия ≥30, еда ≥25, вода ≥25.';
  return '';
}
export function beginRace(s){
  const error=raceEligibility(s);if(error)return {ok:false,message:error};
  return {ok:true,index:raceIndex(s),progress:0,phase:0,stamina:clamp(readiness(s)-s.fatigue*.10),pace:'steady',gel:false,elapsed:0,minutes:0,splits:[0,0,0],finished:false};
}
export function tickRace(s,r,dt){
  if(r.finished)return;
  const config=RACES[r.index];const pace={easy:{speed:.9,drain:.62},steady:{speed:1,drain:1},fast:{speed:1.13,drain:1.65}}[r.pace]||{speed:1,drain:1};
  const phase=Math.min(2,Math.floor(r.progress/100));r.phase=phase;
  const skill=s.skills[['swim','bike','run'][phase]];
  const weak=Math.max(0,config.target-skill)*.032;
  const drain=(1.35+r.index*.25+weak)*pace.drain;
  r.stamina=clamp(r.stamina-dt*drain);r.elapsed+=dt;
  const speed=pace.speed*(r.stamina<15?.58:1);
  const step=Math.min(100-r.progress%100,dt*12*speed);
  const minutes=step/100*config.minutes[phase]*(1.26-skill*.005)/pace.speed*(r.stamina<15?1.35:1);
  r.progress=Math.min(300,r.progress+step);r.minutes+=minutes;r.splits[phase]+=minutes;
  if(r.progress>=300||r.stamina<=0){r.finished=true;r.success=r.progress>=300&&r.stamina>0;}
}
export function useGel(r){if(r.gel||r.finished)return false;r.gel=true;r.stamina=clamp(r.stamina+28);return true;}
export function finishRace(s,r){
  if(!r.finished||r.recorded)return null;r.recorded=true;
  const c=RACES[r.index];const reward=r.success?c.reward:35;
  s.energy=clamp(Math.round(r.stamina*.5),8,100);s.fuel=clamp(s.fuel-35);s.water=clamp(s.water-28);s.fatigue=clamp(s.fatigue+30);s.mood=clamp(s.mood+(r.success?22:-8));s.coins+=reward;s.xp+=r.success?100:30;s.ap=0;
  const record={day:s.day,race:c.short,index:r.index,minutes:r.minutes,splits:r.splits.slice(),success:r.success};s.raceHistory.unshift(record);
  if(r.success&&s.wins.length<=r.index)s.wins.push(r.index);
  s.nextRaceDay=s.day+(r.success?7:3);
  addLog(s,r.success?`${c.short}: финиш! +${reward} крошек. Следующий старт — день ${s.nextRaceDay}.`:`Старт остановлен: силы закончились. Восстановимся и попробуем в день ${s.nextRaceDay}.`,'flag');
  return {...record,reward,badges:badges(s)};
}
// The club leaderboard needs a server; these are the athlete's own best results.
export function personalBests(s){
  return RACES.map((race,index)=>{
    const results=s.raceHistory.filter(r=>r&&r.success===true&&r.index===index&&Number.isFinite(r.minutes)&&r.minutes>=0);
    return {index,name:race.short,minutes:results.length?Math.min(...results.map(r=>r.minutes)):null};
  });
}
export function formatTime(minutes){
  const seconds=Math.round(minutes*60);const h=Math.floor(seconds/3600);const m=Math.floor((seconds%3600)/60);const sec=seconds%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
