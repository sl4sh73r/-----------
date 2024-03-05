document.getElementById('encryptionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const inputTypeEncryption = formData.get('inputTypeEncryption'); 
    const plaintext = formData.get('plaintext');
    if (inputTypeEncryption === 'file') {
        const encryptionResult = document.getElementById('encryptionResult');
        encryptionResult.style.display = 'none';

        fetch('/upload-Encryption', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла');
            }
            return response.json();
        })
        .then(data => {
            
            const key = formData.get('key');
            const algorithm = formData.get('algorithm');

            return fetch('/encrypt', {
                method: 'POST',
                body: JSON.stringify({ plaintext, key, algorithm,inputTypeEncryption,filePath: data.filePath }),
                headers: { 'Content-Type': 'application/json' }
            });
        })
        .then(response => response.json())
        .then(data => {
            // Здесь мы добавляем вызов fetch к эндпоинту /download-file/:fileName
            return fetch(`/download-file-Encryption/${data.filename}`);
        })
        .then(response => response.blob())

        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');

            // Получаем файл из формы
            const file = formData.get('fileEncryption'); // Используем 'fileEncryption' как имя поля ввода файла // Замените 'fileInputFieldName' на имя поля ввода файла в вашей форме
            const originalFileName = file.name; // Получаем имя исходного файла
            const algorithm = formData.get('algorithm');
            a.style.display = 'none';
            a.href = url;
            a.download = originalFileName+"_"+algorithm+".enc"; // Имя файла для скачивания
            document.body.appendChild(a);

            // Создаем кнопку для скачивания файла
            let downloadEncryptButton = document.getElementById('downloadEncryptButton');
            if (!downloadEncryptButton) {
                downloadEncryptButton = document.createElement('button');
                downloadEncryptButton.id = 'downloadEncryptButton';
                downloadEncryptButton.textContent = 'DownloadCrypt';
                document.body.appendChild(downloadEncryptButton);
            }
            downloadEncryptButton.onclick = function() {
                a.click();
            };
            document.body.appendChild(downloadEncryptButton);
        })

        

        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    } else {// Если тип ввода - это текст, сразу шифруем
        const key = formData.get('key');
        const algorithm = formData.get('algorithm');
        const plaintext = formData.get('plaintext');

        fetch('/encrypt', {
            method: 'POST',
            body: JSON.stringify({ plaintext, key, algorithm, inputTypeEncryption }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            const encryptionResult = document.getElementById('encryptionResult');
            const encryptionResultText = document.getElementById('encryptionResultText');
            encryptionResultText.textContent = data.encryptedText;
            encryptionResult.style.display = 'block';
        })
.catch(error => {
    console.error('Произошла ошибка:', error);
});}
});