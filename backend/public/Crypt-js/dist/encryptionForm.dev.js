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

      document.body.appendChild(a); // Создаем кнопку для скачивания файла

      var downloadEncryptButton = document.getElementById('downloadEncryptButton');

      if (!downloadEncryptButton) {
        downloadEncryptButton = document.createElement('button');
        downloadEncryptButton.id = 'downloadEncryptButton';
        downloadEncryptButton.textContent = 'DownloadCrypt';
        document.body.appendChild(downloadEncryptButton);
      }

      downloadEncryptButton.onclick = function () {
        a.click();
      };

      document.body.appendChild(downloadEncryptButton);
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