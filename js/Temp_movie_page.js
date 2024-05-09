window.onload = function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let index = id.split('_')[1];

    const movies = JSON.parse(localStorage.getItem('movies')) || [];

    let header_movie = document.getElementById("header_movie");
    header_movie.innerHTML = movies[index].header;

    let name_movie = document.getElementById("name_movie");
    name_movie.innerHTML = movies[index].name;

    let year_movie = document.getElementById("year_movie");
    let year_movie_value = year_movie.querySelector(".value");
    year_movie_value.innerHTML = movies[index].year;

    let country_movie = document.getElementById("country_movie");
    let country_movie_value = country_movie.querySelector(".value");
    country_movie_value.innerHTML = movies[index].country.join(", ");

    let original_name_movie = document.getElementById("original_name_movie");
    let original_name_movie_value = original_name_movie.querySelector(".value");
    original_name_movie_value.innerHTML = movies[index].original_name;

    let director_movie = document.getElementById("director_movie");
    let director_movie_value = director_movie.querySelector(".value");
    director_movie_value.innerHTML = movies[index].director;

    let actors_movie = document.getElementById("actors_movie");
    let actors_movie_movie_value = actors_movie.querySelector(".value");
    actors_movie_movie_value.innerHTML = movies[index].actors;

    let genre_movie = document.getElementById("genre_movie");
    let genre_movie_value = genre_movie.querySelector(".value");
    genre_movie_value.innerHTML = movies[index].genres.join(", ");

    let rating_movie = document.getElementById("rating_movie");
    let rating_movie_value = rating_movie.querySelector(".value");
    rating_movie_value.innerHTML = movies[index].rating;

    let image_movie = document.getElementById("image_movie");
    image_movie.src = movies[index].image;
    let decription_movie = document.getElementById("decription_movie");
    decription_movie.innerHTML = movies[index].description;
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