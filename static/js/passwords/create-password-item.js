export function createPasswordItem(description, password, id) {
    const wrapperItem = document.createElement('div');
    wrapperItem.classList.add('wrapper__passwords-item');

    // Створюємо елемент span для опису
    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = `Призначення: ${description}`;

    // Створюємо елемент span для паролю
    const passwordSpan = document.createElement('span');
    passwordSpan.classList.add('wrapper__passwords-item-password-span');
    passwordSpan.textContent = `Пароль: ${password}`;

    // Створюємо кнопку видалення
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('wrapper__passwords-item-delete-btn');
    deleteButton.textContent = 'Видалити';

    // Додаємо всі створені елементи до основного div
    wrapperItem.appendChild(descriptionSpan);
    wrapperItem.appendChild(passwordSpan);
    wrapperItem.appendChild(deleteButton);
    wrapperItem.setAttribute("id", id);

    deleteButton.addEventListener("click", async () => {
        await fetch("/passwords/" + id, { method: "DELETE" });

        wrapperItem.remove();
    });

    return wrapperItem;
}
