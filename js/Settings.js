// Функция поиска
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "../html/Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});


// Отображение аккаунта
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('loginButton');
    const profilePicture = document.getElementById('profilePicture');
    const profile_image = document.getElementById('profile_image'); 

    const userId = getCookie('user_id');
    let user;
    if (userId) {
        try {
            let response = await fetch(`${link}/users/${userId}`);

            if (response.ok) {
                user = await response.json();
                user = user.User;
                loginButton.style.display = 'none';
                profilePicture.style.display = 'block';
                profile_image.src = user.avatar;
            } else {
                console.error('Ошибка при получении данных пользователя:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            loginButton.style.display = 'block';
            profilePicture.style.display = 'none';
        }
    } else {
        loginButton.style.display = 'block';
        profilePicture.style.display = 'none';
    }

    // Отображение текущей информации о пользователе
    document.getElementById('text_login').placeholder = user.login;
    document.getElementById('text_first_name').placeholder = user.first_name;
    document.getElementById('text_last_name').placeholder = user.last_name;
    document.getElementById('text_about_me').placeholder = user.about_me || "";
    document.getElementById('preview_image').src = user.avatar;
});


// Выход из аккаунта
document.getElementById('go_out').addEventListener('click', function() {
    deleteCookie('user_id'); // Удаляем куки с id пользователя
    window.location.href = '../index.html';
});


// Функция получения куки
const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
       "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


// Функция удаления куки
const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}


// Добавляем текстовое предупреждение
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
}
 
 
// Удаляем текстовое предупреждение
const removeError = (element) => {
const inputControl = element.parentElement;
const errorDisplay = inputControl.querySelector('.error');

errorDisplay.innerText = '';
inputControl.classList.remove('error');
}


// Слушаем кнопки изменения полей
document.getElementById('changeLogin').addEventListener('click', async e => {
    e.preventDefault();
    const login = document.getElementById('text_login');

    if (validateLoginChange(login.value)) {
        await updateUser('login', login.value);
        removeError(login);
    } else {
        setError(login, "Логин должен включать хотя бы 1 латинскую букву и иметь длину от 6 до 24 символов");
    }
});

document.getElementById('changeFirstName').addEventListener('click', async e => {
    e.preventDefault();
    await updateUser('first_name', document.getElementById('text_first_name').value);
});
document.getElementById('changeLastName').addEventListener('click', async e => {
    e.preventDefault();
    await updateUser('last_name', document.getElementById('text_last_name').value);
});
document.getElementById('changeAboutMe').addEventListener('click', async e => {
    e.preventDefault();
    await updateUser('about_me', document.getElementById('text_about_me').value);
});
document.getElementById('changePassword').addEventListener('click', async e => {
    e.preventDefault();
    const password = document.getElementById('text_password');

    if (validatePasswordChange(password.value)) {
        await updateUser('password', password.value);
        removeError(password);
    } else {
        setError(password, "Пароль должен включать в себя хотя бы одну цифру и латинскую букву, длина должна быть от 6 до 32 символов");
    }
});
document.getElementById('changeAvatarImage').addEventListener('click', async e => {
    e.preventDefault();
    const avatarImage = document.getElementById('avatarImage');
    const reader = new FileReader();
    reader.readAsDataURL(avatarImage.files[0]);
    reader.onload = async function() {
        await updateUser('avatar', reader.result);
        document.getElementById('preview_image').src = reader.result;
    };
});


// Проверка корректности пароля
function validatePasswordChange(newPassword) {
    return /^(?=.*[a-zA-Z])(?=.*\d).{6,32}$/.test(newPassword);
}
// Проверка корректности логина
function validateLoginChange(login_value) {
    return 6 <= login_value.length && login_value.length <= 24 && /.*[A-Za-z].*/.test(login_value);
}


// Обновить информацию о пользователе
async function updateUser(field, value) {
    const userId = getCookie('user_id');
    if (!userId) {
        alert('Пользователь не найден');
        return;
    }

    const userUpdate = {};
    userUpdate[field] = value;

    try {
        let response = await fetch(`${link}/users/${userId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userUpdate)
        });

        if (!response.ok) {
            console.error('Ошибка при обновлении данных пользователя:', await response.json());
        } else {
            alert('Данные успешно обновлены');
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных пользователя:', error);
    }

    window.location.reload(); // Перезагружаем страницу
}