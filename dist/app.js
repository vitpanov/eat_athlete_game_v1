import {SAVE_KEY,RACES,TRAININGS,GEAR,createGame,restoreGame,level,fitness,readiness,raceIndex,trainingPreview,canTrain,act,sleep,buy,raceEligibility,beginRace,tickRace,useGel,finishRace,formatTime} from './game.js';
import {CampScene} from './scene.js';
const $=id=>document.getElementById(id);
const paths={
 club:'M7 3v5M3 3v3c0 4 8 4 8 0V3M7 10v11M17 2c-3 4-4 7-4 11h4M17 2v19M21 4v4M21 12v4',
 share:'M12 16V2M7 7l5-5 5 5M5 12H3v10h18V12h-2',
 home:'m3 10 9-8 9 8v12H3V10ZM9 22v-8h6v8',
 cake:'M3 12h18v10H3V12ZM3 16c3 3 3-3 6 0s3-3 6 0 3-3 6 0M6 12V8h12v4M12 8V5M12 2v1',
 swim:'M2 18c2-3 4 3 6 0s4 3 6 0 4 3 8 0M2 22c2-3 4 3 6 0s4 3 6 0 4 3 8 0M4 13l5-6 4 3 4 5M9 7l3-4 5 3M16 9a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
 bike:'M1 16a5 5 0 1 0 10 0 5 5 0 1 0-10 0M14 16a5 5 0 1 0 10 0 5 5 0 1 0-10 0M6 16l4-9 5 9H6l4-9h7l2 9M8 7h4M16 4h3l2 3',
 run:'M13 4a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 10l5-2 4 3 5 2 3-3M13 11l-3 5 5 3 1 4M10 16l-5 5H1M9 8l3-2',
 bolt:'M13 2 4 14h7l-1 9 10-13h-8l1-8',
 food:'M7 2v7M3 2v4c0 5 8 5 8 0V2M7 10v12M20 2c-4 3-5 8-5 12h5M20 2v20',
 drop:'M12 2C9 7 4 11 4 16a8 8 0 0 0 16 0C20 11 15 7 12 2ZM8 16c0 2 1 3 3 4',
 smile:'M22 12a10 10 0 1 0-20 0 10 10 0 1 0 20 0M8 9h.01M16 9h.01M7 14c2 4 8 4 10 0',
 heart:'M20 4c-3-2-6 0-8 2-2-2-5-4-8-2-5 4 0 10 8 17 8-7 13-13 8-17Z',
 moon:'M21 14A9 9 0 0 1 10 3 9 9 0 1 0 21 14Z',
 sun:'M16 12a4 4 0 1 0-8 0 4 4 0 1 0 8 0M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',
 arrow:'M4 12h16M15 7l5 5-5 5',
 check:'m5 12 4 4L19 6',
 close:'m6 6 12 12M6 18 18 6',
 calendar:'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM7 2v6M17 2v6M3 11h18M7 15h3M14 15h3',
 settings:'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3ZM16 12a4 4 0 1 0-8 0 4 4 0 1 0 8 0',
 person:'M16 6a4 4 0 1 0-8 0 4 4 0 1 0 8 0M4 22v-3a8 8 0 0 1 16 0v3',
 edit:'m4 16 12-12 4 4L8 20H4v-4ZM14 6l4 4',
 recovery:'M4 10a8 8 0 0 1 14-4l3 3M21 3v6h-6M20 14a8 8 0 0 1-14 4l-3-3M3 21v-6h6',
 spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7',
 soundOff:'M11 4 6 8H2v8h4l5 4V4ZM17 9l6 6M23 9l-6 6',
 soundOn:'M11 4 6 8H2v8h4l5 4V4ZM15 8c3 2 3 6 0 8M18 4c6 4 6 12 0 16',
 flag:'M5 22V3c5-4 9 4 14 0v10c-5 4-9-4-14 0',
 trophy:'M7 3h10v8c0 7-10 7-10 0V3ZM7 5H3v4c0 4 4 5 6 5M17 5h4v4c0 4-4 5-6 5M12 16v5M7 22h10',
 lock:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4V10ZM12 15v3',
 bag:'M4 7h16l1 15H3L4 7ZM8 8V5a4 4 0 0 1 8 0v3',
 shirt:'M8 3 2 6l2 6 3-1v11h10V11l3 1 2-6-6-3c0 4-8 4-8 0Z',
 info:'M22 12a10 10 0 1 0-20 0 10 10 0 1 0 20 0M12 11v7M12 6h.01',
 leaf:'M20 3C6 2 1 12 7 18c6 6 16 1 13-15ZM4 22 16 9',
 pause:'M8 5v14M16 5v14',
 play:'m8 4 12 8-12 8V4'
};
function icon(name,extra=''){return `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.spark}"/></svg>`;}
function icons(root=document){root.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));}
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state=createGame(),storageOk=true,hadCorruptSave=false;
try{const raw=localStorage.getItem(SAVE_KEY);if(raw)state=restoreGame(raw);}catch(e){hadCorruptSave=true;}
let tab='train',intense=false,busy=false,toastTimer,speechTimer,race=null,raceTimer=null,racePaused=false,modalLocked=false,modalMode='',lastPet=0;
const scene=new CampScene($('world'),()=>state);
const rank=()=>['Начинающая булочка','Батон на разгоне','Триатлет аль денте','Голодный до финишей','Шеф полного триатлона'][Math.min(4,Math.floor((level(state)-1)/2))];
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));storageOk=true;}catch(e){storageOk=false;}$('saveWarning').hidden=storageOk;$('saveStatus').innerHTML=storageOk?'<i class="live-dot"></i> Прогресс сохранён на этом устройстве':'Прогресс не сохранён — проверь настройки браузера';}
function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4300);}
function speak(text,duration=3800){clearTimeout(speechTimer);$('speech').textContent=text;speechTimer=setTimeout(()=>{$('speech').textContent=idleSpeech();},duration);}
function idleSpeech(){if(state.energy<25)return 'У меня батарейка на нуле…';if(state.fuel<30)return 'Сначала поедим?';if(state.water<30)return 'Моя фляга совсем пустая!';if(state.fatigue>70)return 'Давай сегодня чуть помягче.';if(state.mood<35)return 'Хочу к морю. Просто погулять.';if(state.day>=state.nextRaceDay)return 'Наш день! Старт уже открыт.';return ['Я не ленивый. Я на расстойке.','За круассаном — только бегом!','Съедобная атлетика: всё по вкусу.','Recovery — лежу, но с пользой.','Плывём. Крутим. Бежим. Едим.'][Math.floor(state.day/2)%5];}
let audioCtx;
function beep(kind='action'){
  if(!state.sound)return;
  try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const notes=kind==='win'?[523,659,784,1047]:kind==='sleep'?[523,392]:[659,880];notes.forEach((hz,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=hz;g.gain.value=.035;g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+i*.11+.15);o.connect(g);g.connect(audioCtx.destination);o.start(audioCtx.currentTime+i*.11);o.stop(audioCtx.currentTime+i*.11+.16);});}catch(e){}
}
function coach(){if(state.day>=state.nextRaceDay)return 'Старт открыт! Сначала поешь, попей и восстанови энергию.';if(state.ap===0)return 'Все четыре дела сделаны. Ночной сон вернёт энергию.';if(state.energy<30)return 'Энергии мало. Восстановление и сон помогут вернуться в строй.';if(state.fatigue>65)return 'Накопилась усталость. Отдых сейчас полезнее ещё одной тренировки.';if(state.fuel<30)return 'С пустым баком далеко не уедешь. Пора поесть.';if(state.water<30)return 'Пора наполнить флягу. Вода не тратит действие.';return 'Энергия есть. Самое время для тренировки. Не забывай про все три вида.';}
function render(){
  document.body.classList.toggle('no-motion',!state.motion);
  $('coins').textContent=state.coins;$('athleteName').textContent=state.name;$('athleteLevel').textContent=`LVL ${level(state)} · ${rank()}`;
  const time=['Утро','Позднее утро','День','Вечер','Время спать'][4-state.ap];
  $('dayLabel').innerHTML=`${String(state.day).padStart(2,'0')} <span>/ ${time}</span>`;
  $('greeting').textContent=state.day>=state.nextRaceDay?'Сегодня подают финиш.':state.ap===0?'Замес готов. Пора отдыхать.':'Есть. Тренить. Повторить.';
  $('xpValue').textContent=`${state.xp%100} / 100 XP`;$('xpFill').style.width=state.xp%100+'%';
  const vitals=[['energy','Энергия','Energy','bolt','#b9ce7c'],['fuel','Сытость','Fuel','food','#edb081'],['water','Вода','Hydration','drop','#85bed0'],['mood','Настроение','Mood','smile','#b9a5d1']];
  $('vitals').innerHTML=vitals.map(([key,label,en,ic,color])=>`<div class="vital ${state[key]<25?'low':''}"><div class="vital-top"><span>${icon(ic)} ${label} <span class="en">${en}</span></span><b>${Math.round(state[key])}<span> / 100</span></b></div><div class="vital-track" role="meter" aria-label="${label}" aria-valuenow="${Math.round(state[key])}" aria-valuemin="0" aria-valuemax="100"><i style="width:${state[key]}%;background:${color}"></i></div></div>`).join('');
  $('fatigueValue').textContent=`${Math.round(state.fatigue)} / 100`;$('fatigueFill').style.width=state.fatigue+'%';$('fatigueFill').style.background=state.fatigue>65?'#df9b7b':'#b2a1c7';
  $('coachTip').innerHTML=icon('spark')+`<p>${coach()}</p>`;
  $('apLabel').innerHTML=Array.from({length:4},(_,i)=>`<i class="${i>=state.ap?'used':''}"></i>`).join('')+`<span>${state.ap}/4 дела</span>`;$('apLabel').setAttribute('aria-label',`Осталось ${state.ap} действия из 4`);
  $('sceneStatus').textContent=state.fatigue>70?'Нужна перезагрузка':state.energy<30?'Заряд на исходе':state.ap===0?'День прожит не зря':state.mood>75?'Готов к приключениям':'Спокойно движемся к цели';
  $('soundButton').innerHTML=icon(state.sound?'soundOn':'soundOff');$('soundButton').setAttribute('aria-label',state.sound?'Выключить звук':'Включить звук');$('soundButton').title=state.sound?'Выключить звук':'Включить звук';
  renderActions();const target=RACES[raceIndex(state)];
  $('raceName').textContent=target.name;$('raceDistances').innerHTML=['swim','bike','run'].map((x,i)=>`<span>${icon(x)} ${target.distances[i]}</span>`).join('');
  const days=Math.max(0,state.nextRaceDay-state.day);
  $('raceCountdown').innerHTML=days?`До старта <b>${days} ${days===1?'день':days<5?'дня':'дней'}</b>`:`<span>День старта</span><b>ТВОЙ МОМЕНТ</b>`;
  $('raceButton').innerHTML=(days?'Подготовка к старту':'На старт!')+icon('arrow');$('raceFootnote').textContent=days?'Твой следующий финиш ближе, чем кажется.':'Без спешки: старт подождёт, пока ты подготовишься.';
  $('skills').innerHTML=['swim','bike','run'].map((key,i)=>`<div class="skill-row ${['blue','orange','purple'][i]}">${icon(key)}<span>${TRAININGS[key].name}</span><div class="skill-track" role="meter" aria-label="Навык: ${TRAININGS[key].name}" aria-valuenow="${state.skills[key]}" aria-valuemin="0" aria-valuemax="100"><i style="width:${state.skills[key]}%;background:${['#8bc4d6','#e7b082','#baa7d0'][i]}"></i><span class="target-marker" style="left:${target.target}%" title="Рекомендуемая форма для ${target.short}: ${target.target}"></span></div><b>${state.skills[key]}</b></div>`).join('');
  $('dailyTasks').innerHTML=[['training','Сделать любую тренировку'],['meal','Хорошенько поесть'],['water','Не забыть про воду']].map(([k,t])=>`<div class="daily-task ${state.today[k]?'done':''}"><i>${state.today[k]?icon('check'):''}</i>${t}</div>`).join('');
  $('dailyReward').innerHTML=state.today.bonus?'Получено ✓':'+20 <span>✦</span>';
  $('journey').innerHTML=RACES.map((r,i)=>`<div class="milestone ${state.wins.includes(i)?'completed':raceIndex(state)===i?'current':''}">${icon(state.wins.includes(i)?'trophy':raceIndex(state)===i?'flag':'lock')}<div><strong>${r.short}</strong><small>${state.wins.includes(i)?'Финиш в копилке':raceIndex(state)===i?'Твоя следующая глава':'После предыдущего финиша'}</small></div><span class="step-number">0${i+1}</span></div>`).join('');
  document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
  $('actionContent').setAttribute('aria-labelledby','tab-'+tab);
}
function card({id,title,en,desc,ic,color,gain,cost,disabled='',buyItem=false,owned=false}){
  return `<button class="action-card ${color} ${owned?'owned':''}" ${buyItem?'data-buy':'data-action'}="${id}" ${disabled?'disabled':''} title="${esc(disabled||desc)}" aria-label="${esc(title+', '+desc+', '+cost)}"><span class="sport-icon">${icon(ic)}</span><span class="card-arrow">${icon(owned?'check':'arrow')}</span><h3>${title}</h3>${en?`<span class="card-english">${en}</span>`:''}<p class="action-description">${desc}</p><span class="card-bottom"><span class="gain">${gain}</span><span>${cost}</span></span></button>`;
}
function renderActions(){
  const locked=busy||!!race;
  if(tab==='train'){
    $('actionContent').innerHTML=`<div class="intensity-line"><span>Выбери свой ритм</span><div class="intensity-toggle" aria-label="Интенсивность"><button data-intensity="easy" class="${!intense?'selected':''}" aria-pressed="${!intense}">Легко · Easy</button><button data-intensity="hard" class="${intense?'selected':''}" aria-pressed="${intense}">Темпово · Hard</button></div></div><div class="action-cards">${Object.keys(TRAININGS).map((id,i)=>{const t=trainingPreview(state,id,intense);return card({id,title:t.name,en:t.english,desc:t.line,ic:id,color:['blue','orange','purple'][i],gain:`+${t.gain} ${t.english}`,cost:`−${t.energy} ⚡`,disabled:locked?'Атлет занят':canTrain(state,id,intense)});}).join('')}</div><p class="action-note">${icon('info')} Одна тренировка = одно дело. Темповая даёт больше прогресса и усталости.</p>`;
  }else if(tab==='care'){
    const noAp=state.ap===0?'Все дела закончились. Пора спать.':'';
    $('actionContent').innerHTML=`<div class="action-cards care-cards">${[
      {id:'meal',title:'Паста чемпиона',en:'Eat well',desc:'+42 сытости, +8 энергии',ic:'food',color:'orange',gain:'Бесплатно',cost:'1 дело',disabled:noAp|| (state.fuel>=96?'Атлет уже сыт':'')},
      {id:'water',title:'Наполнить флягу',en:'Stay hydrated',desc:'+45 воды · 3 фляги в день',ic:'drop',color:'blue',gain:'Бесплатно',cost:'0 дел',disabled:state.water>=95?'Воды достаточно':state.today.drinks>=3?'Три фляги уже выпиты':''},
      {id:'rest',title:'Восстановиться',en:'Recover',desc:'+22 энергии, −24 усталости',ic:'recovery',color:'purple',gain:'Бесплатно',cost:'1 дело',disabled:noAp},
      {id:'joy',title:'Прогулка за кофе',en:'Enjoy life',desc:'+30 настроения, +10 энергии',ic:'leaf',color:'green',gain:'Бесплатно',cost:'1 дело',disabled:noAp},
      {id:'dessert',title:'Клубный десерт',en:'A little treat',desc:'+20 настроения, +18 сытости, +5 энергии',ic:'cake',color:'orange',gain:'15 ✦',cost:'0 дел · 1 в день',disabled:state.today.dessert?'Десерт дня уже съеден':state.coins<15?'Нужно 15 крошек':''}
    ].map(x=>card({...x,disabled:locked?'Атлет занят':x.disabled})).join('')}</div><p class="action-note">${icon('heart')} Еда — топливо. Десерт — удовольствие. Отдых — по плану.</p>`;
  }else{
    $('actionContent').innerHTML=`<div class="action-cards shop-cards">${GEAR.map(g=>{const owned=state.gear.includes(g.id),kit=['sunset','violet'].includes(g.id);return card({id:g.id,title:g.name,desc:g.desc,ic:g.icon,color:g.color,gain:owned?(kit?(state.kit===g.id?'Надето':'Надеть'):'Куплено'):`${g.price} ✦`,cost:owned?'': 'Навсегда',buyItem:true,owned,disabled:locked?'Атлет занят':owned&&!kit?'Уже в твоём снаряжении':!owned&&state.coins<g.price?`Нужно ещё ${g.price-state.coins} крошек`:''});}).join('')}</div><p class="action-note">${icon('bag')} Крошки за тренировки, баланс дня и финиши. Все покупки — игровые.</p>`;
  }
}
function afterAction(result){
  if(!result.ok){toast(result.message);return;}
  busy=true;save();render();toast(result.message);scene.animate(result.animation||'celebrate',2700);beep(result.animation==='sleep'?'sleep':'action');
  const words={swim:'Я почти дельфин. Почти.',bike:'Кручу педали. Мечтаю о пасте.',run:'Круассан сам за мной не прибежит.',eat:'Вот ради чего мы и тренируемся!',drink:'Заправка прошла успешно.',rest:'Recover today. Stronger tomorrow.',walk:'Иногда лучший план — просто жить.',sleep:'Спокойной ночи. Увидимся утром.'};
  speak(words[result.animation]||'Маленькая победа в копилке.');
  if(result.badges?.length)scene.burst();
  setTimeout(()=>{busy=false;renderActions();},750);
}
function action(id){if(busy||race)return;afterAction(act(state,id,intense));}
function openModal(content,mode='',locked=false){modalMode=mode;modalLocked=locked;$('modalContent').innerHTML=content;if(!$('modal').open)$('modal').showModal();}
function modalShell(content,eyebrow='',close=true){return `<div class="modal-inner">${close?`<button class="modal-close" data-modal="close" aria-label="Закрыть">${icon('close')}</button>`:''}${eyebrow?`<div class="modal-eyebrow">${eyebrow}</div>`:''}${content}</div>`;}
function closeModal(){if(modalLocked)return;$('modal').close();modalMode='';}
function welcome(){openModal(modalShell(`<h2>Накорми своего<br>внутреннего триатлета.</h2><p>Добро пожаловать в «Съедобную атлетику»! Здесь есть место и большим финишам, и десерту после тренировки.</p><div class="welcome-illustration"><span>${icon('swim')}</span><span>${icon('bike')}</span><span>${icon('run')}</span></div><form id="welcomeForm"><label class="form-label" for="welcomeName">Как назовём твою булочку?</label><input id="welcomeName" class="name-input" maxlength="24" value="${esc(state.name)}" autocomplete="off"><button class="modal-primary" type="submit">Начать нашу историю ${icon('arrow')}</button></form><p class="modal-small">4 дела в день. Первый старт — на 7-й день.<br>Когда ты закрываешь игру, время останавливается.<br>У каждого игрока своё сохранение в браузере.</p>`,'СЪЕДОБНАЯ АТЛЕТИКА × TRIBUDDY'),'welcome');}
function help(){openModal(modalShell(`<h2>Забота. Движение.<br>И немного терпения.</h2><div class="rules-list">${[
 ['Планируй четыре дела','Тренировка, еда, восстановление и прогулка тратят по одному действию. Вода бесплатна: до трёх фляг в день.'],
 ['Следи за балансом','Energy — энергия, Fuel — сытость, Hydration — вода, Mood — настроение. Высокая усталость снижает прирост навыков.'],
 ['Спи и становись сильнее','Кнопка «Выспаться» завершает день. С едой и водой сон возвращает больше энергии. Пропущенные реальные дни не вредят атлету.'],
 ['Выходи на старт','Первый старт — на 7-й день. В гонке выбирай темп и используй один гель. Бережный темп экономит силы. После финиша открывается следующая дистанция.'],
 ['Собирай маленькие победы','За тренировки и гонки — крошки. За тренировку + еду + воду в один день — ещё 20. В магазине можно улучшить снаряжение и сменить костюм.']
 ].map(([h,p],i)=>`<div class="rule-item"><span class="rule-number">0${i+1}</span><div><b>${h}</b><p>${p}</p></div></div>`).join('')}</div><button class="modal-primary" data-modal="close">Понятно. Погнали! ${icon('arrow')}</button><p class="modal-small">Игровая модель: цифры и дистанции здесь служат механике игры.</p>`,'HOW TO PLAY'),'help');}
