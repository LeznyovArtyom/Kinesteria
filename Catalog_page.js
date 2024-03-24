function handleCB(chBoxes, selectedListItems) {
    selectedListItems.length = 0;
    chBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedListItems.push(checkbox.value);
        }
    });
}
const genresChBoxes = document.querySelectorAll('.dropdown-menu.multiSelectGenres input[type="checkbox"]');
let genresSelectedListItems = [];
genresChBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => handleCB(genresChBoxes, genresSelectedListItems));
});


function handleRadio(radioButtons, selectedRadio) {
    radioButtons.forEach((radio) => {
        if (radio.checked) {
            selectedRadio.value = radio.value;
        }
    });
}

const typeRadioButtons = document.querySelectorAll('.dropdown-menu.multiSelectType input[type="radio"]');
let typeSelectedRadio = { value: null }; // Объект для хранения выбранного значения
typeRadioButtons.forEach((radio) => {
    radio.addEventListener('change', () => handleRadio(typeRadioButtons, typeSelectedRadio));
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
    const country_edit = document.getElementById('country_edit');
    const original_name_edit = document.getElementById('original_name_edit');
    const director_edit = document.getElementById('director_edit');
    const actors_edit = document.getElementById('actors_edit');
    const description_edit = document.getElementById('description_edit');
    const website_rating_edit = document.getElementById('website_rating_edit');
    const IMDB_rating_edit = document.getElementById('IMDB_rating_edit');

    const add_files_edit = document.getElementById('add_files_edit');

    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    let newMovie = {
        header: header_edit.value,
        name: name_edit.value,
        year: year_edit.value,
        country: country_edit.value,
        original_name: original_name_edit.value,
        director: director_edit.value,
        genres: genresSelectedListItems,
        type: typeSelectedRadio.value,
        description: description_edit.value,
        actors: actors_edit.value,
        website_rating: website_rating_edit.value,
        IMDB_rating: IMDB_rating_edit.value,
        // files: add_files_edit.files[0]
    };
    const add_image_edit = document.getElementById('add_image_edit');
    const reader = new FileReader();
    reader.readAsDataURL(add_image_edit.files[0]);

    reader.onload = function() {
        const url = reader.result;
        newMovie["image"] = url;
        movies.push(newMovie);
        localStorage.setItem('movies', JSON.stringify(movies));
        alert("Вы успешно добавили фильм!");
        form.reset();
        window.location.href = "Catalog_page.html";
    };
});

const movies = JSON.parse(localStorage.getItem('movies')) || [];
let moviesContainer = document.getElementById("moviesContainer");
for (let i = 0; i < movies.length; i++) {
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