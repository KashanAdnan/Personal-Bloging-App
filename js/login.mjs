import { auth } from "../firebase/config.mjs"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"

const form = document.querySelector(".login-form-container");

async function login(e) {
    e.preventDefault()
    const email = document.querySelector("#email")
    const password = document.querySelector("#password")
    const data = await signInWithEmailAndPassword(auth, email.value,
        password.value);
    if (data) {
        swal("Good job!", "Login Successfull!", "success").then((res) => {
            window.location.href = "../../index.html"
        }).catch((err) => {

        })
    } else {
        swal("Oops", "Email And Password is Wrong!", "error")
        console.log(data);
    }
}

form.addEventListener('submit', login)