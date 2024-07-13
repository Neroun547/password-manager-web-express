import { createPasswordItem } from "./create-password-item.js";

const createPasswordForm = document.getElementById("create-password-form");
const wrapperResponseMessage = document.querySelector(".wrapper__response-message");
const wrapperPasswords = document.querySelector(".wrapper__passwords");
const deletePasswordItemsBtn = document.querySelectorAll(".wrapper__passwords-item-delete-btn");

for(let i = 0; i < deletePasswordItemsBtn.length; i++) {
    deletePasswordItemsBtn[i].addEventListener("click", async () => {
        await fetch("/passwords/" + deletePasswordItemsBtn[i].parentElement.getAttribute("id"), {
            method: "DELETE"
        });
        deletePasswordItemsBtn[i].parentElement.remove();
    });
}

createPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = await fetch("/passwords/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description: e.target[0].value,
            password: e.target[1].value
        })
    });
    const response = await api.json();

    wrapperPasswords.appendChild(createPasswordItem(e.target[0].value, e.target[1].value, response.id));

    if(api.ok) {
        wrapperResponseMessage.innerHTML = "<span>" + response.message + "</span>";
        wrapperResponseMessage.style.backgroundColor = "#378019F9";
        wrapperResponseMessage.style.display = "block";

        const timeout = setTimeout(() => {
            wrapperResponseMessage.style.display = "none";
            clearTimeout(timeout);
        }, 3000);
    } else {
        wrapperResponseMessage.innerHTML = "<span>" + response.message + "</span>";
        wrapperResponseMessage.style.backgroundColor = "#801919F9";
        wrapperResponseMessage.style.display = "block";

        const timeout = setTimeout(() => {
            wrapperResponseMessage.style.display = "none";
            clearTimeout(timeout);
        }, 3000);
    }
});
