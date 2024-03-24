const form = document.getElementById('registration_form');
const last_name = document.getElementById('last_name');
const first_name = document.getElementById('first_name');
const login = document.getElementById('login');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const agreeCheckbox = document.getElementById('agreeCheckbox');


form.addEventListener("submit", e => {
   e.preventDefault();

   let userInputs = getUserInputs();
   if (validateInputs(userInputs)) {
         addUser(userInputs);
   };
});

function getUserInputs() {
   const userInputs = {
      last_name: last_name.value.trim(),
      first_name: first_name.value.trim(),
      login: login.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
      password2: password2.value.trim()
   }
   return userInputs;
}

const setError = (element, message) => {
   const inputControl = element.parentElement;
   const errorDisplay = inputControl.querySelector('.error');
   
   errorDisplay.innerText = message;
   inputControl.classList.add('error');
}

const removeError = (element) => {
   const inputControl = element.parentElement;
   const errorDisplay = inputControl.querySelector('.error');
   
   errorDisplay.innerText = '';
   inputControl.classList.remove('error');
}

const validateInputs = (userInputs) => {
   let login_value = userInputs.login;
   let email_value = userInputs.email;
   let password_value = userInputs.password;
   let password2_value = userInputs.password2;

   let result = true;

   if (login_value === '') {
      setError(login, "Введите логин");
      result = false;
   } else if (!validateLogin(login_value)){
      setError(login, "Логин должен включать хотя бы 1 латинскую букву и иметь длину от 6 до 24 символов");
      result = false;
   } else {
      removeError(login);
   }

   if (email_value === '') {
      setError(email, "Введите электронную почту");
      result = false;
   } else if (!validateEmail(email_value)) {
      setError(email, "Введите корректную электронную почту");
      result = false;
   } else {
      removeError(email);
   }

   if (password_value === '') {
      setError(password, "Введите пароль");
      result = false;
   } else if (!validatePassword(password_value)) {
      setError(password, "Пароль должен включать в себя хотя бы одну цифру и латинскую букву, длина должна быть от 6 до 32 символов");
      result = false;
   } else {
      removeError(password);
   }

   if (password2_value === '') {
      setError(password2, "Введите пароль");
      result = false;
   } else if (password2_value !== password_value) {
      setError(password2, "Пароли должны совпадать");
      result = false;
   } else {
      removeError(password2);
   }

   if (!agreeCheckbox.checked) {
      setError(agreeCheckbox, "Вы должны согласиться с условиями ресурса");
      result = false;
   } else {
      removeError(agreeCheckbox);
   }

   // Проверка наличия пользователя в localStorage
   const users = JSON.parse(localStorage.getItem('users')) || [];
   const existingUser = users.find(user => user.login === login_value || user.email === email_value);
   if (existingUser) {
      alert('Пользователь с таким логином или электронной почтой уже существует');
      result = false;
   }

   return result;
}

function addUser(userInputs) {
   let last_name_value = userInputs.last_name;
   let first_name_value = userInputs.first_name;
   let login_value = userInputs.login;
   let email_value = userInputs.email;
   let password_value = userInputs.password;

   const users = JSON.parse(localStorage.getItem('users')) || [];
   const newUser = {
      last_name: last_name_value,
      first_name: first_name_value,
      login: login_value,
      email: email_value,
      password: password_value
   };
   users.push(newUser);
   localStorage.setItem('users', JSON.stringify(users));
   alert('Вы успешно зарегистрировались!');
   form.reset(); // Сбросить форму после успешной регистрации
   window.location.href = "Main_page.html"
}

function validateLogin(login_value) {
   return 6 <= login_value.length && login_value.length <= 24 && /.*[A-Za-z].*/.test(login_value);
}
function validateEmail(email_value) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email_value).toLowerCase());
}
function validatePassword(password_value) {
    return /^(?=.*[a-zA-Z])(?=.*\d).{6,32}$/.test(password_value);
}