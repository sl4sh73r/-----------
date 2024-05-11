"use strict";

function togglePasswordVisibility(inputId, iconId) {
  var passwordInput = document.getElementById(inputId);
  var toggleIcon = document.getElementById(iconId);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = "password";
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
  }
}

function checkInputValue(inputId, iconId) {
  var passwordInput = document.getElementById(inputId);
  var formGroup = passwordInput.parentElement;
  var toggleIcon = document.getElementById(iconId);

  if (passwordInput.value) {
    formGroup.classList.add('has-text');
    toggleIcon.style.left = '50%'; // обновляет положение иконки
  } else {
    formGroup.classList.remove('has-text');
    toggleIcon.style.left = '30%'; // возвращает иконку на исходное положение
  }
} // Call checkInputValue on every input event


document.getElementById('key').addEventListener('input', checkInputValue);