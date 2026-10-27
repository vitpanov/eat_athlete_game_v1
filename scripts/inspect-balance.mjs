// A diagnostic reproduction, NOT an acceptance test for future balancing.
import {createGame,beginRace,tickRace,useGel,RACES} from '../dist/game.js';
const results = [];
for (let index = 0; index < RACES.length; index++) {
  const state = createGame();
  state.day = 7;
  state.wins = Array.from({length:index}, (_, i) => i);
  Object.assign(state, {energy:100,fuel:100,water:100,mood:100,fatigue:0});
  const race = beginRace(state);race.pace = 'easy';
  for (let i = 0; i < 2000 && !race.finished; i++) {if (race.stamina < 50) useGel(race);tickRace(state,race,.1);}
  results.push({race:RACES[index].short,fitness:state.skills,success:race.success,remainingStamina:Math.round(race.stamina)});
}
console.log(JSON.stringify(results,null,2));
console.log('Baseline issue: a fully recovered athlete can finish all distances with starting skills. See docs/KNOWN_ISSUES.md.');
