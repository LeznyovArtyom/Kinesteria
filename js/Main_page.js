const movies = JSON.parse(localStorage.getItem('movies')) || [];
let newItemsContainer = document.getElementById("newItemsContainer");
let moviesContainer = document.getElementById("moviesContainer");

for (let i = 0; i < movies.length; i++) {
    if (i < 6) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        newItemsContainer.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 14) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-3");
        moviesContainer.appendChild(div);
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

// Функция для сбора выбранных фильтров и перехода на страницу каталога
function applyFiltersAndRedirect() {
    // Собираем значения выбранных фильтров
    var yearFilter = document.getElementById('date_range').value;
    var genreFilter = document.getElementById('genre_filter').value;
    var typeFilter = document.getElementById('type_filter').value;
    var countryFilter = document.getElementById('country_filter').value;
    var qualityFilter = document.getElementById('quality_filter').value;
    var subtitlesFilter = document.getElementById('subtitles_filter').value;
    var voiceActingFilter = document.getElementById('voice_acting_filter').value;
    var ratingFilter = document.getElementById('rating_filter').value;

    // Формируем URL с параметрами фильтров
    var url = 'Catalog_page.html?year=' + yearFilter +
              '&genre=' + genreFilter +
              '&type=' + typeFilter +
              '&country=' + countryFilter +
              '&quality=' + qualityFilter +
              '&subtitles=' + subtitlesFilter +
              '&voice=' + voiceActingFilter +
              '&rating=' + ratingFilter;

    // Переходим на страницу каталога с примененными фильтрами
    window.location.href = url;
}

function applyGenre(genre) {
    var url ='Catalog_page.html?&genre=' + genre;
    window.location.href = url;
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