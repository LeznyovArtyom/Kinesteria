from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import uvicorn


app = FastAPI()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("MYSQLHOST"),
            port=int(os.getenv("MYSQLPORT")),
            user=os.getenv("MYSQLUSER"),
            password=os.getenv("MYSQLPASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
        )
        print("Connection successful")
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        raise

# def get_db_connection():
#     return mysql.connector.connect(
#         host="localhost",
#         port=3306,
#         user="root",
#         password="TikTakfoke86!",
#         database="Kinesteria",
#     )

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "kinesteria-production.up.railway.app"],  # Список разрешенных источников
    allow_credentials=True,
    allow_methods=["*"],  # Разрешенные методы
    allow_headers=["*"],  # Разрешенные заголовки
)


class UserLogin(BaseModel):
    login: str
    password: str


class User(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    login: str
    email: str
    password: str
    about_me: Optional[str] = None
    avatar: str
    vkontakte: Optional[str] = None
    instagram: Optional[str] = None
    telegram: Optional[str] = None
    whatsapp: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    login: Optional[str] = None
    password: Optional[str] = None
    about_me: Optional[str] = None
    avatar: Optional[str] = None
    role_id: Optional[int] = None
    vkontakte: Optional[str] = None
    instagram: Optional[str] = None
    telegram: Optional[str] = None
    whatsapp: Optional[str] = None


class Product(BaseModel):
    name: str
    description: str
    original_name: str
    director: str
    actors: str
    release_year: int
    rating: float
    image: str
    type_id: int
    genre_id: List[int]
    country_id: List[int]
    subtitles_id: List[int]
    quality_id: List[int]
    voice_acting_id: List[int]
    video_file: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    original_name: Optional[str] = None
    director: Optional[str] = None
    actors: Optional[str] = None
    release_year: Optional[int] = None
    rating: Optional[float] = None
    image: Optional[str] = None
    type_id: Optional[int] = None
    genre_id: Optional[List[int]] = None
    country_id: Optional[List[int]] = None
    subtitles_id: Optional[List[int]] = None
    quality_id: Optional[List[int]] = None
    voice_acting_id: Optional[List[int]] = None
    video_file: Optional[str] = None

class Comment(BaseModel):
    text: str
    user_id: int
    parent_comment_id: Optional[int] = None

class CommentUpdate(BaseModel):
    text: str

class Review(BaseModel):
    text: str
    user_id: int

class ReviewUpdate(BaseModel):
    text: str


app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/html", StaticFiles(directory="html"), name="html")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/images", StaticFiles(directory="images"), name="images")


@app.get("/index.html")
def get_index_page():
    return FileResponse("index.html")

@app.get("/")
def get_index():
    return FileResponse("index.html")


@app.post("/login")
def login(user: UserLogin):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id FROM user WHERE login = %s AND password = %s", (user.login, user.password))
    result = cursor.fetchone()
    cursor.close()
    if result:
        return {"user_id": result['id']}
    else:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")


# Получить список всех пользователей
@app.get("/users")
def get_users():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = """SELECT user.id, user.first_name, user.last_name, user.login, user.email, user.password, user.about_me, user.avatar, role.name as role,
                        social_media.vkontakte, social_media.instagram, social_media.telegram, social_media.whatsapp 
                    FROM user
                    LEFT JOIN social_media on user.id = social_media.user_id
                    LEFT JOIN role on user.role_id = role.id"""
    cursor.execute(sql_query)
    result = cursor.fetchall()
    cursor.close()
    return {"Users": result}


