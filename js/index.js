const movies = JSON.parse(localStorage.getItem('movies')) || [];
let Recommendations = document.getElementById("Recommendations");
let newItemsSeasonContainer = document.getElementById("newItemsSeasonContainer");
let moviesByGenreContainer = document.getElementById("moviesByGenreContainer");

for (let i = 0; i < movies.length; i++) {
    if (i < 6) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        Recommendations.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 12) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        newItemsSeasonContainer.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 24) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        moviesByGenreContainer.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    }
}

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
    const registerButton = document.getElementById('registerButton');

    // Проверяем, вошел ли пользователь, проверяя localStorage
    if (localStorage.getItem('current_user')) {
        // Если пользователь вошел, скрываем кнопку "Войти", "Зарегистрироваться" и показываем аватарку
        loginButton.style.display = 'none';
        profilePicture.style.display = 'block';
        registerButton.style.display = 'none';
    } else {
        // Если пользователь не вошел, оставляем все как есть
        loginButton.style.display = 'block';
        profilePicture.style.display = 'none';
        registerButton.style.display = 'inline-block';
    }

    const profile_image = document.getElementById('profile_image');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const current_user = localStorage.getItem('current_user');
    const currentUserInfo = users.find(user => user.login === current_user);

    if (currentUserInfo) {
        profile_image.src = currentUserInfo.avatar;
    }
});

document.getElementById('go_out').addEventListener('click', function() {
    localStorage.removeItem('current_user');
    window.location.reload();
});