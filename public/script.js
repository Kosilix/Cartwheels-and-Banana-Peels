let userValues = [];
let userTempName = ''
let usersName = '';
let blogValue = '';
let blogLength = 0;
let tempLength = 0;


function logIn(){
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;

    let token = credential.accessToken;
    user = result.user;
  }).catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
  });
  const user = firebase.auth().currentUser;
  setTimeout(function(){
    printUser();
    initializeUser();
  }, 800);
}

async function printUser(){
  user = firebase.auth().currentUser;

  if (user !== null) {
    user.providerData.forEach((profile) => {
      console.log("Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);
      console.log("  Photo URL: " + profile.photoURL);
    });
  } else if (user == null){
    document.querySelector('.centered-button').innerHTML = `Failure to validate login, Try again.`;
  }
}

function initializeUser(){
    user.providerData.forEach((profile) => {
      document.querySelector('.centered-button').innerHTML = `Welcome, ${profile.displayName}`;
    });
}

function initializeBlog(){
  const db = firebase.firestore();
  db.collection('blogPosts').get().then(res => res.size);
  blogLength = waitForSize();

  db.collection("blogPosts").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    });
  });
}

const snapshotToArray = snapshot => {
  const ret = [];
  snapshot.forEach(childSnapshot => {
      ret.push(childSnapshot);
  });
  return ret;
};

async function waitForSize(){
  const db = firebase.firestore();
  db.collection("blogPosts").get().then((querySnapshot) => {
    snapshotToArray(querySnapshot).reverse().forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        docFields = doc.data();
        console.log(doc.id, " => ", doc.data());
        document.querySelector(".blog-row").innerHTML += docFields.html;

        let storage = firebase.storage();
        let pathReference = storage.ref('BlogPhotos/');
        let blogHeader = docFields.imageName
        pathReference.child(`${blogHeader}.png`).getDownloadURL()
        .then((url) => {
          let img = document.getElementById(blogHeader);
          img.setAttribute('src', url);
          console.log(blogHeader);
        
    });
  });
});

  blogLength = await db.collection('blogPosts').get().then(res => res.size);
  
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
  document.querySelector(".js-submit")
  .innerHTML =`
  <div class="submitted">
    <h4 class="submitted-text">Submitted!</h4>
  </div>
  `
}

function postBlog(){
  const db = firebase.firestore();
  createImage(`blog-image-${blogLength}`)
  db.collection("blogPosts").doc(`blog-post-${blogLength}`).set({
    html: `
    <div class="blog-container">
      <div class="blog-content">
        <img class="blog-image" height="300px" width="300px" src="EMPTY" id="blog-image-${blogLength}">
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
    </div>`,
    imageName: `blog-image-${blogLength}`
  });
  blogLength++;
  document.querySelector(".js-submit")
  .innerHTML =`
  <div class="submitted">
    <h4 class="submitted-text">Uploaded!</h4>
  </div>
  `

}

function createImage(imageName){
  const storageRef = firebase.storage().ref();
  let imageRef = storageRef.child(`${imageName}.png`);
  let imagePathRef = storageRef.child(`BlogPhotos/${imageName}.png`);
  imagePathRef.put(new File([document.getElementById('blog-image').files[0]], imageRef)).then((snapshot) => {
    return imageName;
  });
}