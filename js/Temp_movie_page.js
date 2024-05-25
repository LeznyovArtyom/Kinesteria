//const link = 'http://localhost:8000';
const link = 'https://kinesteria-production.up.railway.app';

// Отображение информации о произведении
window.onload = function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let movie_id = urlParams.get('id');

    // Получение фильма из базы данных
    if (movie_id) {
        fetch(`${link}/products/${movie_id}`)
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
    const changeMovie = document.getElementById('changeMovie');
    const deleteMovie = document.getElementById('deleteMovie');

    const userId = getCookie('user_id');
    if (userId) {
        try {
            let response = await fetch(`${link}/users/${userId}`);

            if (response.ok) {
                let user = await response.json();
                user = user.User;
                loginButton.style.display = 'none';
                profilePicture.style.display = 'block';
                profile_image.src = user.avatar;
                if (user.role === 'Админиcтратор' || user.role === 'Модератор') {
                    changeMovie.style.display = 'block';
                    deleteMovie.style.display = 'block';
                }
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


// Переход на страницу изменения произведения
document.getElementById('changeMovie').addEventListener('click', function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    window.location.href=`../html/Change_product.html?id=${product_id}`;
});


// Удалить произведение
document.getElementById('deleteMovie').addEventListener('click', function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    fetch(`${link}/products/${product_id}/delete`, {
        method: 'DELETE',
    })
    .then(response => {
        window.location.href = "Catalog_page.html"; // Переадресация обратно на страницу каталога
    })
    .catch(error => {
        console.error('Ошибка при удалении фильма:', error);
    });
});