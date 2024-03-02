let userValues = []

function collectData(formClass){
  return document.querySelector(formClass).value; 
}

function getdata(Event){
  Event.preventDefault()
  for(let i = 0; i <= 8; i++){
    userInput = collectData(`.js-${i}-form`);
   
    if (userInput == null){
      userValues[i] = 'N/A'
    } else {
      userValues[i] = userInput;
      console.log(userValues)
    }

  }

}