function rename(){openModal(modalShell(`<h2>Имя твоего атлета</h2><form id="renameForm"><label class="form-label" for="newName">Имя или прозвище</label><input class="name-input" id="newName" maxlength="24" value="${esc(state.name)}" autocomplete="off"><button class="modal-primary" type="submit">Сохранить ${icon('check')}</button></form>`,'YOUR ATHLETE'),'rename');setTimeout(()=>$('newName')?.select(),50);}
function settings(){openModal(modalShell(`<h2>Уютно, как тебе нравится.</h2><div class="setting-row"><span>Звуки игры</span><button class="toggle ${state.sound?'on':''}" data-setting="sound" role="switch" aria-checked="${state.sound}" aria-label="Звуки игры"><i></i></button></div><div class="setting-row"><span>Анимация атлета</span><button class="toggle ${state.motion?'on':''}" data-setting="motion" role="switch" aria-checked="${state.motion}" aria-label="Анимация атлета"><i></i></button></div><div class="setting-row"><span>Имя атлета</span><button class="text-button" data-modal="rename">${esc(state.name)} ${icon('edit')}</button></div><div class="setting-row"><span>Базовый костюм</span><button class="text-button" data-modal="mint">Надеть лаймовый ${icon('shirt')}</button></div><p class="modal-small">Прогресс автоматически сохраняется в этом браузере.<br>На другом устройстве будет отдельный атлет.</p><button class="modal-secondary" data-modal="help">Как играть · Правила клуба</button><button class="danger-link" data-modal="resetAsk">Начать историю заново</button>`,'MAKE YOURSELF AT HOME'),'settings');}
function askSleep(){if(busy||race)return;if(!state.ap){afterAction(sleep(state));return;}
  openModal(modalShell(`<h2>На сегодня хватит?</h2><p>Осталось дел: <b>${state.ap} из 4</b>. Можно завершить день сейчас — завтра снова будет четыре.</p><div class="coach-tip">${icon('moon')}<p>${state.fuel>=30&&state.water>=25?'Ты поел и попил. Сон хорошо восстановит энергию.':'Перед сном полезно поесть и попить: так восстановление будет лучше.'}</p></div><button class="modal-primary" data-modal="sleep">Да, выспаться ${icon('moon')}</button><button class="modal-secondary" data-modal="close">Ещё побуду в лагере</button>`,'REST IS PART OF THE PLAN'),'sleep');}
