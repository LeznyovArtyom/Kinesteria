const form = document.getElementById('authorization_form');
const login = document.getElementById('login');
const password = document.getElementById('password');
const rememberCheckbox = document.getElementById('rememberCheckbox');


// Слушаем кнопку "Авторизация"
form.addEventListener("submit", async e => {
   e.preventDefault();

   let login_value = login.value.trim();
   let password_value = password.value.trim();

   if (validateInputs(login_value, password_value)) {
      await authenticateUser(login_value, password_value);
   }
});


// Добавляем текстовое предупреждение
const setError = (element, message) => {
   const inputControl = element.parentElement;
   const errorDisplay = inputControl.querySelector('.error');
   
   errorDisplay.innerText = message;
   inputControl.classList.add('error');
}


// Удаляем текстовое предупреждение
const removeError = (element) => {
   const inputControl = element.parentElement;
   const errorDisplay = inputControl.querySelector('.error');
   
   errorDisplay.innerText = '';
   inputControl.classList.remove('error');
}


// Проверяем наличие полей ввода
const validateInputs = (login_value, password_value) => {
   let result = true;

   if (login_value === '') {
      setError(login, "Введите логин");
      result = false;
   } else {
      removeError(login);
   }
   
   if (password_value === '') {
      setError(password, "Введите пароль");
      result = false;
   } else {
      removeError(password);
   }

   return result;
}


const authenticateUser = async (login_value, password_value) => {
   try {
      let response = await fetch(`${link}/login`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            'login': login_value,
            'password': password_value
         })
      });

      if (response.ok) {
         let data = await response.json();
         setCookie('user_id', data.user_id, { 'max-age': 86400 }); // Сохранение id пользователя в куки
         // alert("Вы вошли в аккаунт!");
         window.location.href = "../html/Main_page.html";
      } else {
         let errorData = await response.json();
         alert(errorData.detail);
      }
   } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при авторизации. Попробуйте еще раз.');
   }
}

// Функция установки куки
const setCookie = (name, value, options = {}) => {
   options = {
      path: '/',
      ...options
   };

   if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
   }

   let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

   for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
         updatedCookie += "=" + optionValue;
      }
   }

   document.cookie = updatedCookie;
}

// Функция получения куки
const getCookie = (name) => {
   let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
   ));
   return matches ? decodeURIComponent(matches[1]) : undefined;
}