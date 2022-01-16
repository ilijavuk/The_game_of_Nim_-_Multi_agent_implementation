var eve = require('evejs');
 
let alg = 0;
function NimAgent(id, algoritam) {
  console.log(`${id}: Pokrećem se s ${algoritam ? 'pravim' : 'random'} algoritmom`);
  eve.Agent.call(this, id);
  alg = algoritam;
  this.connect(eve.system.transports.getAll());
}
 
NimAgent.prototype = Object.create(eve.Agent.prototype);
NimAgent.prototype.constructor = NimAgent;
 
const drawCurrState = (state) => {
  let currIndex = 0;
  state.forEach(row => {
    let out = "";
    for(var i = currIndex; i < 4; i++) {
      out += " ";
    }
    for(var i = 0; i < row; i++) {
      out += "I";
    }
    console.log(out);
    currIndex++;
  });
  console.log("");
}

function resolveAfterDelay() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}

async function randomAlg (currState, sender) {
  await resolveAfterDelay();
  let row;
  do {
    row = Math.floor(Math.random() * currState.length);
  } while (currState[row] == 0);
  const count = Math.floor((Math.random() * currState[row])+1);

  console.log(`${this.id}: Vučem ${count} iz ${row+1}. reda`);
  currState[row] -= count;

  drawCurrState(currState);
  
  if(!currState.find(el => el != 0)) {
    console.log(`${this.id}: Izgubio sam!`);                            
  }

  await resolveAfterDelay();
  this.send(sender, {state: currState});
}

async function praviAlg (currState, sender) {
  var currState_xor = currState.reduce((r, e) => r ^ e, 0);
  var is_endgame = currState.reduce((r, e) => r + (e > 1), 0) < 2;
  var move = currState.reduce((move, stack, i) => {
    var take = stack - (is_endgame ^ stack ^ currState_xor);
    return take > move[1] ? [i, take] : move;
  }, [0, 0]);
  if(move[1] > 0) {
    await resolveAfterDelay();
    currState[move[0]] -= move[1];
    await resolveAfterDelay();
    this.send(sender, {state: currState});
  } else {
    console.log(`${this.id}: Ne znam optimalni potez, izvlačim nasumično`);
    randomAlg(currState, sender);
  }
}

NimAgent.prototype.sayHello = function(to) {
  this.send(to, 'Hello ' + to + '!');
};
 
NimAgent.prototype.receive = function(sender, message) {
  if(!message.state.find(el => el != 0)) {
    console.log(`${this.id}: Pobijedio sam!`);
  }
  if(alg) {
    praviAlg.call(this, message.state, sender);
  } else {
    randomAlg.call(this, message.state, sender);
  }
};
 
module.exports = NimAgent;