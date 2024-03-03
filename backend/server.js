const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
// console.log(path.join(__dirname, 'public', 'index.html'),"FilePath");
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });

const app = express();
const port = 3000;

debugger


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
  console.log(inputTypeEncryption)
  const isFile = inputTypeEncryption === 'file';
  console.log(isFile);
  res.json({ isFile });
});

app.post('/upload-Encryption', upload.single('fileEncryption'), function (req, res) {
  // console.log(req.file, req.file.path);
  res.json({ status: 'File uploaded', filePath: req.file.path });
  //console.log("req.file: ",req.file);
});


app.post('/encrypt', function (req, res) {
    const { plaintext, key, algorithm, inputTypeEncryption, filePath} = req.body;
    const isFile = inputTypeEncryption === 'file';
    const fileOrPlaintext = isFile ? filePath : plaintext;
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
  console.log(inputTypeDecryption)
  const isFile = inputTypeDecryption === 'file';
  console.log(isFile);
  res.json({ isFile });
});

app.post('/upload-Decryption', upload.single('fileDecryption'), function (req, res) {
  res.json({ status: 'File uploaded', filePath: req.file.path });
});

app.post('/decrypt', function (req, res) {
  const { encryptedtext: ciphertext, decryptionkey: key, decryptionalgorithm: algorithm, inputTypeEncryption, filePath } = req.body;
  const isFile = inputTypeEncryption === 'file';
  const fileOrCiphertext = isFile ? filePath : ciphertext;
  const command = `python3 algorithms/${algorithm}${isFile ? '/FileCrypt' : ''}/decrypt.py "${fileOrCiphertext}" "${key}"`;

  executePythonScript(command)
  .then(output => {
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