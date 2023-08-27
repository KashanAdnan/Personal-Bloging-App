import { auth, db, storage } from "../firebase/config.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js"
import { addDoc, collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js"

onAuthStateChanged(auth, (user) => {
    if (user) {
        UserLoggedIn(user)
    } else {
        UserLoggedOut()
    }
})

async function UserLoggedOut() {
    showAllBlogs()
}

async function UserLoggedIn(user) {
    getDownloadURL(ref(storage, user.email))
        .then(async (url) => {
            const blog_auth = document.querySelector(".blog-auth");
            blog_auth.innerHTML = "My Blogs"
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                showUserDashboard(user.uid, url, doc.data().first_name, doc.data().last_name);
                showMyBlogs(user.uid, url, doc.data().first_name, doc.data().last_name, doc.data().email)
            })
        })
        .catch((error) => {
        });
}

async function showUserDashboard(uid, url, first, last) {
    document.querySelector(".top").innerHTML = `
    <div class="dashboard">
    <input type="text" id="blog-title" placeholder="Placeholder">
    <textarea name="blog-desc" id="blog-desc" placeholder="What is in your mind?"></textarea>
    <button id="publish-blog">Publish Blog</button>
    </div>
    `
    document.querySelector("#publish-blog").addEventListener("click", async () => {
        const blog_title = document.querySelector("#blog-title")
        const blog_desc = document.querySelector("#blog-desc")
        const date = new Date()
        const months = [
            "Januray",
            "Feburary",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
        let storingData = {
            uid,
            blog_title: blog_title.value,
            blog_desc: blog_desc.value,
            date: `${date.getDate()}th  ${months[date.getMonth()]}, ${date.getFullYear()}`
        }
        try {
            const docRef = await addDoc(collection(db, "blogs"), {
                ...storingData
            });
            swal("Good job!", "Blog Published!", "success")
            blog_desc.value = ""
            blog_title.value = ""
            showMyBlogs(uid, url, first, last)
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    })
    const links = document.querySelector(".links");
    links.innerHTML = `
            <li>
                <a href="./pages/profile/profile.html">${first} ${last}</a>
                <a onclick="logoutUser()">Logout</a>
            </li>
    `
}

async function showMyBlogs(uid, url, fname, lname) {
    document.querySelector(".blogs-container").innerHTML = ""
    const q = query(collection(db, "blogs"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

        document.querySelector(".blogs-container").innerHTML += `
    <div class="blog" id="${doc.id}">
                    <div class="user-information">
                        <div class="user-img">
                            <img src="${url}" alt="">
                        </div>
                        <div class="user-name">
                            <h1>${doc.data().blog_title}</h1>
                            <p>${fname} ${lname} - ${doc.data().date} </p>
                            </div>
                            </div>
                            <p class="blog-desc">${doc.data().blog_desc}</p>
                         <a class="d-e-btn" onclick="deleteBlog('${doc.id}','${uid}','${fname}','${lname}','${url}')">Delete</a>
                         <a class="d-e-btn" onclick="updateBlog( '${doc.id}','${uid}','${fname}','${lname}','${url}','${doc.data().blog_title}','${doc.data().blog_desc}','${doc.data().date}')">Update</a>
                            </div>
                            `
    });
}

async function showAllBlogs() {
    document.querySelector(".blogs-container").innerHTML = ""
    const q = query(collection(db, "blogs"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        const q = query(collection(db, "users"), where("uid", "==", doc.data().uid));
        const users = await getDocs(q);
        users.forEach((userDoc) => {
            getDownloadURL(ref(storage, userDoc.data().email))
                .then(async (url) => {
                    document.querySelector(".blogs-container").innerHTML += `
            <div class="blog" id="${doc.id}">
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
                                 <a onclick="redirect('${userDoc.data().uid}')">see all from this user</a>
                                    </div>
                                    `
                })
        })
    })
}

window.logoutUser = () => {
    signOut(auth).then(() => {
        window.location.reload()
    }).catch((error) => {
    });
}

window.deleteBlog = async (id, uid, fname, lname, url) => {
    await deleteDoc(doc(db, "blogs", id));
    showMyBlogs(uid, url, fname, lname)
}

window.updateBlog = async (id, uid, name, lname, url, tt, desc, dt) => {
    const element = document.getElementById(`${id}`);
    element.innerHTML = `
    <div class="user-information">
    <div class="user-img">
        <img src="${url}" alt="">
    </div>
    <div class="user-name">
        <input id="${id}-title" value="${tt}"/>
        <p>${name} ${lname} - ${dt} </p>
        </div>
        </div>
        <textarea id="${id}-desc">${desc}</textarea>
     <button class="e-btn" onclick="updateBlogText('${id}', '${uid}', '${name}' ,  '${lname}' , '${url}')">Update</button>
    `
}

window.updateBlogText = async (id, uid, fname, lname, url) => {
    const title = document.getElementById(`${id}-title`).value;
    const desc = document.getElementById(`${id}-desc`).value;
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, {
        blog_title: title,
        blog_desc: desc
    });
    swal("Good job!", "Blog Updated!", "success").then(() => {
        showMyBlogs(uid, url, fname, lname)
    }).catch((err) => {

    })
}

window.redirect = (uid) => {
    localStorage.setItem("uid", uid)
    window.location.href = "../pages/details/details.html"
}