const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
// console.log(path.join(__dirname, 'public', 'index.html'),"FilePath");
const fs = require('fs');
const multer = require('multer');


const app = express();
const port = 3000;


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')) // Сохраняем файлы в папку 'uploads' в корневой директории проекта
  },
  filename: function (req, file, cb) {
    // Заменяем все не-ASCII символы на "_"
    const safeFilename = file.originalname.replace(/[^\x20-\x7E]/g, "_");
    cb(null, safeFilename)
  }
})

const upload = multer({ storage: storage })


function logToFile(message) {
  fs.appendFile('server-log.txt', message + '\n', err => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});




app.post('/check-input-type-Encryption', function (req, res) {
  const { inputTypeEncryption } = req.body;
  // console.log(inputTypeEncryption)
  const isFile = inputTypeEncryption === 'file';
  // console.log(isFile);
  res.json({ isFile });
});

app.post('/upload-Encryption', upload.single('fileEncryption'), function (req, res) {
  const relativePath = path.relative(__dirname, req.file.path);
  res.json({ status: 'File uploaded', filePath: relativePath, filename: req.file.originalname });
});


app.post('/encrypt', function (req, res) {
    const { plaintext, key, algorithm, inputTypeEncryption, filePath} = req.body;
    const isFile = inputTypeEncryption === 'file';
    const fileOrPlaintext = isFile ? filePath : plaintext;
    console.log("python3 algorithms/",algorithm,isFile ? '/FileCrypt' : '',fileOrPlaintext,key);
    const command = `python3 algorithms/${algorithm}${isFile ? '/FileCrypt' : ''}/encrypt.py "${fileOrPlaintext}" "${key}"`;

    executePythonScript(command)
    .then(output => {
        if (isFile) {
            // Если ввод - это файл, возвращаем имя файла
            res.json({ filename: output });
        } else {
            // Если ввод - это текст, возвращаем зашифрованный текст
            res.json({ encryptedText: output });
        }
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
        res.status(500).send('Произошла ошибка при выполнении Python скрипта');
    });
});

app.get('/download-file-Encryption/*', function (req, res) {
  const fileName = req.params[0]; // Получаем путь к файлу из URL
  console.log('Requested file:', fileName);
  const filePath = path.join(__dirname, fileName);
  console.log('Full file path:', filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      res.status(404).send('File not found');
    } else {
      res.download(filePath);
    }
  });
});


function executePythonScript(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка выполнения Python скрипта: ${error}`);
                reject(error);
            } else if (stderr) {
                console.error(`Python скрипт вернул ошибку: ${stderr}`);
                reject(new Error(stderr));
            } else {
                resolve(stdout.trim()); // Удаляем лишние пробелы и переносы строки
            }
        });
    });
}


app.post('/check-input-type-Decryption', function (req, res) {
  const { inputTypeDecryption } = req.body;
  const isFile = inputTypeDecryption === 'file';
  res.json({ isFile });
});


app.post('/upload-Decryption', upload.single('fileDecryption'), function (req, res) {
  const relativePath = path.relative(__dirname, req.file.path);
  console.log("Путь к файлу:",req.file);
  // res.json({ status: 'File uploaded', filePath: req.file.path });
  res.json({ status: 'File uploaded', filePath: relativePath, filename: req.file.originalname });
});

app.post('/decrypt', function (req, res) {
  const { encryptedtext: ciphertext, decryptionkey: key, decryptionalgorithm: algorithm, inputTypeDecryption, filePath } = req.body;
  //console.log("Decrypt-body info: ",req.body)
  const isFile = inputTypeDecryption === 'file';
  //console.log(isFile);
  const fileOrCiphertext = isFile ? filePath : ciphertext;
  //console.log("python3 algorithms/",algorithm,isFile ? '/FileCrypt' : '',"/decrypt.py",fileOrCiphertext,key);
  const command = `python3 algorithms/${algorithm}${isFile ? '/FileCrypt' : ''}/decrypt.py "${fileOrCiphertext}" "${key}"`;
  //console.log("Command to execute: ", command); // Логируем команду, которую собираемся выполнить

  executePythonScript(command)
  .then(output => {
    //console.log("Output from python script: ", output); // Логируем вывод из скрипта Python
      if (isFile) {
          // Если ввод - это файл, возвращаем имя файла
          res.json({ filename: output });
      } else {
          // Если ввод - это текст, возвращаем расшифрованный текст
          res.json({ decryptedText: output });
      }
  })
  .catch(error => {
      console.error('Произошла ошибка:', error);
      res.status(500).send('Произошла ошибка при выполнении Python скрипта');
  });
});

app.get('/download-file-Decryption/*', function (req, res) {
  const fileName = req.params[0];
  const filePath = path.join(__dirname, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      res.status(404).send('File not found');
    } else {
      res.download(filePath);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  logToFile(`Server is running at http://localhost:${port}`);
});