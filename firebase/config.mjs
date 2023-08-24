import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIcMy05yIDjlG2qjbyyBpJiPtWYEOplyg",
    authDomain: "personal-blogging-app-3e02b.firebaseapp.com",
    projectId: "personal-blogging-app-3e02b",
    storageBucket: "personal-blogging-app-3e02b.appspot.com",
    messagingSenderId: "991309477757",
    appId: "1:991309477757:web:ac8e030da419703ac9be14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }