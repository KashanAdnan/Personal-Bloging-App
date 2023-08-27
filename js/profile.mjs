import { auth, db, storage } from "../firebase/config.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"
import { addDoc, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js"

onAuthStateChanged(auth, (user) => {
    if (user) {
        UserLoggedIn(user)
    } else {
        window.location.href ="../../index.html"
    }
})

async function UserLoggedIn(user) {
    getDownloadURL(ref(storage, user.email))
        .then(async (url) => {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                showUserData(doc.data().first_name, doc.data().last_name);
            })
        })
        .catch((error) => {
        });
}

async function showUserData(first,last) {
    const links = document.querySelector(".links");
    links.innerHTML = `
            <li>
                <a href="./pages/profile/profile.html">${first} ${last}</a>
                <a onclick="logoutUser()">Logout</a>
            </li>
    `
}

window.logoutUser = () => {
    signOut(auth).then(() => {
        window.location.reload()
    }).catch((error) => {
    });
}

