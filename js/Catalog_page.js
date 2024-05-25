//const link = 'http://localhost:8000';
const link = 'https://kinesteria-production.up.railway.app';

let productsData = []
// Получаем произведения из базы данных
function getProducts() {    
    // Отправляем AJAX запрос к API
    fetch(`${link}/products/`)
        .then(response => response.json())
        .then(data => {
            productsData = data.Products;
            displayProducts(productsData)
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
}


// При загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Получаем фильмы из базы данных
    getProducts();
    // Вызываем функцию установки фильтров
    setFilters();
    // Отображаем фильмы
    displayProducts(productsData)
});


// Слушаем изменения в фильтрах и вызываем функцию фильтрации
document.getElementById('genre_filter_2').addEventListener('change', () => displayProducts(productsData));
document.getElementById('type_filter_2').addEventListener('change', () => displayProducts(productsData));
document.getElementById('year_input_min').addEventListener('change', () => displayProducts(productsData));
document.getElementById('year_input_max').addEventListener('change', () => displayProducts(productsData));
document.getElementById('rating_filter').addEventListener('change', () => displayProducts(productsData));
document.getElementById('country_filter').addEventListener('change', () => displayProducts(productsData));
document.getElementById('quality_filter').addEventListener('change', () => displayProducts(productsData));
document.getElementById('subtitles_filter').addEventListener('change', () => displayProducts(productsData));
document.getElementById('voice_acting_filter').addEventListener('change', () => displayProducts(productsData));


// Функция для получения параметров из URL
function getUrlParams() {
    var urlParams = new URLSearchParams(window.location.search);
    var params = {};

    // Проверяем наличие параметров в URL и добавляем их в объект params
    if (urlParams.has('type')) { params.type = urlParams.get('type'); }
    if (urlParams.has('genre')) { params.genre = urlParams.get('genre'); }
    if (urlParams.has('year_min')) { params.year_min = urlParams.get('year_min'); }
    if (urlParams.has('year_max')) { params.year_max = urlParams.get('year_max'); }
    if (urlParams.has('rating')) { params.rating = urlParams.get('rating'); }
    if (urlParams.has('country')) { params.country = urlParams.get('country'); }
    if (urlParams.has('quality')) { params.quality = urlParams.get('quality'); }
    if (urlParams.has('subtitles')) { params.subtitles = urlParams.get('subtitles'); }
    if (urlParams.has('voice')) { params.voice = urlParams.get('voice'); }
    if (urlParams.has('search')) { params.search = urlParams.get('search'); }

    return params;
}


// Функция для установки значений фильтров на странице каталога
function setFilters() {
    var params = getUrlParams();

    // Устанавливаем значения фильтров, если они присутствуют в параметрах URL
    if (params.type) { document.getElementById('type_filter_2').value = params.type; }
    if (params.genre) { document.getElementById('genre_filter_2').value = params.genre; }
    if (params.year_min) { 
        document.getElementById('year_input_min').value = params.year_min; 
        document.getElementById('year_range_min').value = params.year_min;
    }
    if (params.year_max) {
        document.getElementById('year_input_max').value = params.year_max; 
        document.getElementById('year_range_max').value = params.year_max; 
    }
    if (params.year) { document.getElementById('customRange1').value = params.year; }
    if (params.rating) { document.getElementById('rating_filter').value = params.rating; }
    if (params.country) { document.getElementById('country_filter').value = params.country; }
    if (params.quality) { document.getElementById('quality_filter').value = params.quality; }
    if (params.subtitles) { document.getElementById('subtitles_filter').value = params.subtitles; }
    if (params.voice) { document.getElementById('voice_acting_filter').value = params.voice; }

    updateProgress();
}


// Отображаем произведения по выбранным фильтрам
function displayProducts(movies) {
    const params = getUrlParams(); // Получаем параметры из URL
    const searchQuery = params.search ? params.search.toLowerCase() : null; // Получаем поисковый запрос из параметров URL и приводим к нижнему регистру

    // Очищаем контейнер перед добавлением новых фильмов
    var moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '';

    var typeFilter = document.getElementById('type_filter_2').value;
    var genreFilter = document.getElementById('genre_filter_2').value;
    var yearFilterMin = document.getElementById('year_input_min').value;
    var yearFilterMax = document.getElementById('year_input_max').value;
    var ratingFilter = document.getElementById('rating_filter').value;
    var countryFilter = document.getElementById('country_filter').value;
    var qualityFilter = document.getElementById('quality_filter').value;
    var subtitlesFilter = document.getElementById('subtitles_filter').value;
    var voiceActingFilter = document.getElementById('voice_acting_filter').value;

    movies.forEach(function (movie) {
        if ((typeFilter === 'Тип' || movie.type == typeFilter) &&
            (genreFilter === 'Жанр' || movie.genre.split(', ').includes(genreFilter)) &&
            (parseInt(yearFilterMin) <= parseInt(movie.release_year) && parseInt(movie.release_year) <= parseInt(yearFilterMax)) &&
            (ratingFilter === '' || parseFloat(movie.rating) >= parseFloat(ratingFilter))&&
            (countryFilter === '' || movie.country.split(', ').includes(countryFilter)) &&
            (qualityFilter === '' || movie.quality.split(', ').includes(qualityFilter)) &&
            (subtitlesFilter === '' || movie.subtitles.split(', ').includes(subtitlesFilter)) &&
            (voiceActingFilter === '' || movie.voice_acting.split(', ').includes(voiceActingFilter)) &&
            (!searchQuery || movie.name.toLowerCase().includes(searchQuery))) {
            let div = document.createElement('div');
            div.classList.add("col-6", "col-md-4", "col-lg-3", "col-xl-2");
            moviesContainer.prepend(div);
            let a = document.createElement('a');
            a.href = "Temp_movie_page.html?id=" + movie.id;
            div.appendChild(a);
            let img = document.createElement('img');
            img.classList.add("w-100", "main-image");
            img.alt = "фильм";
            img.src = 'data:image/jpeg;base64,' + movie.image;
            a.appendChild(img);
        }
    });
}


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

    displayProducts(productsData);
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


