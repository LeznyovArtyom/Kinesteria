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

// Загрузить изображение, чтобы отобразить 
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
        fetch('https://kinesteria-production.up.railway.app/products/add/', {
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









// Загрузка страницы
document.addEventListener('DOMContentLoaded', function () {
    // Функция для получения параметров из URL
    function getUrlParams() {
        var urlParams = new URLSearchParams(window.location.search);
        var params = {};

        // Проверяем наличие параметров в URL и добавляем их в объект params
        if (urlParams.has('type')) { params.type = urlParams.get('type'); }
        if (urlParams.has('genre')) { params.genre = urlParams.get('genre'); }
        if (urlParams.has('year')) { params.year = urlParams.get('year'); }
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
        if (params.year) { document.getElementById('customRange1').value = params.year; }
        if (params.rating) { document.getElementById('rating_filter').value = params.rating; }
        if (params.country) { document.getElementById('country_filter').value = params.country; }
        if (params.quality) { document.getElementById('quality_filter').value = params.quality; }
        if (params.subtitles) { document.getElementById('subtitles_filter').value = params.subtitles; }
        if (params.voice) { document.getElementById('voice_acting_filter').value = params.voice; }
    }

    // Вызываем функцию установки фильтров при загрузке страницы
    setFilters();

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
    
    // Отображаем произведения по выбранным фильтрам
    function displayMovies(movies) {
        const params = getUrlParams(); // Получаем параметры из URL
        const searchQuery = params.search ? params.search.toLowerCase() : null; // Получаем поисковый запрос из параметров URL и приводим к нижнему регистру

        // Очищаем контейнер перед добавлением новых фильмов
        var moviesContainer = document.getElementById('moviesContainer');
        moviesContainer.innerHTML = '';

        var typeFilter = document.getElementById('type_filter_2').value;
        var genreFilter = document.getElementById('genre_filter_2').value;
        var yearFilter = document.getElementById('customRange1').value;
        var ratingFilter = document.getElementById('rating_filter').value;
        var countryFilter = document.getElementById('country_filter').value;
        var qualityFilter = document.getElementById('quality_filter').value;
        var subtitlesFilter = document.getElementById('subtitles_filter').value;
        var voiceActingFilter = document.getElementById('voice_acting_filter').value;

        movies.forEach(function (movie) {
            if ((typeFilter === 'Тип' || movie.type == typeFilter) &&
                (genreFilter === 'Жанр' || movie.genre.split(', ').includes(genreFilter)) &&
                (yearFilter === 0 || parseInt(movie.release_year) <= parseInt(yearFilter)) &&
                (ratingFilter === '' || parseFloat(movie.rating) >= parseFloat(ratingFilter))&&
                (countryFilter === '' || movie.country.split(', ').includes(countryFilter)) &&
                (qualityFilter === '' || movie.quality.split(', ').includes(qualityFilter)) &&
                (subtitlesFilter === '' || movie.subtitles.split(', ').includes(subtitlesFilter)) &&
                (voiceActingFilter === '' || movie.voice_acting.split(', ').includes(voiceActingFilter)) &&
                (!searchQuery || movie.name.toLowerCase().includes(searchQuery))) {
                let div = document.createElement('div');
                div.classList.add("col-xxl-2");
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


    // Слушаем изменения в фильтрах и вызываем функцию фильтрации
    document.getElementById('genre_filter_2').addEventListener('change', getProducts);
    document.getElementById('type_filter_2').addEventListener('change', getProducts);
    document.getElementById('customRange1').addEventListener('input', getProducts);
    document.getElementById('rating_filter').addEventListener('change', getProducts);
    document.getElementById('country_filter').addEventListener('change', getProducts);
    document.getElementById('quality_filter').addEventListener('change', getProducts);
    document.getElementById('subtitles_filter').addEventListener('change', getProducts);
    document.getElementById('voice_acting_filter').addEventListener('change', getProducts);


    // При загрузке страницы применяем фильтры
    getProducts();
});

document.getElementById('search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { // Проверка нажатия на Enter
        var searchQuery = this.value.trim(); // Получаем значение поля ввода, удаляя лишние пробелы
        if (searchQuery.length > 0) {
            window.location.href = "../html/Catalog_page.html?search=" + encodeURIComponent(searchQuery); // Перенаправление на страницу каталога с параметром поиска
        }
    }
});




// Переделать !!!!!!

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