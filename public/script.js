document.addEventListener("DOMContentLoaded", event => {

  const app = firebase.app();
  
  const db = firebase.firestore();

});

let userValues = []
let usersName = ''

function collectData(formClass){
  return document.querySelector(formClass).value; 
}

function sendApplication(){
  const db = firebase.firestore();
  db.collection("Applications").doc(`${document.querySelector(".js-0-form").value}-${document.querySelector(".js-1-form").value}`).set({
    firstName: `${document.querySelector('.js-0-form').value}`,
    lastName: `${document.querySelector('.js-1-form').value}`,
    email: `${document.querySelector('.js-2-form').value}`,
    website: `${document.querySelector('.js-3-form').value}`,
    headshot: `${document.querySelector('.js-4-form').value}`,
    socials: `${document.querySelector('.js-5-form').value}`,
    title: `${document.querySelector('.js-6-form').value}`,
    story: `${document.querySelector('.js-7-form').value}`,
    extraStory: `${document.querySelector('.js-8-form').value}`
  })
}