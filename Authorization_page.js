const form = document.getElementById('authorization_form');
const login = document.getElementById('login');
const password = document.getElementById('password');
const rememberCheckbox = document.getElementById('rememberCheckbox');


form.addEventListener("submit", e => {
   e.preventDefault();

   if (checkUser()) {
      window.location.href = "Main_page.html";
   }
});

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

const checkUser = () => {
   const login_value = login.value.trim();
   const password_value = password.value.trim();

   // Проверка наличия пользователя в localStorage
   const users = JSON.parse(localStorage.getItem('users')) || [];
   const existingUser = users.find(user => user.login === login_value && user.password === password_value);

   if (login_value === '') {
        setError(login, "Введите логин");
   } else {
        removeError(login);
   }
   if (password_value === '') {
        setError(password, "Введите пароль");
   } else {
        removeError(password);
   }

   if (existingUser) {
      alert("Вы вошли в аккаунт!");
   } else {
      alert("Введен неправильный логин или пароль!");
   }

   return existingUser;
}