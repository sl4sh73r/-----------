
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

const fs = require('fs');

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

app.post('/encrypt', (req, res) => {
  const { plaintext, key, algorithm } = req.body;
  const command = `python3 algorithms/${algorithm}/encrypt.py "${plaintext}" "${key}"`;
  console.log(algorithm,plaintext,key)
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logToFile(`Error: ${error.message}`);
      res.status(500).json({ error: 'An error occurred during encryption' });
      return;
    }
    if (stderr) {
      logToFile(`stderr: ${stderr}`);
      res.status(500).json({ error: 'An error occurred during encryption' });
      return;
    }

    res.json({ encryptedText: stdout.trim() });
  });
});

app.post('/decrypt', (req, res) => {
  const { encryptedtext, decryptionkey: key, decryptionalgorithm: algorithm } = req.body;
  const command = `python3 algorithms/${algorithm}/decrypt.py "${encryptedtext}" "${key}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logToFile(`Error: ${error.message}`);
      res.status(500).json({ error: 'An error occurred during decryption' });
      return;
    }
    if (stderr) {
      logToFile(`stderr: ${stderr}`);
      res.status(500).json({ error: 'An error occurred during decryption' });
      return;
    }

    res.json({ decryptedText: stdout.trim() });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  logToFile(`Server is running at http://localhost:${port}`);
});