function racePrep(){const target=RACES[raceIndex(state)],ready=readiness(state),days=Math.max(0,state.nextRaceDay-state.day),error=raceEligibility(state);
  openModal(modalShell(`<h2>${target.name}</h2><p>${target.distances.join(' · ')}<br>Твой результат зависит от навыков, свежести и выбранного темпа.</p><div class="modal-summary"><div class="summary-chip"><small>ФОРМА · FITNESS</small><b>${fitness(state)} / 100</b></div><div class="summary-chip"><small>СВЕЖЕСТЬ · READINESS</small><b>${ready} / 100</b></div></div><div class="preparation-grid">${[
  [!days,days?`Старт в день ${state.nextRaceDay}. Осталось: ${days}`:'Старт открыт — можешь выходить'],
  [fitness(state)>=target.target,`Рекомендуемая средняя форма: ${target.target}. Твоя: ${fitness(state)}`],
  [state.energy>=60&&state.fuel>=60&&state.water>=60,'Желательно: энергия, сытость и вода от 60'],
  [state.fatigue<40,'Желательно: усталость ниже 40']
  ].map(([r,t])=>`<div class="preparation-item ${r?'ready':''}">${icon(r?'check':'info')}<span>${t}</span></div>`).join('')}</div>${days?'<p class="modal-small">Отмечай дни кнопкой «Выспаться». Реального ожидания нет.</p>':'<p class="modal-small">В гонке один гель. Выбирай темп с умом: быстрее — не всегда лучше.</p>'}<button class="modal-primary" data-modal="startRace" ${error?'disabled':''}>На старт ${icon('flag')}</button>${error?`<p class="modal-small">${error}</p>`:''}<button class="modal-secondary" data-modal="close">Вернуться в лагерь</button>`,'RACE DAY'),'prep');}
