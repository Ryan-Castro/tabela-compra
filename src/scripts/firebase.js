const firebaseConfig = {
    apiKey: "AIzaSyAunSOidGayGgkLZ0VgxX6QSbSE_01Qp14",
    authDomain: "tabela-valente.firebaseapp.com",
    projectId: "tabela-valente",
    storageBucket: "tabela-valente.appspot.com",
    messagingSenderId: "110126552189",
    appId: "1:110126552189:web:1df81a03c0a7c0e6a24d14"
  };
  
const app = firebase.initializeApp(firebaseConfig);
let db = app.firestore()

function $(item){
  return document.querySelector(item)
}

