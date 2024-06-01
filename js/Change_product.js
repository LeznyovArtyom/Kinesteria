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

    const userId = getCookie('user_id');
    let user;
    if (userId) {
        try {
            let response = await fetch(`${link}/users/${userId}`);

            if (response.ok) {
                user = await response.json();
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

    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    let product;
    if (product_id) {
        try {
            let response = await fetch(`${link}/products/${product_id}`);

            if (response.ok) {
                product = await response.json();
                product = product.Product;
            } else {
                console.error('Ошибка при получении данных пользователя:', await response.json());
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    }

    // Отображение текущей информации о произведении
    document.getElementById('text_name').placeholder = product.name;
    document.getElementById('text_release_year').placeholder = product.release_year;
    document.getElementById('text_director').placeholder = product.director;
    document.getElementById('text_actors').placeholder = product.actors;
    document.getElementById('text_rating').placeholder = product.rating;
    document.getElementById('text_description').placeholder = product.description;
    document.getElementById('preview').src = 'data:image/jpeg;base64,' + product.image;

    // Отметка флажков для жанров
    const genresChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectGenres input[type="checkbox"]');
    genresChBoxes.forEach((checkbox) => {
        if (product.genre_ids.includes(Number(checkbox.value))) {
            checkbox.checked = true;
        }
    });

    // Отметка флажков для стран
    const countryChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectCountry input[type="checkbox"]');
    countryChBoxes.forEach((checkbox) => {
        if (product.country_ids.includes(Number(checkbox.value))) {
            checkbox.checked = true;
        }
    });

    // Отметка флажков для качества
    const qualityChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectQuality input[type="checkbox"]');
    qualityChBoxes.forEach((checkbox) => {
        if (product.quality_ids.includes(Number(checkbox.value))) {
            checkbox.checked = true;
        }
    });

    // Отметка флажков для субтитров
    const subtitlesChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectSubtitles input[type="checkbox"]');
    subtitlesChBoxes.forEach((checkbox) => {
        if (product.subtitles_ids.includes(Number(checkbox.value))) {
            checkbox.checked = true;
        }
    });

    // Отметка флажков для озвучки
    const voiceActingChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectVoiceActing input[type="checkbox"]');
    voiceActingChBoxes.forEach((checkbox) => {
        if (product.voice_acting_ids.includes(Number(checkbox.value))) {
            checkbox.checked = true;
        }
    });
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


// Слушаем кнопки изменения полей
document.getElementById('changeName').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('name', document.getElementById('text_name').value);
});
document.getElementById('changeReleaseYear').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('release_year', Number(document.getElementById('text_release_year').value));
});
document.getElementById('changeDirector').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('director', document.getElementById('text_director').value);
});
document.getElementById('changeActors').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('actors', document.getElementById('text_actors').value);
});
document.getElementById('changeRating').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('rating', Number(document.getElementById('text_rating').value));
});
document.getElementById('changeDescription').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('description', document.getElementById('text_description').value);
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

document.getElementById('changeImage').addEventListener('click', async e => {
    e.preventDefault();
    const productImage = document.getElementById('productImage');
    const reader = new FileReader();
    reader.readAsDataURL(productImage.files[0]);
    reader.onload = async function() {
        console.log(reader.result)
        await updateProduct('image', reader.result);
    };
});

document.getElementById('changeGenre').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('genre_id', genresSelectedListItems);
    console.log(genresSelectedListItems)
});
document.getElementById('changeCountry').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('country_id', countrySelectedListItems);
});
document.getElementById('changeQuality').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('quality_id', qualitySelectedListItems);
});
document.getElementById('changeSubtitles').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('subtitles_id', subtitlesSelectedListItems);
});
document.getElementById('changeVoiceActing').addEventListener('click', async e => {
    e.preventDefault();
    await updateProduct('voice_acting_id', voiceActingSelectedListItems);
});


// Обновить информацию о произведении
async function updateProduct(field, value) {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    const productUpdate = {};
    productUpdate[field] = value;

    try {
        let response = await fetch(`${link}/products/${product_id}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productUpdate)
        });

        if (!response.ok) {
            console.error('Ошибка при обновлении информации о произведении:', await response.json());
        } else {
            alert('Произведение успешно обновлено');
        }
    } catch (error) {
        console.error('Ошибка при обновлении информации о произведении:', error);
    }

    //window.location.reload(); // Перезагружаем страницу
}


// Переход на страницу изменения произведения
document.getElementById('backToProduct').addEventListener('click', function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    window.location.href=`../html/Temp_movie_page.html?id=${product_id}`;
});