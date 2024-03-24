window.onload = function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let index = id.split('_')[1];

    const movies = JSON.parse(localStorage.getItem('movies')) || [];

    let header_movie = document.getElementById("header_movie");
    header_movie.innerHTML = movies[index].header;
    let name_movie = document.getElementById("name_movie");
    name_movie.innerHTML = movies[index].name;

    let year_movie = document.getElementById("year_movie");
    let year_movie_value = year_movie.querySelector(".value");
    year_movie_value.innerHTML = movies[index].year;

    let country_movie = document.getElementById("country_movie");
    let country_movie_value = country_movie.querySelector(".value");
    country_movie_value.innerHTML = movies[index].country;

    let original_name_movie = document.getElementById("original_name_movie");
    let original_name_movie_value = original_name_movie.querySelector(".value");
    original_name_movie_value.innerHTML = movies[index].original_name;

    let director_movie = document.getElementById("director_movie");
    let director_movie_value = director_movie.querySelector(".value");
    director_movie_value.innerHTML = movies[index].director;

    let actors_movie = document.getElementById("actors_movie");
    let actors_movie_movie_value = actors_movie.querySelector(".value");
    actors_movie_movie_value.innerHTML = movies[index].actors;

    let genre_movie = document.getElementById("genre_movie");
    let genre_movie_value = genre_movie.querySelector(".value");
    genre_movie_value.innerHTML = movies[index].genres.join(", ");

    let website_rating_movie = document.getElementById("website_rating_movie");
    let website_rating_movie_value = website_rating_movie.querySelector(".value");
    website_rating_movie_value.innerHTML = movies[index].website_rating;

    let IMDB_rating_movie = document.getElementById("IMDB_rating_movie");
    let IMDB_rating_movie_value = IMDB_rating_movie.querySelector(".value");
    IMDB_rating_movie_value.innerHTML = movies[index].IMDB_rating;

    let image_movie = document.getElementById("image_movie");
    image_movie.src = movies[index].image;
    let decription_movie = document.getElementById("decription_movie");
    decription_movie.innerHTML = movies[index].description;
}