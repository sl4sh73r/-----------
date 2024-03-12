"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var _require = require('child_process'),
    exec = _require.exec;

var path = require('path'); // console.log(path.join(__dirname, 'public', 'index.html'),"FilePath");


var fs = require('fs');

var multer = require('multer');

var app = express();
var port = 3000;
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Сохраняем файлы в папку 'uploads' в корневой директории проекта
  },
  filename: function filename(req, file, cb) {
    // Заменяем все не-ASCII символы на "_"
    var safeFilename = file.originalname.replace(/[^\x20-\x7E]/g, "_");
    cb(null, safeFilename);
  }
});
var upload = multer({
  storage: storage
});

function logToFile(message) {
  fs.appendFile('server-log.txt', message + '\n', function (err) {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

app.use(bodyParser.json());
app.use(express["static"](path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.post('/check-input-type-Encryption', function (req, res) {
  var inputTypeEncryption = req.body.inputTypeEncryption; // console.log(inputTypeEncryption)

  var isFile = inputTypeEncryption === 'file'; // console.log(isFile);

  res.json({
    isFile: isFile
  });
});
app.post('/upload-Encryption', upload.single('fileEncryption'), function (req, res) {
  var relativePath = path.relative(__dirname, req.file.path);
  res.json({
    status: 'File uploaded',
    filePath: relativePath,
    filename: req.file.originalname
  });
});
app.post('/encrypt', function (req, res) {
  var _req$body = req.body,
      plaintext = _req$body.plaintext,
      key = _req$body.key,
      algorithm = _req$body.algorithm,
      inputTypeEncryption = _req$body.inputTypeEncryption,
      filePath = _req$body.filePath;
  var isFile = inputTypeEncryption === 'file';
  var fileOrPlaintext = isFile ? filePath : plaintext;
  console.log("python3 algorithms/", algorithm, isFile ? '/FileCrypt' : '', fileOrPlaintext, key);
  var command = "python3 algorithms/".concat(algorithm).concat(isFile ? '/FileCrypt' : '', "/encrypt.py \"").concat(fileOrPlaintext, "\" \"").concat(key, "\"");
  executePythonScript(command).then(function (output) {
    if (isFile) {
      // Если ввод - это файл, возвращаем имя файла
      res.json({
        filename: output
      });
    } else {
      // Если ввод - это текст, возвращаем зашифрованный текст
      res.json({
        encryptedText: output
      });
    }
  })["catch"](function (error) {
    console.error('Произошла ошибка:', error);
    res.status(500).send('Произошла ошибка при выполнении Python скрипта');
  });
});
app.get('/download-file-Encryption/*', function (req, res) {
  var fileName = req.params[0]; // Получаем путь к файлу из URL

  console.log('Requested file:', fileName);
  var filePath = path.join(__dirname, fileName);
  console.log('Full file path:', filePath);
  fs.access(filePath, fs.constants.F_OK, function (err) {
    if (err) {
      console.error('File does not exist:', filePath);
      res.status(404).send('File not found');
    } else {
      res.download(filePath);
    }
  });
});

function executePythonScript(command) {
  return new Promise(function (resolve, reject) {
    exec(command, function (error, stdout, stderr) {
      if (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F Python \u0441\u043A\u0440\u0438\u043F\u0442\u0430: ".concat(error));
        reject(error);
      } else if (stderr) {
        console.error("Python \u0441\u043A\u0440\u0438\u043F\u0442 \u0432\u0435\u0440\u043D\u0443\u043B \u043E\u0448\u0438\u0431\u043A\u0443: ".concat(stderr));
        reject(new Error(stderr));
      } else {
        resolve(stdout.trim()); // Удаляем лишние пробелы и переносы строки
      }
    });
  });
}

app.post('/check-input-type-Decryption', function (req, res) {
  var inputTypeDecryption = req.body.inputTypeDecryption;
  var isFile = inputTypeDecryption === 'file';
  res.json({
    isFile: isFile
  });
});
app.post('/upload-Decryption', upload.single('fileDecryption'), function (req, res) {
  var relativePath = path.relative(__dirname, req.file.path);
  console.log("Путь к файлу:", req.file); // res.json({ status: 'File uploaded', filePath: req.file.path });

  res.json({
    status: 'File uploaded',
    filePath: relativePath,
    filename: req.file.originalname
  });
});
app.post('/decrypt', function (req, res) {
  var _req$body2 = req.body,
      ciphertext = _req$body2.encryptedtext,
      key = _req$body2.decryptionkey,
      algorithm = _req$body2.decryptionalgorithm,
      inputTypeDecryption = _req$body2.inputTypeDecryption,
      filePath = _req$body2.filePath; //console.log("Decrypt-body info: ",req.body)

  var isFile = inputTypeDecryption === 'file'; //console.log(isFile);

  var fileOrCiphertext = isFile ? filePath : ciphertext; //console.log("python3 algorithms/",algorithm,isFile ? '/FileCrypt' : '',"/decrypt.py",fileOrCiphertext,key);

  var command = "python3 algorithms/".concat(algorithm).concat(isFile ? '/FileCrypt' : '', "/decrypt.py \"").concat(fileOrCiphertext, "\" \"").concat(key, "\""); //console.log("Command to execute: ", command); // Логируем команду, которую собираемся выполнить

  executePythonScript(command).then(function (output) {
    //console.log("Output from python script: ", output); // Логируем вывод из скрипта Python
    if (isFile) {
      // Если ввод - это файл, возвращаем имя файла
      res.json({
        filename: output
      });
    } else {
      // Если ввод - это текст, возвращаем расшифрованный текст
      res.json({
        decryptedText: output
      });
    }
  })["catch"](function (error) {
    console.error('Произошла ошибка:', error);
    res.status(500).send('Произошла ошибка при выполнении Python скрипта');
  });
});
app.get('/download-file-Decryption/*', function (req, res) {
  var fileName = req.params[0];
  var filePath = path.join(__dirname, fileName);
  fs.access(filePath, fs.constants.F_OK, function (err) {
    if (err) {
      console.error('File does not exist:', filePath);
      res.status(404).send('File not found');
    } else {
      res.download(filePath);
    }
  });
});
app.listen(port, function () {
  console.log("Server is running at http://localhost:".concat(port));
  logToFile("Server is running at http://localhost:".concat(port));
});