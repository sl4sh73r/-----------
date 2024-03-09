"use strict";

document.getElementById('encryptionForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var formData = new FormData(this);
  var inputTypeEncryption = formData.get('inputTypeEncryption');
  var plaintext = formData.get('plaintext');

  if (inputTypeEncryption === 'file') {
    var encryptionResult = document.getElementById('encryptionResult');
    encryptionResult.style.display = 'none';
    fetch('/upload-Encryption', {
      method: 'POST',
      body: formData
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      return response.json();
      console.log("Success-upload-on-site");
    }).then(function (data) {
      var key = formData.get('key');
      var algorithm = formData.get('algorithm');
      return fetch('/encrypt', {
        method: 'POST',
        body: JSON.stringify({
          plaintext: plaintext,
          key: key,
          algorithm: algorithm,
          inputTypeEncryption: inputTypeEncryption,
          filePath: data.filePath
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      // Здесь мы добавляем вызов fetch к эндпоинту /download-file/:fileName
      return fetch("/download-file-Encryption/".concat(data.filename));
    }).then(function (response) {
      return response.blob();
    }).then(function (blob) {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a'); // Получаем файл из формы

      var file = formData.get('fileEncryption'); // Используем 'fileEncryption' как имя поля ввода файла // Замените 'fileInputFieldName' на имя поля ввода файла в вашей форме

      var originalFileName = file.name; // Получаем имя исходного файла

      var algorithm = formData.get('algorithm');
      a.style.display = 'none';
      a.href = url;
      a.download = originalFileName + "_" + algorithm + ".enc"; // Имя файла для скачивания

      document.body.appendChild(a); // Функция для обновления стиля кнопки в зависимости от темы

      function updateButtonStyle(button) {
        var isDarkTheme = document.body.classList.contains('dark-theme');

        if (isDarkTheme) {
          button.classList.remove('light-theme');
          button.classList.add('dark-theme');
        } else {
          button.classList.remove('dark-theme');
          button.classList.add('light-theme');
        }
      }

      var downloadEncryptButton = document.getElementById('downloadEncryptButton');

      if (!downloadEncryptButton) {
        downloadEncryptButton = document.createElement('button');
        downloadEncryptButton.id = 'downloadEncryptButton';
        downloadEncryptButton.className = 'download-button'; // Добавьте класс

        downloadEncryptButton.innerHTML = '<i class="fas fa-download"></i>'; // Используйте иконку вместо текста
        // Обновляем стиль кнопки при создании

        updateButtonStyle(downloadEncryptButton);
      }

      downloadEncryptButton.onclick = function () {
        a.click();
      };

      var buttonContainer = document.querySelector('.button-encrypt-container');
      buttonContainer.appendChild(downloadEncryptButton); // Обновляем стиль кнопки при изменении темы

      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addListener(function () {
          return updateButtonStyle(downloadEncryptButton);
        });
      }
    })["catch"](function (error) {
      console.error('Произошла ошибка:', error);
    });
  } else {
    // Если тип ввода - это текст, сразу шифруем
    var key = formData.get('key');
    var algorithm = formData.get('algorithm');

    var _plaintext = formData.get('plaintext');

    fetch('/encrypt', {
      method: 'POST',
      body: JSON.stringify({
        plaintext: _plaintext,
        key: key,
        algorithm: algorithm,
        inputTypeEncryption: inputTypeEncryption
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      var encryptionResult = document.getElementById('encryptionResult');
      var encryptionResultText = document.getElementById('encryptionResultText');
      encryptionResultText.textContent = data.encryptedText;
      encryptionResult.style.display = 'block';
    })["catch"](function (error) {
      console.error('Произошла ошибка:', error);
    });
  }
});