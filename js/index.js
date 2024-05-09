// Получаем произведения из базы данных
function getProducts() {    
    // Отправляем AJAX запрос к API
    fetch(`https://kinesteria-production.up.railway.app/products/`)
        .then(response => response.json())
        .then(data => {
            const movies = data.Products;
            displayMovies(movies); // Функция отображения фильмов на странице
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

getProducts()


function fillContainer(container, movies) {
    container.innerHTML = ''; // Очищаем контейнер перед заполнением
    movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add("col-xxl-2");
        container.appendChild(div);
        const a = document.createElement('a');
        a.href = "html/Temp_movie_page.html?id=" + movie.id;
        div.appendChild(a);
        const img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = 'data:image/jpeg;base64,' + movie.image;
        a.appendChild(img);
    })
}

// Функция получения текущего года
function getCurrentYear() {
    return new Date().getFullYear();
}

function displayMovies(movies) {
    const currentYear = getCurrentYear(); // Текущий год
    const recommendations = [];  // Массив для рекомендаций
    const newSeason = [];        // Массив для новинок сезона
    const moviesByGenre = [];    // Массив для фильмов по жанрам

    // Фильтрация по критериям
    for (const movie of movies) {
        if (movie.type === "Фильм" && movie.rating > 7 && recommendations.length < 6) {
            recommendations.push(movie);
            continue;
        }

        // На сайте пока нет фильмов текущего года
        if (movie.type === "Фильм" && movie.release_year === 2022 && newSeason.length < 6) {
            newSeason.push(movie);
            continue;
        }

        if (movie.type === "Фильм" && moviesByGenre.length < 24) {
            moviesByGenre.push(movie);
        }
    }

    let Recommendations = document.getElementById("Recommendations");
    let newItemsSeasonContainer = document.getElementById("newItemsSeasonContainer");
    let moviesByGenreContainer = document.getElementById("moviesByGenreContainer");

    // Отображение результатов в соответствующих контейнерах
    fillContainer(Recommendations, recommendations);
    fillContainer(newItemsSeasonContainer, newSeason);
    fillContainer(moviesByGenreContainer, moviesByGenre);
}


document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "/html/Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});




// Переделать !!!!!!

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
