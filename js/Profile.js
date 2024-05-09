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
    const avatar_image = document.getElementById('avatar_image');
    const login = document.getElementById("login");
    const first_name = document.getElementById("first_name");
    const last_name = document.getElementById("last_name");
    const about_me = document.getElementById("about_me");

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const current_user = localStorage.getItem('current_user');
    const currentUserInfo = users.find(user => user.login === current_user);

    if (currentUserInfo) {
        profile_image.src = currentUserInfo.avatar;
        avatar_image.src = currentUserInfo.avatar;
        login.innerHTML = currentUserInfo.login;
        first_name.innerHTML = currentUserInfo.first_name;
        last_name.innerHTML = currentUserInfo.last_name;
        about_me.innerHTML = currentUserInfo.about_me || "";
    }
});

document.getElementById('go_out').addEventListener('click', function() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
});