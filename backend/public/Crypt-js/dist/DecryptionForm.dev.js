"use strict";

document.getElementById('decryptionForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var formData = new FormData(this);
  var inputTypeDecryption = formData.get('inputTypeDecryption'); // const encryptedtext = formData.get('encryptedtext');

  if (inputTypeDecryption === 'file') {
    // Скрываем результат дешифрования текста
    var decryptionResult = document.getElementById('decryptionResult');
    decryptionResult.style.display = 'none';
    fetch('/upload-Decryption', {
      method: 'POST',
      body: formData
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      return response.json();
    }).then(function (data) {
      var decryptionkey = formData.get('decryptionkey');
      var decryptionalgorithm = formData.get('decryptionalgorithm');
      return fetch('/decrypt', {
        method: 'POST',
        body: JSON.stringify({
          encryptedtext: encryptedtext,
          decryptionkey: decryptionkey,
          decryptionalgorithm: decryptionalgorithm,
          inputTypeDecryption: inputTypeDecryption,
          filePath: data.filePath
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      // const decryptionResult = document.getElementById('decryptionResult');
      // const decryptionResultText = document.getElementById('decryptionResultText');
      // decryptionResultText.textContent = data.decryptedText;
      // decryptionResult.style.display = 'block';
      // Здесь мы добавляем вызов fetch к эндпоинту /download-file/:fileName
      return fetch("/download-file-Decryption/".concat(data.filename));
    }).then(function (response) {
      return response.blob();
    }).then(function (blob) {
      var decryptionalgorithm = formData.get('decryptionalgorithm');
      var file = formData.get('fileDecryption'); // Получаем файл из formData

      var originalFileName = file.name;
      originalFileName = originalFileName.replace("_" + decryptionalgorithm, "");
      originalFileName = originalFileName.replace(".enc", "");
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = originalFileName; // Имя файла для скачивания

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
      } // Создаем кнопку для скачивания файла


      var downloadDecryptButton = document.getElementById('downloadDecryptButton');

      if (!downloadDecryptButton) {
        downloadDecryptButton = document.createElement('button');
        downloadDecryptButton.id = 'downloadDecryptButton';
        downloadDecryptButton.className = 'download-button'; // Добавьте класс

        downloadDecryptButton.innerHTML = '<i class="fas fa-download"></i>'; // Используйте иконку вместо текста
        // Обновляем стиль кнопки при создании

        updateButtonStyle(downloadDecryptButton);
      }

      downloadDecryptButton.onclick = function () {
        a.click();
      };

      var buttonContainer = document.querySelector('.button-decrypt-container');
      buttonContainer.appendChild(downloadDecryptButton); // Обновляем стиль кнопки при изменении темы

      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addListener(function () {
          return updateButtonStyle(downloadDecryptButton);
        });
      }
    })["catch"](function (error) {
      console.error('Произошла ошибка:', error);
    });
  } else {
    //Если тип ввода - это текст, сразу шифруем
    var decryptionkey = formData.get('decryptionkey');
    var decryptionalgorithm = formData.get('decryptionalgorithm');

    var _encryptedtext = formData.get('encryptedtext');

    fetch('/decrypt', {
      method: 'POST',
      body: JSON.stringify({
        encryptedtext: _encryptedtext,
        decryptionkey: decryptionkey,
        decryptionalgorithm: decryptionalgorithm,
        inputTypeDecryption: inputTypeDecryption
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      var decryptionResult = document.getElementById('decryptionResult');
      var decryptionResultText = document.getElementById('decryptionResultText');
      decryptionResultText.textContent = data.decryptedText;
      decryptionResult.style.display = 'block';
    })["catch"](function (error) {
      console.error('Произошла ошибка:', error);
    });
  }
});