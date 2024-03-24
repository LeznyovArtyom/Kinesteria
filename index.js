const movies = JSON.parse(localStorage.getItem('movies')) || [];
let Recommendations = document.getElementById("Recommendations");
let newItemsSeasonContainer = document.getElementById("newItemsSeasonContainer");
let moviesByGenreContainer = document.getElementById("moviesByGenreContainer");

for (let i = 0; i < movies.length; i++) {
    if (i < 6) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        Recommendations.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 12) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        newItemsSeasonContainer.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 24) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        moviesByGenreContainer.appendChild(div);
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
}