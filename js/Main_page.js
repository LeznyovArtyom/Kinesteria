// Получаем произведения из базы данных
function getProducts() {    
    // Отправляем AJAX запрос к API
    fetch(`http://localhost:8000/products/`)
        .then(response => response.json())
        .then(data => {
            const products = data.Products;
            displayProducts(products); // Функция отображения фильмов на странице
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}

getProducts()

function fillContainer(container, products, num) {
    container.innerHTML = ''; // Очищаем контейнер перед заполнением
    products.forEach(product => {
        const div = document.createElement('div');
        div.classList.add(`col-xxl-${num}`);
        container.appendChild(div);
        const a = document.createElement('a');
        a.href = "Temp_movie_page.html?id=" + product.id;
        div.appendChild(a);
        const img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = 'data:image/jpeg;base64,' + product.image;
        a.appendChild(img);
    })
}

// Функция получения текущего года
function getCurrentYear() {
    return new Date().getFullYear();
}

function displayProducts(products) {
    const currentYear = getCurrentYear(); // Текущий год
    const newSeason = []; // Массив для новинок сезона
    const movies = [];    // Массив для фильмов
    const series = [];    // Массив для сериалов
    const cartoons = [];    // Массив для мультфильмов

    // Фильтрация по критериям
    for (const product of products) {
        // На сайте пока нет фильмов текущего года
        if (product.release_year === 2022 && newSeason.length < 6) {
            newSeason.push(product);
            continue;
        }
        
        if (product.type === "Фильм" && movies.length < 8) {
            movies.push(product);
            continue;
        }

        if (product.type === "Сериал" && series.length < 8) {
            series.push(product);
            continue;
        }

        if (product.type === "Мультфильм" && cartoons.length < 6) {
            cartoons.push(product);
            continue;
        }
    }

    let newItemsContainer = document.getElementById("newItemsContainer");
    let moviesContainer = document.getElementById("moviesContainer")
    let seriesContainer = document.getElementById("seriesContainer")
    let cartoonsContainer = document.getElementById("cartoonsContainer")

    // Отображение результатов в соответствующих контейнерах
    fillContainer(newItemsContainer, newSeason, 2);
    fillContainer(moviesContainer, movies, 3);
    fillContainer(seriesContainer, series, 3);
    fillContainer(cartoonsContainer, cartoons, 2);
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
    var url = '../html/Catalog_page.html?year=' + yearFilter +
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

// Функция перенаправления по жанру
function applyGenre(genre) {
    var url ='../html/Catalog_page.html?&genre=' + genre;
    window.location.href = url;
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