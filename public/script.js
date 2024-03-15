document.addEventListener("DOMContentLoaded", event => {

  const app = firebase.app();
  
  const db = firebase.firestore();

});

let userValues = [];
let usersName = '';
let blogValue = '';
let blogLength = 0;
let tempLength = 0;

function logIn(){
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;

    let token = credential.accessToken;
    let user = result.user;
  }).catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
  });
  const user = firebase.auth().currentUser;
}

function printUser(){

  const user = firebase.auth().currentUser;
  if (user !== null) {
    user.providerData.forEach((profile) => {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });
  }
}

function initializeBlog(){
  const db = firebase.firestore();
  db.collection('blogPosts').get().then(res => res.size);
  blogLength = waitForSize();

  db.collection("blogPosts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  });
}


async function waitForSize(){
  const db = firebase.firestore();
  blogLength = await db.collection('blogPosts').get().then(res => res.size);
  for(i = 0; i < blogLength; i++){
    let blogRef = db.collection("blogPosts").doc(`blog-post-${i}`);
    blogRef.get().then((doc) => {
    data = doc.data();
    blogValue = data.html;
    document.querySelector(".blog-row").innerHTML += blogValue;

    let storage = firebase.storage();
    let pathReference = storage.ref('BlogPhotos/');
    let blogHeader = document.getElementById(`blog-post-${tempLength}`).innerText;
    console.log(blogHeader);
    tempLength += 1
    pathReference.child(`${blogHeader}.png`).getDownloadURL()
    .then((url) => {
      console.log(url)
      let img = document.getElementById(blogHeader);
      img.setAttribute('src', url);
    });
  
  });
}
}

function collectData(formClass){
  return document.querySelector(formClass).value; 
}

function sendApplication(){
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();
  let imageRef = storageRef.child(`${document.querySelector('.js-0-form').value}-${document.querySelector('.js-1-form').value}.png`);
  let imagePathRef = storageRef.child(`Photos/${document.querySelector('.js-0-form').value}-${document.querySelector('.js-1-form').value}.png`);

  imagePathRef.put(new File([document.getElementById('head-shot').files[0]], imageRef)).then((snapshot) => {
    console.log('Uploaded a file!');
  });

  db.collection("Applications").doc(`${document.querySelector(".js-0-form").value}-${document.querySelector(".js-1-form").value}`).set({
    firstName: `${document.querySelector('.js-0-form').value}`,
    lastName: `${document.querySelector('.js-1-form').value}`,
    email: `${document.querySelector('.js-2-form').value}`,
    website: `${document.querySelector('.js-3-form').value}`,
    socials: `${document.querySelector('.js-5-form').value}`,
    title: `${document.querySelector('.js-6-form').value}`,
    story: `${document.querySelector('.js-7-form').value}`,
    extraStory: `${document.querySelector('.js-8-form').value}`
  })
}

setTimeout(() => {
  initializeBlog()
}, 100)

function postBlog(){
  const db = firebase.firestore();
  createImage()
  db.collection("blogPosts").doc(`blog-post-${blogLength}`).set({
    html: `
    <div class="blog-container">
      <div class="blog-content">
        <img class="blog-image" height="300px" width="300px" src="EMPTY" id="${document.querySelector('.input-t').value}">
      <div>
        ${document.querySelector('.input-a').value}
      </div>
      <div class="blog-description-header">
        <h3 id="blog-post-${blogLength}">${document.querySelector('.input-t').value}</h3>
      </div>
        <div class="blog-description">
        <p>${document.querySelector('.input-d').value}</p>
        </div>
      </div>
    </div>`
  });
  console.log('succees');
  console.log(db.collection("blogPosts"));
  blogLength++;

}

function createImage(){
  const storageRef = firebase.storage().ref();
  let imageName = document.querySelector('.input-t').value
  let imageRef = storageRef.child(`${imageName}.png`);
  let imagePathRef = storageRef.child(`BlogPhotos/${imageName}.png`);
  imagePathRef.put(new File([document.getElementById('blog-image').files[0]], imageRef)).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    return imageName;
  });
}
