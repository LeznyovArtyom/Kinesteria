// Отображение информации о произведении
window.onload = function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let movie_id = urlParams.get('id');

    // Получение фильма из базы данных
    if (movie_id) {
        fetch(`${link}/products/${movie_id}`)
        .then(response => response.json())
        .then(data => { 
            displayMovieDetails(data.Product);
            loadComments(movie_id); 
        })
        .catch(error => console.error('Ошибка при получении данных', error))
    }

    // Отображение информации о фильме на странице
    function displayMovieDetails(movie) {
        document.getElementById("name_movie").innerHTML = movie.name;
        document.getElementById("decription_movie").innerHTML = movie.description;
        document.getElementById("year_movie").querySelector(".value").innerHTML = movie.release_year;
        document.getElementById("country_movie").querySelector(".value").innerHTML = movie.country;
        document.getElementById("original_name_movie").querySelector(".value").innerHTML = movie.original_name;
        document.getElementById("director_movie").querySelector(".value").innerHTML = movie.director;
        document.getElementById("actors_movie").querySelector(".value").innerHTML = movie.actors;
        document.getElementById("genre_movie").querySelector(".value").innerHTML = movie.genre;
        document.getElementById("rating_movie").querySelector(".value").innerHTML = movie.rating;
        document.getElementById("image_movie").src = 'data:image/jpeg;base64,' + movie.image;
    }
};


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
    const currentUserAvatar = document.getElementById('current_user_avatar');
    const changeMovie = document.getElementById('changeMovie');
    const deleteMovie = document.getElementById('deleteMovie');
    const comment_managment = document.getElementById('comment_managment');

    const userId = getCookie('user_id');
    if (userId) {
        try {
            let response = await fetch(`${link}/users/${userId}`);

            if (response.ok) {
                let user = await response.json();
                user = user.User;
                loginButton.style.display = 'none';
                profilePicture.style.display = 'block';
                profile_image.src = user.avatar;
                currentUserAvatar.src = user.avatar;
                comment_managment.style.display = 'block';
                if (user.role === 'Админиcтратор' || user.role === 'Модератор') {
                    changeMovie.style.display = 'block';
                    deleteMovie.style.display = 'block';
                }
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


// Переход на страницу изменения произведения
document.getElementById('changeMovie').addEventListener('click', function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    window.location.href=`../html/Change_product.html?id=${product_id}`;
});


// Удалить произведение
document.getElementById('deleteMovie').addEventListener('click', function() {
    // Получение значения идентификатора из URL
    let urlParams = new URLSearchParams(window.location.search);
    let product_id = urlParams.get('id');

    fetch(`${link}/products/${product_id}/delete`, {
        method: 'DELETE',
    })
    .then(response => {
        window.location.href = "Catalog_page.html"; // Переадресация обратно на страницу каталога
    })
    .catch(error => {
        console.error('Ошибка при удалении фильма:', error);
    });
});


let parentId = null;

// Отправить комментарий
document.querySelector('.sendComment').addEventListener('click', sendComment);
function sendComment() {
    const userId = getCookie('user_id');
    const commentInputSelector = parentId ? `.reply-input textarea` : '.comment-input';

    const commentText = document.querySelector(commentInputSelector).value;
    if (commentText.trim() === '') {
        alert('Комментарий не может быть пустым');
        return;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let movie_id = urlParams.get('id');
    const commentData = {
        text: commentText,
        user_id: userId,
        parent_comment_id: parentId
    };

    fetch(`${link}/products/${movie_id}/comments/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Комментарий успешно добавлен') {
            if (parentId) {
                document.querySelector(`.reply-input textarea`).value = '';
            } else {
                document.querySelector('.comment-input').value = '';
            }
            loadComments(movie_id);
        }
    })
    .catch(error => console.error('Ошибка при добавлении комментария:', error));
}


// Отобразить все комментарии
function loadComments(movie_id) {
  fetch(`${link}/products/${movie_id}/comments`)
      .then(response => response.json())
      .then(data => {
          const commentsWrapper = document.getElementById('comments-wrapper');
          commentsWrapper.innerHTML = '';

          const topLevelComments = data.Comments.filter(comment => !comment.parent_comment_id);
          topLevelComments.forEach(comment => {
            const commentNode = createCommentNode(comment);
            commentsWrapper.prepend(commentNode);

            const replies = data.Comments.filter(reply => reply.parent_comment_id === comment.id);
            replies.forEach(reply => {
                const replyNode = createReplyNode(reply);
                commentNode.querySelector('.replies').append(replyNode);
            });
          });
      })
      .catch(error => console.error('Ошибка при загрузке комментариев:', error));
}


// Сформировать один комментарий
function createCommentNode(comment) {
  const template = document.getElementById('comment-template').content.cloneNode(true);
  const commentNode = template.querySelector('.comment');
  commentNode.querySelector('.user-image').src = comment.avatar;
  commentNode.querySelector('.user-name').textContent = comment.login;
  commentNode.querySelector('.comment-at').textContent = timeAgo(comment.date);
  commentNode.querySelector('.c-text').textContent = comment.text;
  commentNode.dataset.commentId = comment.id;

  const userId = getCookie('user_id');

  if (comment.user_id == userId) {
    // Создаем новый элемент
    const newControls = document.createElement('div');
    newControls.classList.add('c-controls');
    newControls.innerHTML = `
        <a class="edit text-decoration-none"><img src="../images/icon-edit.svg" alt="" class="control-icon me-2" />Изменить</a>
        <a class="delete text-decoration-none"><img src="../images/icon-delete.svg" alt="" class="control-icon me-2" />Удалить</a>
    `;

    // Находим место для вставки
    const commentBody = commentNode.querySelector('.comment-body');
    // Вставляем новый элемент
    commentBody.appendChild(newControls);

    commentNode.querySelector('.edit').addEventListener('click', () => {
        editComment(commentNode, comment.id);
    });

    commentNode.querySelector('.delete').addEventListener('click', () => {
        deleteComment(commentNode, comment.id);
    });
  } else if (userId) {
    // Создаем новый элемент
    const newControls = document.createElement('div');
    newControls.classList.add('c-controls');
    newControls.innerHTML = `
        <a class="reply text-decoration-none"><img src="../images/icon-reply.svg" alt="" class="control-icon me-2" />Ответить</a>
    `;

    // Находим место для вставки
    const commentBody = commentNode.querySelector('.comment-body');
    // Вставляем новый элемент
    commentBody.appendChild(newControls);

    commentNode.querySelector('.reply').addEventListener('click', () => {
        spawnReplyInput(commentNode, comment.id);
    });
  }

  return commentNode;
}


function createReplyNode(comment) {
    const template = document.getElementById('comment-reply-template').content.cloneNode(true);
    const commentNode = template.querySelector('.comment');
    commentNode.querySelector('.user-image').src = comment.avatar;
    commentNode.querySelector('.user-name').textContent = comment.login;
    commentNode.querySelector('.comment-at').textContent = timeAgo(comment.date);
    commentNode.querySelector('.c-text').textContent = comment.text;
    commentNode.dataset.commentId = comment.id;

    const userId = getCookie('user_id');

    if (comment.user_id == userId) {
        // Создаем новый элемент
        const newControls = document.createElement('div');
        newControls.classList.add('c-controls');
        newControls.innerHTML = `
            <a class="edit text-decoration-none"><img src="../images/icon-edit.svg" alt="" class="control-icon me-2" />Изменить</a>
            <a class="delete text-decoration-none"><img src="../images/icon-delete.svg" alt="" class="control-icon me-2" />Удалить</a>
        `;

        // Находим место для вставки
        const commentBody = commentNode.querySelector('.comment-body');
        // Вставляем новый элемент
        commentBody.appendChild(newControls);

        commentNode.querySelector('.edit').addEventListener('click', () => {
            editComment(commentNode, comment.id);
        });

        commentNode.querySelector('.delete').addEventListener('click', () => {
            deleteComment(commentNode, comment.id);
        });
    } else if (userId) {
        // Создаем новый элемент
        const newControls = document.createElement('div');
        newControls.classList.add('c-controls');
        newControls.innerHTML = `
            <a class="reply text-decoration-none"><img src="../images/icon-reply.svg" alt="" class="control-icon me-2" />Ответить</a>
        `;

        // Находим место для вставки
        const commentBody = commentNode.querySelector('.comment-body');
        // Вставляем новый элемент
        commentBody.appendChild(newControls);

        commentNode.querySelector('.reply').addEventListener('click', () => {
            spawnReplyInput(commentNode, comment.parent_comment_id || comment.id);
        });
    }

    return commentNode;
}


function spawnReplyInput(parentNode, parentId) {
    const existingReplyInput = parentNode.querySelector('.reply-input');
    if (existingReplyInput) {
        existingReplyInput.remove();
    }

    const template = document.getElementById('reply-input-template').content.cloneNode(true);
    const replyInputNode = template.querySelector('.reply-input');
    replyInputNode.querySelector('.user-image').src = document.getElementById('current_user_avatar').src;

    parentNode.append(replyInputNode);

    replyInputNode.querySelector('.sendComment').addEventListener('click', () => {
        const replyText = replyInputNode.querySelector('.comment-input').value;
        if (replyText.trim() === '') {
            alert('Ответ не может быть пустым');
            return;
        }

        const userId = getCookie('user_id');
        if (!userId) {
            alert('Вы должны быть авторизованы для ответа на комментарии');
            return;
        }

        let urlParams = new URLSearchParams(window.location.search);
        let movie_id = urlParams.get('id');

        const replyData = {
            text: replyText,
            user_id: userId,
            parent_comment_id: parentId
        };

        fetch(`${link}/products/${movie_id}/comments/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Комментарий успешно добавлен') {
                loadComments(movie_id);
            }
        })
        .catch(error => console.error('Ошибка при добавлении ответа:', error));
    });
}


