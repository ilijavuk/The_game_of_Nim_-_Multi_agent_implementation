var NimAgent = require('./NimAgent');
 
let currState = [1, 3, 5, 7];

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

console.log("Početno stanje:");
drawCurrState(currState);

var agent1 = new NimAgent('agent1', 1);
var agent2 = new NimAgent('agent2', 0);
 
agent2.send('agent1', {state: currState});
