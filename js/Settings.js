document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const profilePicture = document.getElementById('profilePicture');

    // Проверяем, вошел ли пользователь, проверяя localStorage
    if (localStorage.getItem('current_user')) {
        // Если пользователь вошел, скрываем кнопку "Войти" и показываем аватарку
        loginButton.style.display = 'none';
        profilePicture.style.display = 'block';
    } else {
        // Если пользователь не вошел, оставляем все как есть
        loginButton.style.display = 'block';
        profilePicture.style.display = 'none';
    }

    const profile_image = document.getElementById('profile_image');

    const text_login = document.getElementById('text_login');
    const text_first_name = document.getElementById('text_first_name');
    const text_last_name = document.getElementById('text_last_name');
    const text_about_me = document.getElementById('text_about_me');
    const preview_image = document.getElementById('preview_image');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const current_user = localStorage.getItem('current_user');
    const currentUserInfo = users.find(user => user.login === current_user);

    if (currentUserInfo) {
        profile_image.src = currentUserInfo.avatar;
        text_login.placeholder = currentUserInfo.login;
        text_first_name.placeholder = currentUserInfo.first_name;
        text_last_name.placeholder = currentUserInfo.last_name;
        text_about_me.placeholder = currentUserInfo.about_me || "";
        preview_image.src = currentUserInfo.avatar;
    }
});

document.getElementById('go_out').addEventListener('click', function() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
});

document.getElementById('changeLogin').addEventListener('click', e => {
    e.preventDefault();

    const text_login = document.getElementById('text_login').value;

    const currentUser = localStorage.getItem('current_user');
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.login === currentUser);

    if(userIndex !== -1) {
        users[userIndex].login = text_login;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('current_user', text_login);
    }
})

document.getElementById('changeFirstName').addEventListener('click', e => {
    e.preventDefault();

    const text_first_name = document.getElementById('text_first_name').value;

    const currentUser = localStorage.getItem('current_user');
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.login === currentUser);

    if(userIndex !== -1) {
        users[userIndex].first_name = text_first_name;
        localStorage.setItem('users', JSON.stringify(users));
    }
})

document.getElementById('changeLastName').addEventListener('click', e => {
    e.preventDefault();

    const text_last_name = document.getElementById('text_last_name').value;

    const currentUser = localStorage.getItem('current_user');
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.login === currentUser);

    if(userIndex !== -1) {
        users[userIndex].last_name = text_last_name;
        localStorage.setItem('users', JSON.stringify(users));
    }
})

document.getElementById('changeAboutMe').addEventListener('click', e => {
    e.preventDefault();

    const text_about_me = document.getElementById('text_about_me').value;

    const currentUser = localStorage.getItem('current_user');
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.login === currentUser);

    if(userIndex !== -1) {
        users[userIndex].about_me = text_about_me;
        localStorage.setItem('users', JSON.stringify(users));
    }
})



document.getElementById('changeAvatarImage').addEventListener('click', e => {
    e.preventDefault();

    const avatarImage = document.getElementById('avatarImage');
    const reader = new FileReader();
    reader.readAsDataURL(avatarImage.files[0]);

    reader.onload = function() {
        const url = reader.result;

        const currentUser = localStorage.getItem('current_user');
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(user => user.login === currentUser);
    
        if(userIndex !== -1) {
            users[userIndex].avatar = url;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };
    window.location.reload();
})