import { db, storage } from "../firebase/config.mjs";
import { collection, query, where, getDocs, } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js"

const uid = localStorage.getItem("uid")

async function showUserBlogs(uid) {
    document.querySelector(".blogs-container").innerHTML = ""
    const q = query(collection(db, "blogs"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            getDownloadURL(ref(storage, userDoc.data().email)).then((url) => {
                document.querySelector(".blogs-container").innerHTML += `
                <div class="blog">
                    <div class="user-information">
                        <div class="user-img">
                            <img src="${url}" alt="">
                        </div>
                        <div class="user-name">
                        <h1>${doc.data().blog_title}</h1>
                        <p>${userDoc.data().first_name} ${userDoc.data().last_name} - ${doc.data().date} </p>
                        </div>
                        </div>
                        <p class="blog-desc">${doc.data().blog_desc}</p>
                        </div>
                        `
            }).catch((err) => {
                console.log(err);
            })
        });
    })
}

async function showUserProfile(uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        getDownloadURL(ref(storage, doc.data().email)).then((url) => {
            document.querySelector("#show-email").innerHTML = doc.data().email;
            document.querySelector("#show-name").innerHTML = `${doc.data().first_name} ${doc.data().last_name}`;
            document.querySelector("#name").innerHTML = `${doc.data().first_name} ${doc.data().last_name}`;
            document.querySelector("#show-image").src = url
        })
    })
}

function handleAllFunctions(uid) {
    showUserBlogs(uid)
    showUserProfile(uid)
}

handleAllFunctions(uid)