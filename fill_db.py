import mysql.connector
import json

# connection = mysql.connector.connect(
#     host="localhost",
#     port=3306,
#     user="root",
#     password="TikTakfoke86!",
#     database="Kinesteria"
# )

connection = mysql.connector.connect(
    host="roundhouse.proxy.rlwy.net",
    port=57239,
    user="root",
    password="iFoNNWuswkWVpZOjwZoBRcMGoGgQAPbe",
    database="Kinesteria"
)

cursor = connection.cursor()

# Независимые таблицы
genres = [("Комедия",), ("Ужасы",), ("Фантастика",), ("Детектив",), ("Боевик",), ("Триллер",), ("Роман",), ("Биография",), ("Приключения",), ("Драма",), ("Фэнтези",), ("Вестерн",), ("Мелодрама",)]
cursor.executemany("INSERT INTO genre (name) VALUES (%s)", genres)

quality = [("480p",), ("720p",), ("1080p",)]
cursor.executemany("INSERT INTO quality (name) VALUES (%s)", quality)

voice_acting = [("Русский",), ("Англйиский",)]
cursor.executemany("INSERT INTO voice_acting (name) VALUES (%s)", voice_acting)

roles = [("Админиcтратор",), ("Модератор",), ("Пользователь",)]
cursor.executemany("INSERT INTO role (name) VALUES (%s)", roles)

countries = [("Австралия",), ("Австрия",), ("Бельгия",), ("Великобритания",), ("Венгрия",), ("Германия",), ("Гонконг",), ("Греция",), 
             ("Дания",), ("Исландия",), ("Испания",), ("Италия",), ("Канада",), ("Китай",), ("Мальта",), ("Нидерланды",), ("Новая Зеландия",), 
             ("Норвегия",), ("Польша",), ("Россия",), ("Сербия",), ("США",), ("Турция",), ("Франция",), ("Швеция",), ("Южная Корея",), ("Япония",)]
cursor.executemany("INSERT INTO country (name) VALUES (%s)", countries)

subtitles = [("Русский",), ("Английский",)]
cursor.executemany("INSERT INTO subtitles (name) VALUES (%s)", subtitles)

types = [("Фильм",), ("Сериал",), ("Мультфильм",)]
cursor.executemany("INSERT INTO type (name) VALUES (%s)", types)

# Администратор
cursor.execute("INSERT INTO user (first_name, last_name, login, email, password, avatar, role_id) VALUES ('Артём', 'Лезнёв', 'artemiy', 'a-leznev@mail.ru', 'a1a1artemida', 'avatar1', '1')")

with open("movies.json", 'r', encoding='utf-8') as file:
    data = json.load(file)

    for movie in data:
        elems = (movie["name"], movie["description"], movie["original_name"], movie["director"], movie["actors"], movie["release_year"], movie["rating"], movie["image"], 1)
        cursor.execute("INSERT INTO product (name, description, original_name, director, actors, release_year, rating, image, type_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", elems)

        # Получение ID добавленного фильма
        movie_id = cursor.lastrowid

        for genre_name in movie["genres"]:
            cursor.execute("SELECT id FROM genre WHERE name = %s", (genre_name,))
            genre_id = cursor.fetchone()[0]
            product_genre_elems = (movie_id, genre_id)
            cursor.execute("INSERT INTO product_genre (product_id, genre_id) VALUES (%s, %s)", product_genre_elems)

        for country_name in movie["country"]:
            cursor.execute("SELECT id FROM country WHERE name = %s", (country_name,))
            country_id = cursor.fetchone()[0]
            product_country_elems = (movie_id, country_id)
            cursor.execute("INSERT INTO product_country (product_id, country_id) VALUES (%s, %s)", product_country_elems)

        for subtitles_name in movie["subtitles"]:
            cursor.execute("SELECT id FROM subtitles WHERE name = %s", (subtitles_name,))
            subtitles_id = cursor.fetchone()[0]
            product_subtitles_elems = (movie_id, subtitles_id)
            cursor.execute("INSERT INTO product_subtitles (product_id, subtitles_id) VALUES (%s, %s)", product_subtitles_elems)

        for quality_name in movie["quality"]:
            cursor.execute("SELECT id FROM quality WHERE name = %s", (quality_name,))
            quality_id = cursor.fetchone()[0]
            product_quality_elems = (movie_id, quality_id)
            cursor.execute("INSERT INTO product_quality (product_id, quality_id) VALUES (%s, %s)", product_quality_elems)

        for voice_acting_name in movie["voice_acting"]:
            cursor.execute("SELECT id FROM voice_acting WHERE name = %s", (voice_acting_name,))
            voice_acting_id = cursor.fetchone()[0]
            product_voice_acting_elems = (movie_id, voice_acting_id)
            cursor.execute("INSERT INTO product_voice_acting (product_id, voice_acting_id) VALUES (%s, %s)", product_voice_acting_elems)

        cursor.execute("INSERT INTO movies (product_id) VALUES (%s)", (movie_id,))