// Изменить комментарий
function editComment(commentNode, commentId) {
  const commentText = commentNode.querySelector('.c-text');
  const originalText = commentText.textContent;
  commentText.contentEditable = true;
  commentText.focus();

  commentText.addEventListener('blur', () => {
      commentText.contentEditable = false;
      if (commentText.textContent !== originalText) {
          const updatedText = commentText.textContent;
          const updateData = {
              text: updatedText
          };

          fetch(`${link}/comments/${commentId}/update`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
          })
          .then(response => response.json())
          .then(data => {
              if (data.message === 'Комментарий успешно обновлен') {
                  // Перезагружаем комментарии после обновления
                  let urlParams = new URLSearchParams(window.location.search);
                  let movie_id = urlParams.get('id');
                  loadComments(movie_id);
              }
          })
          .catch(error => console.error('Ошибка при обновлении комментария:', error));
      }
  });
}


// Удалить комментарий
function deleteComment(commentNode, commentId) {
  if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      fetch(`${link}/comments/${commentId}/delete`, {
          method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
          if (data.message === 'Комментарий удален') {
              commentNode.remove();
          }
      })
      .catch(error => console.error('Ошибка при удалении комментария:', error));
  }
}


// Преобразование даты datetime в относительное время 
function timeAgo(dateString) {
  const now = new Date();
  const pastDate = new Date(dateString);
  const secondsAgo = Math.floor((now - pastDate) / 1000);

  if (secondsAgo <= 0) {
    return "Только что";
  }

  let interval = Math.floor(secondsAgo / 31536000);
    if (interval >= 1) {
        return interval + (interval === 1 ? " год назад" : " лет назад");
    }
    interval = Math.floor(secondsAgo / 2592000);
    if (interval >= 1) {
        return interval + (interval === 1 ? " месяц назад" : " месяцев назад");
    }
    interval = Math.floor(secondsAgo / 86400);
    if (interval >= 1) {
        return interval + (interval === 1 ? " день назад" : " дней назад");
    }
    interval = Math.floor(secondsAgo / 3600);
    if (interval >= 1) {
        return interval + (interval === 1 ? " час назад" : " часов назад");
    }
    interval = Math.floor(secondsAgo / 60);
    if (interval >= 1) {
        return interval + (interval === 1 ? " минуту назад" : " минут назад");
    }
    return Math.floor(secondsAgo) + (secondsAgo === 1 ? " секунду назад" : " секунд назад");
}