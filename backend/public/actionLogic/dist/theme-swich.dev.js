"use strict";

document.getElementById('theme-toggle').addEventListener('click', function () {
  // Переключение темы
  document.body.classList.toggle('dark-theme');
  var buttons = document.getElementsByTagName('button');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.toggle('dark-theme');
  } // Добавление переключения темы для .header1


  var headers = document.querySelectorAll('.header1');
  headers.forEach(function (header) {
    return header.classList.toggle('dark-theme');
  }); // Добавление переключения темы для .drop-zone

  var dropZones = document.querySelectorAll('.drop-zone');
  dropZones.forEach(function (dropZone) {
    return dropZone.classList.toggle('dark-theme');
  }); // Добавление переключения темы для .form-group-key

  var formGroupKeys = document.querySelectorAll('.form-group-key');
  formGroupKeys.forEach(function (formGroupKey) {
    return formGroupKey.classList.toggle('dark-theme');
  }); // Добавление переключения темы для .form-group-select

  var formGroupSelects = document.querySelectorAll('.form-group-select');
  formGroupSelects.forEach(function (formGroupSelect) {
    return formGroupSelect.classList.toggle('dark-theme');
  }); // Переключение иконки

  var themeIcon = document.getElementById('theme-icon');

  if (themeIcon.classList.contains('fa-sun')) {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
});

function toggleInputType(formType) {
  var inputType = document.getElementById("inputType".concat(formType.charAt(0).toUpperCase() + formType.slice(1))).value;
  document.getElementById("".concat(formType, "TextGroup")).style.display = inputType === 'text' ? 'block' : 'none';
  document.getElementById("".concat(formType, "FileGroup")).style.display = inputType === 'file' ? 'block' : 'none';
}

document.querySelector('.encrypt_button').addEventListener('click', function () {
  var icon = this.querySelector('i');

  if (icon.classList.contains('fa-lock-open')) {
    icon.classList.remove('fa-lock-open');
    icon.classList.add('fa-lock'); // Иконка закрытого замка

    setTimeout(function () {
      icon.classList.remove('fa-lock');
      icon.classList.add('fa-lock-open'); // Иконка открытого замка
    }, 1000); // Задержка в 1 секунду
  }
});
document.querySelector('.decrypt_button').addEventListener('click', function () {
  var icon = this.querySelector('i');

  if (icon.classList.contains('fa-lock')) {
    icon.classList.remove('fa-lock');
    icon.classList.add('fa-lock-open'); // Иконка открытого замка

    setTimeout(function () {
      icon.classList.remove('fa-lock-open');
      icon.classList.add('fa-lock'); // Иконка закрытого замка
    }, 1000); // Задержка в 1 секунду
  }
});