with open("series.json", 'r', encoding='utf-8') as file:
    data = json.load(file)

    for ser in data:
        elems = (ser["name"], ser["description"], ser["original_name"], ser["director"], ser["actors"], ser["release_year"],ser["rating"], ser["image"], 2)
        cursor.execute("INSERT INTO product (name, description, original_name, director, actors, release_year, rating, image, type_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", elems)

        # Получение ID добавленного фильма
        ser_id = cursor.lastrowid

        for genre_name in ser["genres"]:
            cursor.execute("SELECT id FROM genre WHERE name = %s", (genre_name,))
            genre_id = cursor.fetchone()[0]
            product_genre_elems = (ser_id, genre_id)
            cursor.execute("INSERT INTO product_genre (product_id, genre_id) VALUES (%s, %s)", product_genre_elems)

        for country_name in ser["country"]:
            cursor.execute("SELECT id FROM country WHERE name = %s", (country_name,))
            country_id = cursor.fetchone()[0]
            product_country_elems = (ser_id, country_id)
            cursor.execute("INSERT INTO product_country (product_id, country_id) VALUES (%s, %s)", product_country_elems)

        for subtitles_name in ser["subtitles"]:
            cursor.execute("SELECT id FROM subtitles WHERE name = %s", (subtitles_name,))
            subtitles_id = cursor.fetchone()[0]
            product_subtitles_elems = (ser_id, subtitles_id)
            cursor.execute("INSERT INTO product_subtitles (product_id, subtitles_id) VALUES (%s, %s)", product_subtitles_elems)

        for quality_name in ser["quality"]:
            cursor.execute("SELECT id FROM quality WHERE name = %s", (quality_name,))
            quality_id = cursor.fetchone()[0]
            product_quality_elems = (ser_id, quality_id)
            cursor.execute("INSERT INTO product_quality (product_id, quality_id) VALUES (%s, %s)", product_quality_elems)

        for voice_acting_name in ser["voice_acting"]:
            cursor.execute("SELECT id FROM voice_acting WHERE name = %s", (voice_acting_name,))
            voice_acting_id = cursor.fetchone()[0]
            product_voice_acting_elems = (ser_id, voice_acting_id)
            cursor.execute("INSERT INTO product_voice_acting (product_id, voice_acting_id) VALUES (%s, %s)", product_voice_acting_elems)

        cursor.execute("INSERT INTO series (product_id) VALUES (%s)", (ser_id,))


with open("cartoons.json", 'r', encoding='utf-8') as file:
    data = json.load(file)

    for ser in data:
        elems = (ser["name"], ser["description"], ser["original_name"], ser["director"], ser["actors"], ser["release_year"],ser["rating"], ser["image"], 3)
        cursor.execute("INSERT INTO product (name, description, original_name, director, actors, release_year, rating, image, type_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)", elems)

        # Получение ID добавленного фильма
        ser_id = cursor.lastrowid

        for genre_name in ser["genres"]:
            cursor.execute("SELECT id FROM genre WHERE name = %s", (genre_name,))
            genre_id = cursor.fetchone()[0]
            product_genre_elems = (ser_id, genre_id)
            cursor.execute("INSERT INTO product_genre (product_id, genre_id) VALUES (%s, %s)", product_genre_elems)

        for country_name in ser["country"]:
            cursor.execute("SELECT id FROM country WHERE name = %s", (country_name,))
            country_id = cursor.fetchone()[0]
            product_country_elems = (ser_id, country_id)
            cursor.execute("INSERT INTO product_country (product_id, country_id) VALUES (%s, %s)", product_country_elems)

        for subtitles_name in ser["subtitles"]:
            cursor.execute("SELECT id FROM subtitles WHERE name = %s", (subtitles_name,))
            subtitles_id = cursor.fetchone()[0]
            product_subtitles_elems = (ser_id, subtitles_id)
            cursor.execute("INSERT INTO product_subtitles (product_id, subtitles_id) VALUES (%s, %s)", product_subtitles_elems)

        for quality_name in ser["quality"]:
            cursor.execute("SELECT id FROM quality WHERE name = %s", (quality_name,))
            quality_id = cursor.fetchone()[0]
            product_quality_elems = (ser_id, quality_id)
            cursor.execute("INSERT INTO product_quality (product_id, quality_id) VALUES (%s, %s)", product_quality_elems)

        for voice_acting_name in ser["voice_acting"]:
            cursor.execute("SELECT id FROM voice_acting WHERE name = %s", (voice_acting_name,))
            voice_acting_id = cursor.fetchone()[0]
            product_voice_acting_elems = (ser_id, voice_acting_id)
            cursor.execute("INSERT INTO product_voice_acting (product_id, voice_acting_id) VALUES (%s, %s)", product_voice_acting_elems)

        cursor.execute("INSERT INTO cartoons (product_id) VALUES (%s)", (ser_id,))

connection.commit()
cursor.close()
connection.close()