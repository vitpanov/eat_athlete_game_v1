import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,restoreGame,act,sleep,buy,canTrain,trainingPreview,beginRace,tickRace,useGel,finishRace,RACES,raceIndex} from '../dist/game.js';

test('A day has four actions; hydration does not spend one',()=>{
  const s=createGame();act(s,'water');assert.equal(s.ap,4);act(s,'swim');act(s,'meal');act(s,'rest');act(s,'run');
  assert.equal(s.ap,0);assert.equal(act(s,'bike').ok,false);assert.equal(act(s,'meal').ok,false);
});
test('Daily balance gives the reward exactly once',()=>{
  const s=createGame();act(s,'swim');act(s,'meal');act(s,'water');assert.equal(s.coins,108);
  act(s,'run');assert.equal(s.coins,116);assert.equal(s.today.bonus,true);
});
test('Low fuel and water block training without changing state',()=>{
  for(const key of ['fuel','water']){const s=createGame();s[key]=3;const before=JSON.stringify(s);assert.equal(act(s,'run').ok,false);assert.equal(JSON.stringify(s),before);}
});
test('Fatigue reduces adaptation and rest reverses it',()=>{
  const s=createGame();s.fatigue=80;const tired=trainingPreview(s,'run').gain;act(s,'rest');act(s,'rest');assert.ok(trainingPreview(s,'run').gain>tired);
});
test('A well-fueled night gives a better recovery and resets the daily quest',()=>{
  const good=createGame(),bad=createGame();good.energy=10;bad.energy=10;bad.fuel=5;bad.water=5;good.today.bonus=true;
  sleep(good);sleep(bad);assert.ok(good.energy>bad.energy);assert.equal(good.ap,4);assert.equal(good.day,2);assert.equal(good.today.bonus,false);
});
test('Gear is purchased once and affects the appropriate skill',()=>{
  const s=createGame();s.coins=100;const gain=trainingPreview(s,'swim').gain;assert.equal(buy(s,'goggles').ok,true);assert.equal(s.coins,0);assert.equal(trainingPreview(s,'swim').gain,gain+1);assert.equal(buy(s,'goggles').ok,false);assert.equal(s.gear.length,1);
});
test('The club dessert is charged once a day without spending an action',()=>{
  const s=createGame();s.mood=30;s.fuel=40;const ap=s.ap;
  assert.equal(act(s,'dessert').ok,true);assert.equal(s.coins,65);assert.equal(s.ap,ap);assert.equal(s.mood,50);assert.equal(s.fuel,58);
  assert.equal(act(s,'dessert').ok,false);assert.equal(s.coins,65);sleep(s);assert.equal(act(s,'dessert').ok,true);
});
test('Locked race and underfueled athlete cannot start',()=>{
  const s=createGame();assert.equal(beginRace(s).ok,false);s.day=7;s.energy=10;assert.equal(beginRace(s).ok,false);s.energy=80;assert.equal(beginRace(s).ok,true);
});
test('Gel can be used once per race',()=>{
  const s=createGame();s.day=7;const r=beginRace(s);r.stamina=40;assert.equal(useGel(r),true);assert.equal(r.stamina,68);assert.equal(useGel(r),false);assert.equal(r.stamina,68);
});
test('Race finish is recorded only once and unlocks the next distance',()=>{
  const s=createGame();s.day=7;const r=beginRace(s);r.pace='easy';
  for(let i=0;i<1000&&!r.finished;i++){if(r.stamina<45)useGel(r);tickRace(s,r,.1);}
  assert.equal(r.success,true);const result=finishRace(s,r);assert.ok(result.minutes>0);assert.equal(s.raceHistory.length,1);assert.equal(raceIndex(s),1);const coins=s.coins;assert.equal(finishRace(s,r),null);assert.equal(s.coins,coins);
});
test('Aggressive pacing can exhaust an unprepared athlete',()=>{
  const s=createGame();s.day=7;s.energy=30;s.fuel=25;s.water=25;s.fatigue=80;const r=beginRace(s);r.pace='fast';
  for(let i=0;i<1000&&!r.finished;i++)tickRace(s,r,.1);
  assert.equal(r.success,false);finishRace(s,r);assert.equal(s.wins.length,0);assert.equal(s.nextRaceDay,10);
});
test('All four distances are reachable with balanced training and recovery',()=>{
  const s=createGame();let totalRaces=0;
  for(let day=1;day<=45&&s.wins.length<4;day++){
    if(s.day>=s.nextRaceDay){
      if(s.fuel<65)act(s,'meal');if(s.water<65)act(s,'water');while(s.ap&& (s.energy<75||s.fatigue>25))act(s,'rest');
      const r=beginRace(s);assert.equal(r.ok,true);r.pace='easy';
      for(let i=0;i<1500&&!r.finished;i++){if(r.stamina<50)useGel(r);tickRace(s,r,.1);}
      finishRace(s,r);totalRaces++;
    }else{
      const lowest=Object.keys(s.skills).sort((a,b)=>s.skills[a]-s.skills[b])[0];
      if(s.water<65)act(s,'water');if(s.fuel<55)act(s,'meal');
      if(s.energy<40||s.fatigue>45)act(s,'rest');
      if(!canTrain(s,lowest))act(s,lowest);
      if(s.ap&&s.fuel<80)act(s,'meal');if(s.water<70)act(s,'water');
      if(s.ap)act(s,'rest');
    }
    if(s.wins.length<4)sleep(s);
  }
  assert.equal(s.wins.length,4);assert.ok(totalRaces<=8);assert.ok(s.badges.includes('iron'));
});
test('Save and resume preserve progress, including an active race',()=>{
  const s=createGame('Тест');s.day=7;act(s,'swim');s.activeRace=beginRace(s);tickRace(s,s.activeRace,1);
  const restored=restoreGame(JSON.stringify(s));assert.equal(restored.name,'Тест');assert.equal(restored.skills.swim,s.skills.swim);assert.equal(restored.activeRace.progress,s.activeRace.progress);
  assert.throws(()=>restoreGame('{broken'));assert.throws(()=>restoreGame('{"version":1}'));
});
test('Long play always keeps care metrics within bounds',()=>{
  const s=createGame();const actions=['swim','bike','run','meal','water','rest','joy'];
  for(let i=0;i<500;i++){act(s,actions[i%actions.length],i%5===0);if(i%8===0)sleep(s);for(const k of ['energy','fuel','water','mood','fatigue'])assert.ok(s[k]>=0&&s[k]<=100,`${k}: ${s[k]}`);}
});
