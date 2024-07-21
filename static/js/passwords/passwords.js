const createPasswordForm = document.getElementById("create-password-form");
const wrapperResponseMessage = document.querySelector(".wrapper__response-message");
const wrapperPasswords = document.querySelector(".wrapper__passwords");
const deletePasswordItemsBtn = document.querySelectorAll(".wrapper__passwords-item-delete-btn");
const loadMoreBtn = document.querySelector(".load-more-btn");
let loadMoreSkip = 10;

export function createPasswordItem(description, password, id) {
    const wrapperItem = document.createElement('div');
    wrapperItem.classList.add('wrapper__passwords-item');

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = `Призначення: ${description}`;

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
