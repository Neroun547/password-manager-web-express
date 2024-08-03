const createPasswordForm = document.getElementById("create-password-form");
const wrapperResponseMessage = document.querySelector(".wrapper__response-message");
const wrapperPasswords = document.querySelector(".wrapper__passwords");
const deletePasswordItemsBtn = document.querySelectorAll(".wrapper__passwords-item-delete-btn");
const editPasswordItemsBtn = document.querySelectorAll(".wrapper__passwords-item-edit-password-button");
const loadMoreBtn = document.querySelector(".load-more-btn");
const editPasswordItemsForm = document.querySelectorAll(".wrapper__passwords-item-edit-password-form");

let loadMoreSkip = 10;

function createPasswordItem(description, password, id) {
    const wrapperItem = document.createElement('div');
    wrapperItem.classList.add('wrapper__passwords-item');

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = `Призначення: ${description}`;
    descriptionSpan.classList.add("wrapper__passwords-item-description-span");

    const passwordSpan = document.createElement('span');
    passwordSpan.classList.add('wrapper__passwords-item-password-span');
    passwordSpan.textContent = `Пароль: ${password}`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('wrapper__passwords-item-delete-btn');
    deleteButton.textContent = 'Видалити';

    wrapperItem.appendChild(descriptionSpan);
    wrapperItem.appendChild(passwordSpan);
    wrapperItem.appendChild(deleteButton);
    wrapperItem.setAttribute("id", id);

    deleteButton.addEventListener("click", async () => {
        loadMoreSkip -= 1;

        await fetch("/passwords/" + id, { method: "DELETE" });

        wrapperItem.remove();
    });

    const wrapperPasswordsItemEditPasswordForm = document.createElement("form");
    wrapperPasswordsItemEditPasswordForm.classList.add("wrapper__passwords-item-edit-password-form");

    const wrapperPasswordsItemEditPasswordFormInputDescription = document.createElement("input");
    wrapperPasswordsItemEditPasswordFormInputDescription.setAttribute("placeholder", "Призначення паролю:");
    wrapperPasswordsItemEditPasswordFormInputDescription.setAttribute("value", description);

    const wrapperPasswordsItemEditPasswordFormInputPassword = document.createElement("input");
    wrapperPasswordsItemEditPasswordFormInputPassword.setAttribute("placeholder", "Новий пароль:");
    wrapperPasswordsItemEditPasswordFormInputPassword.setAttribute("value", password);
    wrapperPasswordsItemEditPasswordForm.addEventListener("submit", async (e) => await updatePasswordItemEvent(e, wrapperPasswordsItemEditPasswordForm))

    const wrapperPasswordItemEditPasswordSubmitBtn = document.createElement("button");
    wrapperPasswordItemEditPasswordSubmitBtn.setAttribute("type", "submit");
    wrapperPasswordItemEditPasswordSubmitBtn.innerHTML = "Зберегти зміни";

    const wrapperPasswordItemEditPasswordFormMessage = document.createElement("div");
    wrapperPasswordItemEditPasswordFormMessage.classList.add("wrapper__password-item-edit-password-form-message");

    const wrapperPasswordItemEditPasswordButton = document.createElement("button");
    wrapperPasswordItemEditPasswordButton.classList.add("wrapper__passwords-item-edit-password-button");
    wrapperPasswordItemEditPasswordButton.innerHTML = "Редагувати";
    wrapperPasswordItemEditPasswordButton.addEventListener("click", () => showUpdatePasswordItemFormEvent(wrapperPasswordItemEditPasswordButton));

    wrapperPasswordsItemEditPasswordForm.appendChild(wrapperPasswordsItemEditPasswordFormInputDescription);
    wrapperPasswordsItemEditPasswordForm.appendChild(wrapperPasswordsItemEditPasswordFormInputPassword);
    wrapperPasswordsItemEditPasswordForm.appendChild(wrapperPasswordItemEditPasswordSubmitBtn);

    wrapperItem.appendChild(wrapperPasswordsItemEditPasswordForm);
    wrapperItem.appendChild(wrapperPasswordItemEditPasswordFormMessage);
    wrapperItem.appendChild(wrapperPasswordItemEditPasswordButton);
;

    return wrapperItem;
}