function renderRaceModal(){
  const target=RACES[race.index];openModal(modalShell(`<div class="race-live-head"><div class="modal-eyebrow">${target.tag}</div><h2>${target.short} · <span id="racePhaseName">Плавание</span></h2><p id="liveRaceMessage">Спокойно. Это твоя гонка.</p></div><div class="race-animation"><span class="race-athlete" id="raceAthlete">${icon('swim')}</span></div><div class="race-phase-chips" id="phaseChips"><span>01 · Плавание</span><span>02 · Велосипед</span><span>03 · Бег</span></div><div class="race-progress"><i id="raceProgress"></i></div><div class="race-live-stats"><span>Силы <b id="raceStamina">100%</b></span><span>Время <b id="raceClock">00:00:00</b></span></div><div class="pace-buttons" aria-label="Темп гонки"><button data-pace="easy">Бережно<small>Save energy</small></button><button data-pace="steady">Ровно<small>Steady pace</small></button><button data-pace="fast">На все деньги<small>Push harder</small></button></div><button class="gel-button" id="gelButton" data-modal="gel">✦ Выпить гель · +28 сил</button><div style="display:flex;justify-content:space-between;margin-top:12px"><button class="text-button" id="pauseButton" data-modal="pause">${icon('pause')} Пауза</button><button class="text-button" data-modal="withdraw">Сойти с дистанции</button></div><p class="modal-small">Игровое время ускорено. Гонка занимает около 30 секунд.</p>`,'',false),'race',true);updateRaceUI();
}
function updateRaceUI(){if(!race||modalMode!=='race')return;
  const phase=Math.min(2,Math.floor(race.progress/100));$('racePhaseName').textContent=['Плавание','Велосипед','Бег'][phase];$('raceAthlete').innerHTML=icon(['swim','bike','run'][phase]);$('raceProgress').style.width=race.progress/3+'%';$('raceStamina').textContent=Math.round(race.stamina)+'%';$('raceStamina').style.color=race.stamina<25?'#bd7a62':'';$('raceClock').textContent=formatTime(race.minutes);
  $('phaseChips').querySelectorAll('span').forEach((x,i)=>x.classList.toggle('active',i===phase));
  document.querySelectorAll('[data-pace]').forEach(b=>{b.classList.toggle('selected',b.dataset.pace===race.pace);b.setAttribute('aria-pressed',b.dataset.pace===race.pace);});
  $('gelButton').disabled=race.gel;$('gelButton').textContent=race.gel?'✓ Гель использован':'✦ Выпить гель · +28 сил';
  $('pauseButton').innerHTML=icon(racePaused?'play':'pause')+(racePaused?'Продолжить':'Пауза');
  $('liveRaceMessage').textContent=racePaused?'Пауза. Переведи дух.':race.stamina<25?'Сил мало. Снизь темп'+(!race.gel?' или используй гель.':'.'):['Найди свой ритм. Вдох. Гребок.','Ровные усилия. Длинная дорога.','Финиш уже ближе. Ты справишься.'][phase];
  $('raceAthlete').style.animationPlayState=racePaused?'paused':'running';
}
function startRace(resume=false){if(!resume){const r=beginRace(state);if(!r.ok){toast(r.message);return;}race=r;state.activeRace=race;save();}racePaused=false;renderRaceModal();
  let last=performance.now(),saveTick=0,previousPhase=-1;
  clearInterval(raceTimer);raceTimer=setInterval(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.25);last=now;if(racePaused||document.hidden||!race)return;
    tickRace(state,race,dt);saveTick+=dt;if(saveTick>1){save();saveTick=0;}
    const phase=Math.min(2,Math.floor(race.progress/100));if(phase!==previousPhase){scene.animate(['swim','bike','run'][phase],35000);previousPhase=phase;beep();}
    updateRaceUI();if(race.finished)endRace();
  },90);
}
function endRace(){clearInterval(raceTimer);raceTimer=null;const record=finishRace(state,race);if(!record)return;const target=RACES[race.index];delete state.activeRace;race=null;modalLocked=false;save();render();
  if(record.success){scene.animate('celebrate',5000);beep('win');speak('Я смог. Мы смогли!',6000);}else{scene.animate('rest',4000);speak('Отдохну — и вернусь сильнее.');}
  openModal(modalShell(`<div class="race-trophy">${icon(record.success?'trophy':'heart')}</div><div style="text-align:center"><div class="modal-eyebrow">${record.success?'YOU DID IT!':'COME BACK STRONGER'}</div><h2 style="margin-right:0">${record.success?'Ты — финишер!':'Сегодня победил опыт.'}</h2><p>${record.success?`${target.name} позади. Этот финиш уже никто не отнимет.`:'Силы закончились. Дай себе восстановиться и попробуй бережный темп.'}</p></div>${record.success?`<div class="result-time">${formatTime(record.minutes)}</div><div class="result-splits">${record.splits.map((t,i)=>`<div><span>${['Swim','Bike','Run'][i]}</span><b>${formatTime(t)}</b></div>`).join('')}</div>`:''}<div class="result-reward">+${record.reward} ✦ крошек · +${record.success?100:30} XP</div><button class="modal-primary" data-modal="shareResult">Рассказать своим ${icon('share')}</button><button class="modal-secondary" data-modal="close">Вернуться в лагерь</button><p class="modal-small">Следующий старт — в день ${state.nextRaceDay}. А сейчас — заслуженный сон.</p>`,'',true),'result');
}
function journal(){const names={first:'Первый шаг',triple:'Три стихии',finisher:'Финишер',half:'70.3 в сердце',iron:'Полная дистанция'};
  openModal(modalShell(`<h2>Твоя история в движении.</h2><div class="modal-summary"><div class="summary-chip"><small>ТРЕНИРОВОК</small><b>${Object.values(state.trainingCounts).reduce((a,b)=>a+b,0)}</b></div><div class="summary-chip"><small>ФИНИШЕЙ В ЖУРНАЛЕ</small><b>${state.raceHistory.filter(r=>r.success).length}</b></div><div class="summary-chip"><small>ДНЕЙ В ПУТИ</small><b>${state.day}</b></div></div>${state.badges.length?`<div class="badge-list">${state.badges.map(b=>`<span class="badge-item">✦ ${names[b]||esc(b)}</span>`).join('')}</div>`:''}${state.raceHistory.length?`<div class="journal-list">${state.raceHistory.slice(0,5).map(r=>`<div class="journal-row">${icon('trophy')}<div><small>ДЕНЬ ${r.day} · ${esc(r.race)}</small><p>${r.success?`Финиш · ${formatTime(r.minutes)}`:'Сход с дистанции'}</p></div></div>`).join('')}</div>`:''}<div class="journal-list">${state.log.slice(0,20).map(l=>`<div class="journal-row">${icon(l.icon)}<div><small>ДЕНЬ ${l.day}</small><p>${esc(l.text)}</p></div></div>`).join('')}</div>`,'THE LITTLE WINS MATTER'),'journal');}
