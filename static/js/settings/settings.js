const usernameInput = document.getElementById("username_input");
const passwordInput = document.getElementById("password_input");

const savePasswordButton = document.getElementById("save_password_button");
const saveUsernameButton = document.getElementById("save_username_button");

const wrapperResponseMessage = document.querySelector(".wrapper__response-message")

saveUsernameButton.addEventListener("click", () => {
    wrapperResponseMessage.style.display = "none";

    fetch("/settings/username", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usernameInput.value
        })
    })
        .then(api => {
            return { data: api.json(), ok: api.ok };
        })
        .then(response => {
            response.data.then((data) => {
                if(response.ok) {
                    wrapperResponseMessage.style.backgroundColor = "#378019F9";
                } else {
                    wrapperResponseMessage.style.backgroundColor = "#801919F9";
                }
                wrapperResponseMessage.style.display = "block";
                wrapperResponseMessage.innerText = data.message;
            })
        })
        .catch(() => {
            wrapperResponseMessage.style.display = "block";
            wrapperResponseMessage.style.backgroundColor = "#801919F9";
            wrapperResponseMessage.innerText = "Помилка";
        })
});

savePasswordButton.addEventListener("click", () => {
    wrapperResponseMessage.style.display = "none";

    fetch("/settings/password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: passwordInput.value
        })
    }).then(api => {
        return { data: api.json(), ok: api.ok };
    })
        .then(response => {
            response.data.then((data) => {
                if(response.ok) {
                    wrapperResponseMessage.style.backgroundColor = "#378019F9";
                } else {
                    wrapperResponseMessage.style.backgroundColor = "#801919F9";
                }
                wrapperResponseMessage.style.display = "block";
                wrapperResponseMessage.innerText = data.message;
            })
        })
        .catch(() => {
            wrapperResponseMessage.style.display = "block";
            wrapperResponseMessage.style.backgroundColor = "#801919F9";
            wrapperResponseMessage.innerText = "Помилка";
        })
});
