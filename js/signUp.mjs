import { auth, db, storage } from "../firebase/config.mjs"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"

const form = document.querySelector(".login-form-container");

async function register(e) {
    e.preventDefault()
    const fname = document.querySelector("#fname")
    const lname = document.querySelector("#lname")
    const password = document.querySelector("#password")
    const rpassword = document.querySelector("#rpassword")
    const email = document.querySelector("#email")
    console.log(email.value);
    const data = await createUserWithEmailAndPassword(auth,
        email.value,
        password.value
    );
    if (data) {
        let storingData = {
            first_name: fname.value,
            last_name: lname.value,
            email: email.value,
            password: password.value,
            rpassword: rpassword.value,
            uid: data.uid
        }
        try {
            const docRef = await addDoc(collection(db, "users"), {
                ...storingData
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        console.log(data);
    }
}

form.addEventListener('submit', register)