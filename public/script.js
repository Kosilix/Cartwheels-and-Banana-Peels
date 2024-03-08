// Server side bullshit
// const fs = require('fs'); 

let userValues = []
let usersName = ''

function collectData(formClass){
  return document.querySelector(formClass).value; 
}

function saveData(Event){
  Event.preventDefault()
  for(let i = 0; i <= 8; i++){
    userInput = collectData(`.js-${i}-form`);
   
    if (userInput == ''){
      userValues[i] = 'N/A'
    } else if(i === 0){
      usersName = userInput
      userValues[i] = userInput;
      console.log(userValues);
    } else {
      userValues[i] = userInput;
      console.log(userValues);
    }

  }

  // saveArrayToFile(`${usersName}-Application`, userValues);
}

// Server side bullshit
// function saveArrayToFile(arrayName, array) {
//   fs.writeFileSync(`/Applications/${arrayName}`, `${JSON.stringify(array)}`);
// }