const signupForm = document.getElementById("signup_form");
const wrapperResponseMessage = document.querySelector(".wrapper__response-message");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = await fetch("/signup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: e.target[0].value,
            password: e.target[1].value
        })
    });
    const response = await api.json();

    if(api.ok) {
        wrapperResponseMessage.innerHTML = "<span>" + response.message + "</span>";
        wrapperResponseMessage.style.backgroundColor = "#378019F9";
        wrapperResponseMessage.style.display = "block";

        window.location.href = "/auth";
    } else {
        wrapperResponseMessage.innerHTML = "<span>" + response.message + "</span>";
        wrapperResponseMessage.style.backgroundColor = "#801919F9";
        wrapperResponseMessage.style.display = "block";
    }
});

