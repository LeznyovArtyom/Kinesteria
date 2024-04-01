function handleCB(chBoxes, selectedListItems, dropdownButtonId, element) {
    const dropdownButton = document.getElementById(dropdownButtonId);
    selectedListItems.length = 0;
    let selectedListItemsText = '';
    chBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedListItems.push(checkbox.value);
            selectedListItemsText += checkbox.value + ', ';
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
            selectedRadio.value = radio.value;
            selectedItemsText = radio.value;
        }
    });
    dropdownButton.innerText = selectedItemsText != 0 ? selectedItemsText : 'Выберите ' + element;
}
const typeRadioButtons = document.querySelectorAll('.dropdown-menu.multiSelectType input[type="radio"]');
let typeSelectedRadio = { value: null }; // Объект для хранения выбранного значения
typeRadioButtons.forEach((radio) => {
    radio.addEventListener('change', () => handleRadio(typeRadioButtons, typeSelectedRadio, 'multiSelectTypeButton', 'тип'));
});


function download(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function() {
        let img = document.getElementById("preview");
        img.src = reader.result;
    }
}

const form = document.getElementById('addMovie_form');

form.addEventListener("submit", e => {
    e.preventDefault();

    const header_edit = document.getElementById('header_edit');
    const name_edit = document.getElementById('name_edit');
    const year_edit = document.getElementById('year_edit');
    const original_name_edit = document.getElementById('original_name_edit');
    const director_edit = document.getElementById('director_edit');
    const actors_edit = document.getElementById('actors_edit');
    const rating_edit = document.getElementById('rating_edit');
    const description_edit = document.getElementById('description_edit');

    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    let newMovie = {
        header: header_edit.value,
        name: name_edit.value,
        year: year_edit.value,
        original_name: original_name_edit.value,
        director: director_edit.value,
        actors: actors_edit.value,
        rating: rating_edit.value,
        description: description_edit.value,
        genres: genresSelectedListItems.length > 0 ? genresSelectedListItems : [""],
        type: typeSelectedRadio.value,
        country: countrySelectedListItems.length > 0 ? countrySelectedListItems : [""],
        quality: qualitySelectedListItems.length > 0 ? qualitySelectedListItems : [""],
        subtitles: subtitlesSelectedListItems.length > 0 ? subtitlesSelectedListItems : [""],
        voice_acting: voiceActingSelectedListItems.length > 0 ? voiceActingSelectedListItems : [""],
    };

    const add_image_edit = document.getElementById('add_image_edit');
    const reader = new FileReader();
    reader.readAsDataURL(add_image_edit.files[0]);

    reader.onload = function() {
        const url = reader.result;
        newMovie["image"] = url;

        const add_video_edit = document.getElementById('add_files_edit');
        const videos = Array.from(add_video_edit.files);
        const promises = videos.map(videoFile => {
            return new Promise((resolve, reject) => {
                const videoReader = new FileReader();
                videoReader.readAsDataURL(videoFile);
                videoReader.onload = function() {
                    resolve(videoReader.result);
                };
            });
        });

        Promise.all(promises).then(videoUrls => {
            newMovie["videos"] = videoUrls;

            movies.push(newMovie);
            localStorage.setItem('movies', JSON.stringify(movies));
            alert("Вы успешно добавили фильм!");
            form.reset();
            window.location.href = "Catalog_page.html";
        });
    };
});