for(let i = 0; i < deletePasswordItemsBtn.length; i++) {
    deletePasswordItemsBtn[i].addEventListener("click", async () => {
        await fetch("/passwords/" + deletePasswordItemsBtn[i].parentElement.getAttribute("id"), {
            method: "DELETE"
        });
        deletePasswordItemsBtn[i].parentElement.remove();

        loadMoreSkip -= 1;
    });
}

for(let i = 0; i < editPasswordItemsForm.length; i++) {
    editPasswordItemsForm[i].addEventListener("submit", async (e) => {
        await updatePasswordItemEvent(e, editPasswordItemsForm[i]);
    });
}

for(let i = 0; i < editPasswordItemsBtn.length; i++) {
    editPasswordItemsBtn[i].addEventListener("click", () => {
        showUpdatePasswordItemFormEvent(editPasswordItemsBtn[i]);
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

    if(api.ok) {
        wrapperResponseMessage.innerHTML = "<span>" + response.message + "</span>";
        wrapperResponseMessage.style.backgroundColor = "#378019F9";
        wrapperResponseMessage.style.display = "block";

        wrapperPasswords.insertBefore(createPasswordItem(e.target[0].value, e.target[1].value, response.id, loadMoreSkip), wrapperPasswords.children[0]);

        const timeout = setTimeout(() => {
            wrapperResponseMessage.style.display = "none";
            clearTimeout(timeout);
        }, 3000);

        loadMoreSkip += 1;
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

if(loadMoreBtn) {
    loadMoreBtn.addEventListener("click", async function () {
        const api = await fetch(`/passwords/load-more?take=10&skip=${loadMoreSkip}`);
        const response = await api.json();

        if(!response.loadMore) {
            loadMoreBtn.remove();
        }
        for(let i = 0; i < response.data.length; i++) {
            wrapperPasswords.appendChild(createPasswordItem(response.data[i].description, response.data[i].password, response.data[i].id));
        }
        loadMoreSkip += 10;
    });
}

/* Events */


async function updatePasswordItemEvent(e, editPasswordItemForm) {
    e.preventDefault();

    const passwordId = editPasswordItemForm.parentElement.getAttribute("id");

    const newDescription = e.target[0].value;
    const newPassword = e.target[1].value;
    const formMessage = editPasswordItemForm.parentElement.querySelector(".wrapper__password-item-edit-password-form-message");

    const api = await fetch("/passwords/" + passwordId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description: newDescription,
            password: newPassword
        })
    });

    if(!api.ok) {
        const response = await api.json();

        formMessage.style.display = "block";
        formMessage.style.backgroundColor = "#801919F9";
        formMessage.innerHTML = response.message;
    } else {
        const wrapperPasswordItemDescription = editPasswordItemForm.parentElement.querySelector(".wrapper__passwords-item-description-span");
        const wrapperPasswordItemPassword = editPasswordItemForm.parentElement.querySelector(".wrapper__passwords-item-password-span");

        wrapperPasswordItemDescription.innerHTML = "Призначення: " + newDescription;
        wrapperPasswordItemPassword.innerHTML = "Пароль: " + newPassword;

        formMessage.style.display = "block";
        formMessage.style.backgroundColor = "#378019F9";
        formMessage.innerHTML = "Зміни збережено успішно";
    }
}

function showUpdatePasswordItemFormEvent(editPasswordItemBtn) {
    const form = editPasswordItemBtn.parentElement.querySelector(".wrapper__passwords-item-edit-password-form");
    const formMessage = editPasswordItemBtn.parentElement.querySelector(".wrapper__password-item-edit-password-form-message");

    if(!form.style.display || form.style.display === "none") {
        form.style.display = "flex";

        editPasswordItemBtn.innerHTML = "Скасувати";
    } else {
        form.style.display = "none";
        formMessage.style.display = "none";

        editPasswordItemBtn.innerHTML = "Редагувати";
    }
}
