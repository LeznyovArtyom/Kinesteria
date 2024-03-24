const movies = JSON.parse(localStorage.getItem('movies')) || [];
let newItemsContainer = document.getElementById("newItemsContainer");
let moviesContainer = document.getElementById("moviesContainer");

for (let i = 0; i < movies.length; i++) {
    if (i < 6) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-2");
        newItemsContainer.appendChild(div);
        let a = document.createElement('a');
        a.id = "linkToMovie_" + i;
        a.href = "Temp_movie_page.html?id=" + a.id;
        div.appendChild(a);
        let img = document.createElement('img');
        img.classList.add("w-100", "main-image");
        img.alt = "фильм";
        img.src = movies[i].image;
        a.appendChild(img);
    } else if (i < 14) {
        let div = document.createElement('div');
        div.classList.add("col-xxl-3");
        moviesContainer.appendChild(div);
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