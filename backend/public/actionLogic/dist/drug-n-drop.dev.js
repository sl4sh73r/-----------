"use strict";

window.onload = function () {
  var dropZone = document.getElementById('drop_zone');
  var fileInput = document.getElementById('fileEncryption');
  var fileInfo = document.getElementById('fileInfo');
  var uploadStatus = document.getElementById('uploadStatus'); // При перетаскивании файла в зону

  dropZone.ondragover = function (event) {
    event.preventDefault();
    this.style.background = '#999';
  }; // Когда файл покидает зону


  dropZone.ondragleave = function () {
    this.style.background = 'none';
  }; // Когда файл отпущен в зону


  dropZone.ondrop = function (event) {
    event.preventDefault();
    this.style.background = 'none';
    var files = event.dataTransfer.files;
    fileInput.files = files; // Имитация процесса загрузки

    uploadStatus.textContent = 'Uploading...';
    setTimeout(function () {
      uploadStatus.textContent = 'Done!';
      dropZone.className = 'drop-zone done';
    }, 1000); // Задержка в 2 секунды
    // Обновление информации о файле

    updateFileInfo();
  }; // Обновление информации о файле при выборе нового файла через input


  fileInput.onchange = updateFileInfo;

  function updateFileInfo() {
    if (fileInput.files.length > 0) {
      var fileName = fileInput.files[0].name;
      fileInfo.textContent = 'File: ' + fileName;
    }
  }

  var dropZoneDecryption = document.getElementById('drop_zone_decryption');
  var fileInputDecryption = document.getElementById('fileDecryption');
  var fileInfoDecryption = document.getElementById('fileInfoDecryption');
  var uploadStatusDecryption = document.getElementById('uploadStatusDecryption'); // При перетаскивании файла в зону

  dropZoneDecryption.ondragover = function (event) {
    event.preventDefault();
    this.style.background = '#999';
  }; // Когда файл покидает зону


  dropZoneDecryption.ondragleave = function () {
    this.style.background = 'none';
  }; // Когда файл отпущен в зону


  dropZoneDecryption.ondrop = function (event) {
    event.preventDefault();
    this.style.background = 'none';
    var files = event.dataTransfer.files;
    fileInputDecryption.files = files; // Имитация процесса загрузки

    uploadStatusDecryption.textContent = 'Uploading...';
    setTimeout(function () {
      uploadStatusDecryption.textContent = 'Done!';
      dropZoneDecryption.className = 'drop-zone done';
    }, 1000); // Задержка в 2 секунды
    // Обновление информации о файле

    updateFileInfoDecryption();
  }; // Обновление информации о файле при выборе нового файла через input


  fileInputDecryption.onchange = updateFileInfoDecryption;

  function updateFileInfoDecryption() {
    if (fileInputDecryption.files.length > 0) {
      var fileName = fileInputDecryption.files[0].name;
      fileInfoDecryption.textContent = 'File: ' + fileName;
    }
  }
};