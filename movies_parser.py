import requests
from bs4 import BeautifulSoup as BS
import json
import base64

number_of_films = 1
page = 1
quantity = 100
movies = []

while number_of_films <= quantity:
    url = "https://ma.lordfilm15.com/filmy/" + "page/" + str(page) + "/"

    response = requests.get(url)
    data = BS(response.content, 'html.parser')

    # Все фильмы
    films_container = data.find('div', id='dle-content')

    # Цикл по фильмам

    films = films_container.find_all('div', class_='th-item')
    for film in films:
        if number_of_films > quantity:
            break

        film_link = film.a['href']
        response2 = requests.get(film_link)
        data2 = BS(response2.content, 'html.parser')

        film_info = data2.find('div', class_='fmain')

        # Сохраняем информацию о фильме
        try:
            fields = film_info.find('div', class_='fleft-desc')
            # Описание
            description = fields.find('span', itemprop="description").text
            # Название
            name = fields.find('span', itemprop="name").text
            # Год выхода
            release_year = fields.find('span', itemprop="dateCreated").a.text
            # Страна
            country = list(map(lambda x: x.text, fields.find('span', itemprop="countryOfOrigin").find_all('a')))
            # Оригинальное название
            original_name = fields.find('span', itemprop="alternativeHeadline").text
            # Жанры
            my_genres = ["Комедия", "Ужасы", "Фантастика", "Детектив", "Боевик", "Триллер", "Роман", "Биография", "Приключения", "Драма", "Фэнтези", "Вестерн", "Мелодрама"]
            genres = list(filter(lambda x: x in my_genres, map(lambda x: x.text, fields.find('span', itemprop="genre").find_all('a'))))
            # Режиссер
            director = ', '.join(list(map(lambda x: x.text, fields.find('span', itemprop="director").find_all('a'))))
            # Актеры
            actors = ', '.join(list(map(lambda x: x.text, fields.find('span', itemprop="actors").find_all('a'))))
            # Качество
            quality = list(map(lambda x: x + 'p', fields.find('div', 'flists').find_all('ul', 'flist')[1].li.strong.text[3:].split(", ")))
            # Рейтинг
            rating = fields.find('div', class_='frate-kp').span.text

            # Сохраняем изображение
            img_container = film_info.find('div', class_='fleft-img')
            img_link = img_container.img['src']
            img = requests.get(f"https://ma.lordfilm15.com{img_link}").content
            # Преобразование бинарных данных изображения в строку Base64
            img_base64 = base64.b64encode(img).decode('utf-8')

            img_ascii = img.decode('ascii')
            print(img_ascii)

            # Отобразить изображение
            '''from PIL import Image
            import io

            # Ваши байты изображения
            image_bytes = img

            # Преобразование байтов в объект изображения
            img = Image.open(io.BytesIO(image_bytes))

            # Отображаем изображение
            img.show()'''

            print(description, name, release_year, country, original_name, genres, director, actors, quality, rating, sep='\n')
            print("Фильм", number_of_films)
            print()

            movie = {
                'name': name,
                'description': description,
                'release_year': int(release_year),
                'country': country,
                'original_name': original_name,
                'director': director,
                'actors': actors,
                'genres': genres,
                'rating': float(rating),
                'image': img_base64, 
                'quality': quality,
                'subtitles': ["Русский"],
                'type': "Фильм",
                'video': "",
                'voice_acting': ["Русский"]
            }
            movies.append(movie)

            number_of_films += 1

            if number_of_films > quantity:
                break

        except (AttributeError, ValueError):
            continue    

    page += 1

# with open('movies.json', 'w', encoding='utf-8') as f:
#     json.dump(movies, f, indent=4, ensure_ascii=False)