# Получить информацию о пользователе по ID
@app.get("/users/{id}")
def get_user_by_id(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = """SELECT user.id, user.first_name, user.last_name, user.login, user.email, user.password, user.about_me, user.avatar, role.name as role,
                        social_media.vkontakte, social_media.instagram, social_media.telegram, social_media.whatsapp 
                    FROM user
                    LEFT JOIN social_media on user.id = social_media.user_id
                    LEFT JOIN role on user.role_id = role.id
                    WHERE user.id = %s"""
    cursor.execute(sql_query, (id,))
    result = cursor.fetchone()
    cursor.close()
    return {"User": result}


# Удалить пользователя
@app.delete("/users/{id}/delete")
def delete_user(id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM user WHERE id = %s", (id,))
    result = cursor.fetchone()
    if result:
        cursor.execute("DELETE FROM user WHERE id = %s", (id,))
        connection.commit()
        cursor.close()
        return {"message": "Пользователь удален"}
    else:
        cursor.close()
        return {"message": "Пользователь не найден"}


# Зарегистрировать нового пользователя
@app.post("/users/register")
def register_new_user(user_data: User):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM user WHERE login = %s OR email = %s", (user_data.login, user_data.email))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        raise HTTPException(status_code=400, detail="Пользователь с таким логином или электронной почтой уже существует")

    cursor.execute("INSERT INTO user (first_name, last_name, login, email, password, avatar, role_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                   (user_data.first_name, user_data.last_name, user_data.login, user_data.email, user_data.password, user_data.avatar, 3))
    connection.commit()
    user_id = cursor.lastrowid
    cursor.close()
    return {"message": "Пользователь успешно зарегистрирован", "user_id": user_id}


# Обновить информацию о пользователе
@app.put("/users/{id}/update")
def update_user(id: int, user_data: UserUpdate):
    connection = get_db_connection()
    cursor = connection.cursor()
    # Проверяем, существует ли пользователь с указанным ID
    cursor.execute("SELECT * FROM user WHERE id = %s", (id,))
    existing_user = cursor.fetchone()

    if not existing_user:
        cursor.close()
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    user_dict = user_data.model_dump(exclude_unset=True)
    user_fields = {key: value for key, value in user_dict.items() if key in {"first_name", "last_name", "login", "email", "password", "about_me", "avatar", "role_id"}}
    social_fields = {key: value for key, value in user_dict.items() if key in {"vkontakte", "instagram", "telegram", "whatsapp"}}

    if user_fields:
        sql_update_query = "UPDATE user SET " + ", ".join([f"{field} = %s" for field in user_fields.keys()]) + " WHERE id = %s"
        cursor.execute(sql_update_query, list(user_fields.values()) + [id])
    
    if social_fields:
        sql_update_social = "UPDATE social_media SET " + ", ".join([f"{field} = %s" for field in social_fields.keys()]) + " WHERE user_id = %s"
        cursor.execute(sql_update_social, list(social_fields.values()) + [id])

    connection.commit()
    cursor.close()
    return {"message": "Пользователь успешно обновлен"}


# Получить список всех произведений
@app.get("/products/")
def get_products_by_parameters():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    sql_query = """
    SELECT product.id, product.name, product.release_year, product.rating, product.image,
            type.name as type, GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genre, 
            GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') as country, 
            GROUP_CONCAT(DISTINCT subtitles.name SEPARATOR ', ') as subtitles,
            GROUP_CONCAT(DISTINCT quality.name SEPARATOR ', ') as quality, 
            GROUP_CONCAT(DISTINCT voice_acting.name SEPARATOR ', ') as voice_acting 
    FROM product
    LEFT JOIN type on product.type_id = type.id
    LEFT JOIN product_genre on product.id = product_genre.product_id
    LEFT JOIN genre on product_genre.genre_id = genre.id
    LEFT JOIN product_country on product.id = product_country.product_id
    LEFT JOIN country on product_country.country_id = country.id
    LEFT JOIN product_subtitles on product.id = product_subtitles.product_id
    LEFT JOIN subtitles on product_subtitles.subtitles_id = subtitles.id
    LEFT JOIN product_quality on product.id = product_quality.product_id
    LEFT JOIN quality on product_quality.quality_id = quality.id
    LEFT JOIN product_voice_acting on product.id = product_voice_acting.product_id
    LEFT JOIN voice_acting on product_voice_acting.voice_acting_id = voice_acting.id
    GROUP BY product.id
    ORDER BY product.id
    """

    cursor.execute(sql_query)
    result = cursor.fetchall()
    cursor.close()
    return {"Products": result}


# Получить произведение по ID
@app.get("/products/{id}")
def get_product_by_id(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    sql_query = """
    SELECT product.id, product.name, product.description, product.original_name, product.director, 
        product.actors, product.release_year, product.rating, product.image,
        type.name as type, GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genre, 
        GROUP_CONCAT(DISTINCT country.name SEPARATOR ', ') as country, 
        GROUP_CONCAT(DISTINCT subtitles.name SEPARATOR ', ') as subtitles,
        GROUP_CONCAT(DISTINCT quality.name SEPARATOR ', ') as quality, 
        GROUP_CONCAT(DISTINCT voice_acting.name SEPARATOR ', ') as voice_acting,
        GROUP_CONCAT(DISTINCT genre.id SEPARATOR ', ') AS genre_ids,
        GROUP_CONCAT(DISTINCT country.id SEPARATOR ', ') as country_ids,
        GROUP_CONCAT(DISTINCT subtitles.id SEPARATOR ', ') as subtitles_ids,
        GROUP_CONCAT(DISTINCT quality.id SEPARATOR ', ') as quality_ids,
        GROUP_CONCAT(DISTINCT voice_acting.id SEPARATOR ', ') as voice_acting_ids
    FROM product
    LEFT JOIN type on product.type_id = type.id
    LEFT JOIN product_genre on product.id = product_genre.product_id
    LEFT JOIN genre on product_genre.genre_id = genre.id
    LEFT JOIN product_country on product.id = product_country.product_id
    LEFT JOIN country on product_country.country_id = country.id
    LEFT JOIN product_subtitles on product.id = product_subtitles.product_id
    LEFT JOIN subtitles on product_subtitles.subtitles_id = subtitles.id
    LEFT JOIN product_quality on product.id = product_quality.product_id
    LEFT JOIN quality on product_quality.quality_id = quality.id
    LEFT JOIN product_voice_acting on product.id = product_voice_acting.product_id
    LEFT JOIN voice_acting on product_voice_acting.voice_acting_id = voice_acting.id
    WHERE product.id = %s
    GROUP BY product.id
    """
    
    cursor.execute(sql_query, (id,))
    result = cursor.fetchone()
    cursor.close()
    return {"Product": result}


# Удалить произведение
@app.delete("/products/{id}/delete")
def delete_product(id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM product WHERE id = %s", (id,))
    result = cursor.fetchone()
    if result:
        cursor.execute("DELETE FROM product WHERE id = %s", (id,))
        connection.commit()
        cursor.close()
        return {"message": "Произведение удалено"}
    else:
        cursor.close()
        return {"message": "Произведение не найдено"}


# Добавить произведение
@app.post("/products/add/")
def add_new_product(product_data: Product):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""INSERT INTO product (name, description, original_name, director, actors, release_year, rating, image, type_id) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                   (product_data.name, product_data.description, product_data.original_name, product_data.director, product_data.actors,
                    product_data.release_year, product_data.rating, product_data.image, product_data.type_id))
    product_id = cursor.lastrowid

    for genre_id in product_data.genre_id:
        cursor.execute("INSERT INTO product_genre (product_id, genre_id) VALUES (%s, %s)", (product_id, genre_id))
    for country_id in product_data.country_id:
        cursor.execute("INSERT INTO product_country (product_id, country_id) VALUES (%s, %s)", (product_id, country_id))
    for subtitles_id in product_data.subtitles_id:
        cursor.execute("INSERT INTO product_subtitles (product_id, subtitles_id) VALUES (%s, %s)", (product_id, subtitles_id))
    for quality_id in product_data.quality_id:
        cursor.execute("INSERT INTO product_quality (product_id, quality_id) VALUES (%s, %s)", (product_id, quality_id))
    for voice_acting_id in product_data.voice_acting_id:
        cursor.execute("INSERT INTO product_voice_acting (product_id, voice_acting_id) VALUES (%s, %s)", (product_id, voice_acting_id))

    # Не совсем правильно (по отношению к сериалам)
    if product_data.video_file is not None:
        table_type = {1: "movies", 2: "series", 3: "cartoons"}
        cursor.execute(f"INSERT INTO {table_type[product_data.type_id]} (video_file, product_id) VALUES (%s)", (product_data.video_file, product_id))

    connection.commit()
    cursor.close()
    return {"message": "Произведение успешно добавлено"}


# Обновить информацию о произведении
@app.put("/products/{id}/update")
def update_product(id: int, product_data: ProductUpdate):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True) 

    updates = []
    values = []

    for field, value in product_data.dict(exclude_unset=True).items():
        if value is not None and field not in {'genre_id', 'country_id', 'subtitles_id', 'quality_id', 'voice_acting_id'}:
            updates.append(f"{field} = %s")
            values.append(value)

    if updates:
        sql_update_query = "UPDATE product SET " + ", ".join(updates) + " WHERE id = %s"
        values.append(id)
        cursor.execute(sql_update_query, tuple(values))

    def update_relations(table, relation_id, ids):
        cursor.execute(f"DELETE FROM {table} WHERE product_id = %s", (id,))
        for item_id in ids:
            cursor.execute(f"INSERT INTO {table} (product_id, {relation_id}) VALUES (%s, %s)", (id, item_id))

    if product_data.genre_id:
        update_relations('product_genre', 'genre_id', product_data.genre_id)
    if product_data.country_id:
        update_relations('product_country', 'country_id', product_data.country_id)
    if product_data.subtitles_id:
        update_relations('product_subtitles', 'subtitles_id', product_data.subtitles_id)
    if product_data.quality_id:
        update_relations('product_quality', 'quality_id', product_data.quality_id)
    if product_data.voice_acting_id:
        update_relations('product_voice_acting', 'voice_acting_id', product_data.voice_acting_id)

    connection.commit()
    cursor.close()
    return {"message": "Произведение успешно обновлено"}


# Получить список всех ролей
@app.get("/roles")
def get_roles():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM role")
    result = cursor.fetchall()
    cursor.close()
    return {"Roles": result}


# Получить список всех типов произведений
@app.get("/types")
def get_types():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM type")
    result = cursor.fetchall()
    cursor.close()
    return {"Types": result}


# Получить список всех жанров
@app.get("/genres")
def get_genres():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM genre")
    result = cursor.fetchall()
    cursor.close()
    return {"Genres": result}


# Получить список всех стран
@app.get("/countries")
def get_countries():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM country")
    result = cursor.fetchall()
    cursor.close()
    return {"Countries": result}


# Получить список всех наименований субтитров
@app.get("/subtitles")
def get_subtitles():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM subtitles")
    result = cursor.fetchall()
    cursor.close()
    return {"Subtitles": result}


# Получить список всех наименований качества
@app.get("/qualities")
def get_qualities():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM quality")
    result = cursor.fetchall()
    cursor.close()
    return {"Qualities": result}


# Получить список всех наименований озвучек
@app.get("/voice_acting")
def get_voice_acting():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM voice_acting")
    result = cursor.fetchall()
    cursor.close()
    return {"Voice_acting": result}


# Получить список всех комментариев произведения
@app.get("/products/{id}/comments")
def get_comments_by_product_id(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = """SELECT comments.id, comments.text, comments.date, comments.parent_comment_id, product.name as product, user.id as user_id, user.login, user.avatar 
                    FROM comments
                    LEFT JOIN user on comments.user_id = user.id
                    LEFT JOIN product on comments.product_id = product.id
                    WHERE product.id = %s"""
    cursor.execute(sql_query, (id,))
    result = cursor.fetchall()
    cursor.close()
    return {"Product": id, "Comments": result}


# Удалить комментарий
@app.delete("/comments/{id}/delete")
def delete_comment(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("DELETE FROM comments WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    return {"message": "Комментарий удален"}


# Добавить комментарий
@app.post("/products/{id}/comments/add")
def add_new_comment(id: int, comment_data: Comment):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("INSERT INTO comments (text, date, product_id, user_id, parent_comment_id) VALUES (%s, %s, %s, %s, %s)", 
                   (comment_data.text, datetime.now(), id, comment_data.user_id, comment_data.parent_comment_id))
    connection.commit()
    cursor.close()
    return {"message": "Комментарий успешно добавлен"}


# Обновить комментарий
@app.put("/comments/{id}/update")
def update_coment(id: int, comment_data: CommentUpdate):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("UPDATE comments SET text = %s WHERE id = %s", (comment_data.text, id))
    connection.commit()
    cursor.close()
    return {"message": "Комментарий успешно обновлен"}


# Получить список всех отзывов произведения
@app.get("/products/{id}/reviews")
def get_reviews_by_product_id(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    sql_query = """SELECT reviews.id, reviews.text, reviews.date, product.name as product, user.login FROM reviews
                    LEFT JOIN user on reviews.user_id = user.id
                    LEFT JOIN product on reviews.product_id = product.id
                    WHERE product.id = %s"""
    cursor.execute(sql_query, (id,))
    result = cursor.fetchall()
    cursor.close()
    return {"Product": id, "Reviews": result}


# Удалить отзыв
@app.delete("/reviews/{id}/delete")
def delete_review(id: int):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("DELETE FROM reviews WHERE id = %s", (id,))
    connection.commit()
    cursor.close()
    return {"message": "Отзыв удален"}


# Добавить отзыв
@app.post("/products/{id}/reviews/add")
def add_new_review(id: int, review_data: Review):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM reviews WHERE product_id = %s AND user_id = %s", (id, review_data.user_id))
    existing_review = cursor.fetchone()
    if existing_review:
        cursor.close()
        raise HTTPException(status_code=400, detail="Пользователь уже написал отзыв к этому произведению")

    cursor.execute("INSERT INTO reviews (text, date, product_id, user_id) VALUES (%s, %s, %s, %s)", (review_data.text, datetime.now(), id, review_data.user_id))
    connection.commit()
    cursor.close()
    return {"message": "Отзыв успешно добавлен"}


# Обновить отзыв
@app.put("/reviews/{id}/update")
def update_review(id: int, review_data: ReviewUpdate):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("UPDATE reviews SET text = %s WHERE id = %s", (review_data.text, id))
    connection.commit()
    cursor.close()
    return {"message": "Отзыв успешно обновлен"}


if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