async function shareGame(withResult=false){
  const last=state.raceHistory[0];
  const text=withResult&&last?.success?`Мой атлет ${state.name} прошёл ${last.race} за ${formatTime(last.minutes)}! Съедобная атлетика: есть, тренить, повторить. Вырастишь своего?`:'Съедобная атлетика: триатлет на подкормке. Есть, тренить, повторить! Вырасти своего чемпиона — от спринта за круассаном до 226 км.';
  const url=location.origin+'/';
  if(navigator.share){try{await navigator.share({title:'Съедобная атлетика',text,url});return;}catch(e){if(e.name==='AbortError')return;}}
  try{await navigator.clipboard.writeText(text+'\n'+url);toast('Текст и ссылка скопированы. Отправь своим!');}
  catch(e){openModal(modalShell(`<h2>Позови своих!</h2><p>${esc(text)}</p><label class="form-label" for="shareLink">Ссылка на игру</label><input id="shareLink" class="name-input" value="${esc(url)}" readonly><p class="modal-small">Нажми на ссылку, скопируй и отправь друзьям.</p>`,'БОЛЬШЕ АТЛЕТОВ — БОЛЬШЕ АППЕТИТА'),'share');$('shareLink').onclick=()=>$('shareLink').select();}
}
// Static controls and delegated controls for panels that update after each turn.
$('helpButton').onclick=help;$('settingsButton').onclick=settings;$('renameButton').onclick=rename;$('sleepButton').onclick=askSleep;$('raceButton').onclick=racePrep;$('journalButton').onclick=journal;
$('shareButton').onclick=()=>shareGame();$('inviteButton').onclick=()=>shareGame();
$('soundButton').onclick=()=>{state.sound=!state.sound;save();render();if(state.sound)beep();toast(state.sound?'Звуки включены':'Звуки выключены');};
$('petButton').onclick=()=>{if(busy||race)return;const now=Date.now();if(now-lastPet<1500)return;lastPet=now;scene.animate('celebrate',1800);beep();speak(['Съедобная атлетика — это по любви!','Разминаюсь между приёмами пищи.','Finish line — финишная черта. За ней кормят!','Я не батон. Я углеводный резерв.'][Math.floor(Math.random()*4)]);};
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.nav){
    document.querySelectorAll('[data-nav]').forEach(n=>n.classList.toggle('selected',n===b));
    const motion=state.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(b.dataset.nav==='camp')window.scrollTo({top:0,behavior:motion?'smooth':'instant'});
    else if(b.dataset.nav==='race')racePrep();
    else{tab=b.dataset.nav;render();$('actionsPanel').scrollIntoView({behavior:motion?'smooth':'instant',block:'start'});}
  }
  if(b.dataset.tab){tab=b.dataset.tab;render();}
  if(b.dataset.intensity){intense=b.dataset.intensity==='hard';renderActions();}
  if(b.dataset.action)action(b.dataset.action);
  if(b.dataset.buy){const r=buy(state,b.dataset.buy);toast(r.message);if(r.ok){save();render();scene.animate('celebrate');beep();}}
  if(b.dataset.setting){state[b.dataset.setting]=!state[b.dataset.setting];save();render();settings();if(b.dataset.setting==='sound')beep();}
  if(b.dataset.pace&&race){race.pace=b.dataset.pace;save();updateRaceUI();}
  const m=b.dataset.modal;
  if(m==='close'){if(modalMode==='welcome'){state.welcomed=true;save();}closeModal();}
  if(m==='rename')rename();
  if(m==='mint'){state.kit='mint';save();toast('Базовый костюм снова на тебе.');}
  if(m==='sleep'){closeModal();afterAction(sleep(state));}
  if(m==='startRace')startRace();
  if(m==='gel'&&race){if(useGel(race)){save();updateRaceUI();beep();}}
  if(m==='pause'&&race){racePaused=!racePaused;updateRaceUI();}
  if(m==='withdraw'&&race){racePaused=true;openModal(modalShell(`<h2>Завершить этот старт?</h2><p>В дневнике останется сход с дистанции. Ты получишь 35 крошек за опыт и сможешь попробовать снова через три игровых дня.</p><button class="modal-primary" data-modal="withdrawConfirm">Да, вернуться в лагерь</button><button class="modal-secondary" data-modal="resumeRace">Продолжить гонку</button>`,'LISTEN TO YOURSELF',false),'withdraw',true);}
  if(m==='resumeRace'&&race){racePaused=false;renderRaceModal();}
  if(m==='withdrawConfirm'&&race){race.finished=true;race.success=false;endRace();}
  if(m==='resetAsk')openModal(modalShell(`<h2>Начать с чистого листа?</h2><p>Навыки, покупки, крошки и история стартов этого атлета будут удалены. Отменить это действие не получится.</p><button class="modal-primary" data-modal="resetConfirm">Начать новую историю</button><button class="modal-secondary" data-modal="settings">Сохранить мой прогресс</button>`,'A NEW CHAPTER'),'reset');
  if(m==='resetConfirm'){const name=state.name;state=createGame(name);state.welcomed=true;closeModal();tab='train';intense=false;save();render();speak('Новая история. Большие мечты.');toast('Новая история началась.');}
  if(m==='settings')settings();
  if(m==='help')help();
  if(m==='shareResult')shareGame(true);
});
document.addEventListener('submit',e=>{if(e.target.id==='welcomeForm'||e.target.id==='renameForm'){e.preventDefault();const welcomeForm=e.target.id==='welcomeForm';state.name=($(welcomeForm?'welcomeName':'newName').value.trim().slice(0,24)||'Батон');state.welcomed=true;save();render();closeModal();if(welcomeForm){scene.animate('celebrate');speak('Сначала разгоняем батон. Потом обед?');}}});
document.querySelector('.tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const names=['train','care','shop'];let i=names.indexOf(tab);i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;tab=names[i];render();$('tab-'+tab).focus();});
$('modal').addEventListener('cancel',e=>{if(modalLocked){e.preventDefault();racePaused=true;if(modalMode==='withdraw')renderRaceModal();updateRaceUI();}else if(modalMode==='welcome'){state.welcomed=true;save();}});
$('modal').addEventListener('click',e=>{if(e.target===$('modal')&&!modalLocked){const rect=$('modal').getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeModal();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});window.addEventListener('pagehide',save);
icons();render();save();$('speech').textContent=idleSpeech();
if(state.activeRace&&typeof state.activeRace.progress==='number'&&state.activeRace.index>=0&&state.activeRace.index<4){race=state.activeRace;if(race.finished&&!race.recorded)setTimeout(endRace,250);else if(!race.finished)setTimeout(()=>startRace(true),250);else{delete state.activeRace;race=null;save();}}
else if(!state.welcomed)setTimeout(welcome,400);
if(hadCorruptSave)setTimeout(()=>toast('Начинаем с нового атлета: сохранение не удалось прочитать.'),1200);