// Поиск произведений
document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "../html/Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});


// Сохранение выбранных значений произведения при добавлении
function handleCB(chBoxes, selectedListItems, dropdownButtonId, element) {
    const dropdownButton = document.getElementById(dropdownButtonId);
    selectedListItems.length = 0;
    let selectedListItemsText = '';
    chBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedListItems.push(Number(checkbox.value));
            selectedListItemsText += checkbox.name + ', ';
        }
    });

    dropdownButton.innerText = selectedListItems.length > 0 ? selectedListItemsText.slice(0, -2) : 'Выберите ' + element;
}

const genresChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectGenres input[type="checkbox"]');
let genresSelectedListItems = [];
genresChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(genresChBoxes, genresSelectedListItems, 'multiSelectGenresButton', 'жанр'));
});
const countryChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectCountry input[type="checkbox"]');
let countrySelectedListItems = [];
countryChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(countryChBoxes, countrySelectedListItems, 'multiSelectCountryButton', 'страну'));
});
const qualityChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectQuality input[type="checkbox"]');
let qualitySelectedListItems = [];
qualityChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(qualityChBoxes, qualitySelectedListItems, 'multiSelectQualityButton', 'качество'));
});
const subtitlesChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectSubtitles input[type="checkbox"]');
let subtitlesSelectedListItems = [];
subtitlesChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(subtitlesChBoxes, subtitlesSelectedListItems, 'multiSelectSubtitlesButton', 'субтитры'));
});
const voiceActingChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectVoiceActing input[type="checkbox"]');
let voiceActingSelectedListItems = [];
voiceActingChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(voiceActingChBoxes, voiceActingSelectedListItems, 'multiSelectVoiceActingButton', 'озвучку'));
});

function handleRadio(radioButtons, selectedRadio, dropdownButtonId, element) {
    const dropdownButton = document.getElementById(dropdownButtonId);
    let selectedItemsText = '';
    radioButtons.forEach((radio) => {
        if (radio.checked) {
            selectedRadio.value = Number(radio.value);
            selectedItemsText = radio.getAttribute("data-value");
        }
    });
    dropdownButton.innerText = selectedItemsText != 0 ? selectedItemsText : 'Выберите ' + element;
}
const typeRadioButtons = document.querySelectorAll('.dropdown-menu.multiSelectType input[type="radio"]');
let typeSelectedRadio = { value: null }; // Объект для хранения выбранного значения
typeRadioButtons.forEach((radio) => {
    radio.addEventListener('change', () => handleRadio(typeRadioButtons, typeSelectedRadio, 'multiSelectTypeButton', 'тип'));
});


// Загрузить изображение, чтобы отобразить в предпросмотре при добавлении произведения
function download(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
        let img = document.getElementById("preview");
        img.src = reader.result;
    }
}

// Окно добавления фильма (без видео)
const form = document.getElementById('addMovie_form');
form.addEventListener("submit", async e => {
    e.preventDefault();

    // Получаем данные из формы добавления фильма
    const name_edit = document.getElementById('name_edit');
    const year_edit = document.getElementById('year_edit');
    const original_name_edit = document.getElementById('original_name_edit');
    const director_edit = document.getElementById('director_edit');
    const actors_edit = document.getElementById('actors_edit');
    const rating_edit = document.getElementById('rating_edit');
    const description_edit = document.getElementById('description_edit');

    // Подготавливаем данные
    const newProduct = {
        name: name_edit.value,
        description: description_edit.value,
        original_name: original_name_edit.value,
        director: director_edit.value,
        actors: actors_edit.value,
        release_year: Number(year_edit.value),
        rating: Number(rating_edit.value),
        type_id: typeSelectedRadio.value,
        genre_id: genresSelectedListItems,
        country_id: countrySelectedListItems,
        subtitles_id: subtitlesSelectedListItems,
        quality_id: qualitySelectedListItems,
        voice_acting_id: voiceActingSelectedListItems,
    };

    const add_image_edit = document.getElementById('add_image_edit');
    const reader = new FileReader();
    reader.readAsDataURL(add_image_edit.files[0]);


    reader.onload = function() {
        let url = reader.result;
        url = url.split(',')[1];
        newProduct["image"] = url;
        
        console.log(newProduct);
        // Отправляем данные на сервер
        fetch(`${link}/products/add/`, {
            method: 'POST',
            body: JSON.stringify(newProduct),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
        .then(response => {
            form.reset(); // Очищаем форму
            window.location.href = "Catalog_page.html"; // Переадресация обратно на страницу каталога
        })
        .catch(error => {
            console.error('Ошибка при добавлении фильма:', error);
        });
    }
});


// Отображение аккаунта
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('loginButton');
    const profilePicture = document.getElementById('profilePicture');
    const profile_image = document.getElementById('profile_image');    
    const addProductButton = document.getElementById('addProductButton');

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
                    addProductButton.style.display = 'block';
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