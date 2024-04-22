import mysql.connector

connection = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="TikTakfoke86!",
    database="Kinesteria"
)

cursor = connection.cursor()


'''roles = [("Админиcтратор",), ("Пользователь",)]
cursor.executemany("INSERT INTO role (name) VALUES (%s)", roles)

types = [("Фильм",), ("Сериал",), ("Мультфильм",)]
cursor.executemany("INSERT INTO type (name) VALUES (%s)", types)

users = [
    ("Иван", "Петров", "petro1va", "i-petrov@gmail.com", "55toratira55", None, "avatar1", 1),
    ("Лера", "Абрамова", "lerun3bra", "lerabra111@mail.ru", "lertomi111", None, "avatar2", 2)
]
cursor.executemany(
    "INSERT INTO user (first_name, last_name, login, email, password, about_me, avatar, role_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
    users
)

products = [
    ("Начало", "Вор, который крадет корпоративные секреты с помощью технологии совместного сновидения", "Inception", "Кристофер Нолан", None, 2010, 8.8, 1),
    ("Ведьмак", "Геральт из Ривии, одинокий охотник на монстров, борется, чтобы найти свое место в мире, где люди часто оказываются злее чудовищ", "The Witcher", "Стивен Серджик", "Генри Кафилл, Фрейя Аллан, Аня Чалотра", 2019, 7.2, 2)
]
cursor.executemany(
    "INSERT INTO product (name, description, original_name, director, actors, release_year, rating, type_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
    products
)
connection.commit()'''

cursor.execute("SELECT id, name FROM type")
type = cursor.fetchall()
print(type)

cursor.execute("SELECT name, director, rating FROM product WHERE type_id = 1")
products_cur = cursor.fetchall()

for name, director, rating in products_cur:
    print(f"Название: {name}\nРежиссёр: {director}\nРейтинг: {rating}")


cursor.close()
connection.close()