document.addEventListener('DOMContentLoaded', function () {
    // Функция для получения параметров из URL
    function getUrlParams() {
        var urlParams = new URLSearchParams(window.location.search);
        var params = {};

        // Проверяем наличие параметров в URL и добавляем их в объект params
        if (urlParams.has('type')) {
            params.type = urlParams.get('type');
        }
        if (urlParams.has('genre')) {
            params.genre = urlParams.get('genre');
        }
        if (urlParams.has('year')) {
            params.year = urlParams.get('year');
        }
        if (urlParams.has('rating')) {
            params.rating = urlParams.get('rating');
        }
        if (urlParams.has('country')) {
            params.country = urlParams.get('country');
        }
        if (urlParams.has('quality')) {
            params.quality = urlParams.get('quality');
        }
        if (urlParams.has('subtitles')) {
            params.subtitles = urlParams.get('subtitles');
        }
        if (urlParams.has('voice')) {
            params.voice = urlParams.get('voice');
        }

        return params;
    }

    // Функция для установки значений фильтров на странице каталога
    function setFilters() {
        var params = getUrlParams();

        // Устанавливаем значения фильтров, если они присутствуют в параметрах URL
        if (params.type) {
            document.getElementById('type_filter_2').value = params.type;
        }
        if (params.genre) {
            document.getElementById('genre_filter_2').value = params.genre;
        }
        if (params.year) {
            document.getElementById('customRange1').value = params.year;
        }
        if (params.rating) {
            document.getElementById('rating_filter').value = params.rating;
        }
        if (params.country) {
            document.getElementById('country_filter').value = params.country;
        }
        if (params.quality) {
            document.getElementById('quality_filter').value = params.quality;
        }
        if (params.subtitles) {
            document.getElementById('subtitles_filter').value = params.subtitles;
        }
        if (params.voice) {
            document.getElementById('voice_acting_filter').value = params.voice;
        }
    }

    // Вызываем функцию установки фильтров при загрузке страницы
    setFilters();

    // Функция для отображения фильмов в соответствии с выбранными фильтрами
    function filterMovies() {
        var typeFilter = document.getElementById('type_filter_2').value;
        var genreFilter = document.getElementById('genre_filter_2').value;
        var yearFilter = document.getElementById('customRange1').value;
        var ratingFilter = document.getElementById('rating_filter').value;
        var countryFilter = document.getElementById('country_filter').value;
        var qualityFilter = document.getElementById('quality_filter').value;
        var subtitlesFilter = document.getElementById('subtitles_filter').value;
        var voiceActingFilter = document.getElementById('voice_acting_filter').value;

        var movies = JSON.parse(localStorage.getItem('movies')) || [];

        // Очищаем контейнер перед добавлением новых фильмов
        var moviesContainer = document.getElementById('moviesContainer');
        moviesContainer.innerHTML = '';

        let i = 0;
        // Фильтрация и отображение фильмов
        movies.forEach(function (movie) {
            if ((typeFilter === 'Тип' || movie.type === typeFilter) &&
                (genreFilter === 'Жанр' || movie.genres.includes(genreFilter)) &&
                (yearFilter === 0 || parseInt(movie.year) <= parseInt(yearFilter)) &&
                (ratingFilter === '' || parseFloat(movie.rating) <= parseFloat(ratingFilter)) &&
                (countryFilter === '' || movie.country.includes(countryFilter)) &&
                (qualityFilter === '' || movie.quality.includes(qualityFilter)) &&
                (subtitlesFilter === '' || movie.subtitles.includes(subtitlesFilter)) &&
                (voiceActingFilter === '' || movie.voice_acting.includes(voiceActingFilter))) {
                    let div = document.createElement('div');
                    div.classList.add("col-xxl-2");
                    moviesContainer.prepend(div);
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
            i++;
        });
    }

    // Слушаем изменения в фильтрах и вызываем функцию фильтрации
    document.getElementById('genre_filter_2').addEventListener('change', filterMovies);
    document.getElementById('type_filter_2').addEventListener('change', filterMovies);
    document.getElementById('customRange1').addEventListener('input', filterMovies);
    document.getElementById('rating_filter').addEventListener('change', filterMovies);
    document.getElementById('country_filter').addEventListener('change', filterMovies);
    document.getElementById('quality_filter').addEventListener('change', filterMovies);
    document.getElementById('subtitles_filter').addEventListener('change', filterMovies);
    document.getElementById('voice_acting_filter').addEventListener('change', filterMovies);

    // При загрузке страницы применяем фильтры
    filterMovies();
});