window.onload = function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let movie_id = urlParams.get('id');

    // Получение фильма из юазы данных
    if (movie_id) {
        fetch(`https://kinesteria-production.up.railway.app/products/${movie_id}`)
        .then(response => response.json())
        .then(data => { displayMovieDetails(data.Product); })
        .catch(error => console.error('Ошибка при получении данных', error))
    }

    // Отображение информации о фильме на странице
    function displayMovieDetails(movie) {
        document.getElementById("name_movie").innerHTML = movie.name;
        document.getElementById("decription_movie").innerHTML = movie.description;
        document.getElementById("year_movie").querySelector(".value").innerHTML = movie.release_year;
        document.getElementById("country_movie").querySelector(".value").innerHTML = movie.country;
        document.getElementById("original_name_movie").querySelector(".value").innerHTML = movie.original_name;
        document.getElementById("director_movie").querySelector(".value").innerHTML = movie.director;
        document.getElementById("actors_movie").querySelector(".value").innerHTML = movie.actors;
        document.getElementById("genre_movie").querySelector(".value").innerHTML = movie.genre;
        document.getElementById("rating_movie").querySelector(".value").innerHTML = movie.rating;
        document.getElementById("image_movie").src = 'data:image/jpeg;base64,' + movie.image;
    }
}

document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "../html/atalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
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
