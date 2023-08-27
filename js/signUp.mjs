import { auth, db, storage } from "../firebase/config.mjs"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js"

const form = document.querySelector(".login-form-container");

async function register(e) {
    e.preventDefault()
    const fname = document.querySelector("#fname")
    const lname = document.querySelector("#lname")
    const password = document.querySelector("#password")
    const rpassword = document.querySelector("#rpassword")
    const email = document.querySelector("#email")
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
            uid: data.user.uid
        }
        try {
            const docRef = await addDoc(collection(db, "users"), {
                ...storingData
            });
            const storageRef = ref(storage, email.value);
            const file = document.getElementById("file").files[0]
            uploadBytes(storageRef, file).then((snapshot) => {
                swal("Good job!", "SignUp Succesful!", "success").then((res) => {
                    window.location.href = "../../index.html"
                }).catch((err) => {

                })
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    } else {
        console.log(data);
        swal("Oops", "Email And Password is Wrong!", "error")
    }
}

form.addEventListener('submit', register)