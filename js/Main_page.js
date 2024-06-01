// Получаем произведения из базы данных
async function getProducts() {    
    // Отправляем AJAX запрос к API
    try {
        let response = await fetch(`${link}/products/`);
        let data = await response.json();
        const products = data.Products;
        displayProducts(products); // Функция отображения фильмов на странице
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

getProducts()


// Заполнить контейнер произведениями
function fillContainer(container, products, num1, num2, num3) {
    container.innerHTML = ''; // Очищаем контейнер перед заполнением
    products.forEach(product => {
        const div = document.createElement('div');
        //div.classList.add(`col-${num}`);
        div.classList.add("col-6", `col-md-${num3}`, `col-lg-${num2}`, `col-xl-${num1}`);
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


// Отобразить произведения на странице
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
    fillContainer(newItemsContainer, newSeason, 2, 3, 4);
    fillContainer(moviesContainer, movies, 3, 4, 4);
    fillContainer(seriesContainer, series, 3, 4, 4);
    fillContainer(cartoonsContainer, cartoons, 2, 3, 4);
}


// Функция для сбора выбранных фильтров и перехода на страницу каталога
function applyFiltersAndRedirect() {
    // Собираем значения выбранных фильтров
    let yearFilterMin = document.getElementById('year_input_min').value;
    let yearFilterMax = document.getElementById('year_input_max').value;
    let genreFilter = document.getElementById('genre_filter').value;
    let typeFilter = document.getElementById('type_filter').value;
    let countryFilter = document.getElementById('country_filter').value;
    let qualityFilter = document.getElementById('quality_filter').value;
    let subtitlesFilter = document.getElementById('subtitles_filter').value;
    let voiceActingFilter = document.getElementById('voice_acting_filter').value;
    let ratingFilter = document.getElementById('rating_filter').value;

    // Формируем URL с параметрами фильтров
    let url = '../html/Catalog_page.html?' +
              'year_min=' + yearFilterMin +
              '&year_max=' + yearFilterMax +
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


// Фильтр по году выхода произведения
const rangeMin = document.querySelector(".range-min");
const rangeMax = document.querySelector(".range-max");
const inputMin = document.querySelector(".input-min");
const inputMax = document.querySelector(".input-max");
const progress = document.querySelector(".year-slider .year-progress");

function updateProgress() {
    let minVal = parseInt(rangeMin.value);
    let maxVal = parseInt(rangeMax.value);

    // Обновляем позицию прогресс-бара на слайдере
    let minPercent = ((minVal - parseInt(rangeMin.min)) / (parseInt(rangeMin.max) - parseInt(rangeMin.min))) * 100;
    let maxPercent = ((maxVal - parseInt(rangeMax.min)) / (parseInt(rangeMax.max) - parseInt(rangeMax.min))) * 100;

    progress.style.left = `${minPercent}%`;
    progress.style.right = `${100 - maxPercent}%`;
}

// События для ползунков
[rangeMin, rangeMax].forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeMin.value);
        let maxVal = parseInt(rangeMax.value);

        // Проверяем и корректируем значения, чтобы не пересекались
        if (minVal >= maxVal) {
            if (e.target === rangeMin) {
                rangeMax.value = minVal;
                inputMax.value = minVal;  // Синхронизируем поле ввода с ползунком
            } else {
                rangeMin.value = maxVal;
                inputMin.value = maxVal;  // Синхронизируем поле ввода с ползунком
            }
        }

        // Обновляем поля ввода
        inputMin.value = rangeMin.value;
        inputMax.value = rangeMax.value;

        updateProgress();
    });
});

// События для полей ввода
[inputMin, inputMax].forEach(input => {
    input.addEventListener("input", e => {
        rangeMin.value = inputMin.value;
        rangeMax.value = inputMax.value;
        
        updateProgress();
    });

    // Добавление обработчика события потери фокуса для корректировки введенных значений
    input.addEventListener("blur", e => {
        const minValue = parseInt(rangeMin.min);
        const maxValue = parseInt(rangeMax.max);
        let value = parseInt(input.value);

        // Корректируем значение, если оно выходит за допустимые границы
        if (value < minValue) {
            value = minValue;
        } else if (value > maxValue) {
            value = maxValue;
        }

        input.value = value;
        if (input === inputMin) {
            rangeMin.value = value;
            // Проверяем, чтобы минимальное значение не превышало максимальное
            if (value >= parseInt(inputMax.value)) {
                inputMax.value = value;
                rangeMax.value = value;
            }
        } else {
            rangeMax.value = value;
            // Проверяем, чтобы максимальное значение было не меньше минимального
            if (value <= parseInt(inputMin.value)) {
                inputMin.value = value;
                rangeMin.value = value;
            }
        }
        
        updateProgress();
    });
});


// Отображение аккаунта
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('loginButton');
    const profilePicture = document.getElementById('profilePicture');
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
                profile_image.src = user.avatar;
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