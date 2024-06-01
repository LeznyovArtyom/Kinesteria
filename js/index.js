// Получаем произведения из базы данных
async function getProducts() {    
    // Отправляем AJAX запрос к API
    try {
        let response = await fetch(`${link}/products/`);
        let data = await response.json();
        const movies = data.Products;
        displayMovies(movies); // Функция отображения фильмов на странице
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

getProducts()


function fillContainer(container, movies) {
    container.innerHTML = ''; // Очищаем контейнер перед заполнением
    movies.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add("col-6", "col-md-4", "col-lg-3", "col-xl-2");
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


// Поиск по каталогу
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        e.preventDefault(); // Предотвращаем поведение по умолчанию
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "/html/Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});


// Отображение аккаунта
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('loginButton');
    const profilePicture = document.getElementById('profilePicture');
    const registerButton = document.getElementById('registerButton');
    const profile_image = document.getElementById('profile_image');

    const userId = getCookie('user_id');
    if (userId) {
        try {
            let response = await fetch(`${link}/users/${userId}`);

            if (response.ok) {
                let user = await response.json();
                user = user.User;
                loginButton.style.display = 'none';
                profilePicture.style.display = 'block';
                registerButton.style.display = 'none';
                profile_image.src = user.avatar;
            } else {
                console.error('Ошибка при получении данных пользователя:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            loginButton.style.display = 'block';
            profilePicture.style.display = 'none';
            registerButton.style.display = 'inline-block';
        }
    } else {
        loginButton.style.display = 'block';
        profilePicture.style.display = 'none';
        registerButton.style.display = 'inline-block';
    }
});


// Выход из аккаунта
document.getElementById('go_out').addEventListener('click', function() {
    deleteCookie('user_id'); // Удаляем куки с id пользователя
    window.location.reload(); // Перезагружаем страницу
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