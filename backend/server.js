const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/encrypt', (req, res) => {
  const { plaintext, key } = req.body;

  const command = `python3 algorithms/encrypt.py "${plaintext}" "${key}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ error: 'An error occurred during encryption' });
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).json({ error: 'An error occurred during encryption' });
      return;
    }

    res.json({ encryptedText: stdout.trim() });
  });
});

app.post('/decrypt', (req, res) => {
  const { encryptedtext, decryptionkey } = req.body;

  const command = `python3 algorithms/decrypt.py "${encryptedtext}" "${decryptionkey}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ error: 'An error occurred during decryption' });
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.status(500).json({ error: 'An error occurred during decryption' });
      return;
    }

    res.json({ decryptedText: stdout.trim() });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});