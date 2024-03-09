document.getElementById('decryptionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const inputTypeDecryption = formData.get('inputTypeDecryption'); 
    // const encryptedtext = formData.get('encryptedtext');
    if (inputTypeDecryption === 'file') {
        // Скрываем результат дешифрования текста
        const decryptionResult = document.getElementById('decryptionResult');
        decryptionResult.style.display = 'none';

        fetch('/upload-Decryption', {
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
            const decryptionkey = formData.get('decryptionkey');
            const decryptionalgorithm = formData.get('decryptionalgorithm');

            return fetch('/decrypt', {
                method: 'POST',
                body: JSON.stringify({ encryptedtext, decryptionkey, decryptionalgorithm,inputTypeDecryption,filePath: data.filePath }),
                headers: { 'Content-Type': 'application/json' }
            });
        })
        .then(response => response.json())
        .then(data => {
            // const decryptionResult = document.getElementById('decryptionResult');
            // const decryptionResultText = document.getElementById('decryptionResultText');
            // decryptionResultText.textContent = data.decryptedText;
            // decryptionResult.style.display = 'block';

             // Здесь мы добавляем вызов fetch к эндпоинту /download-file/:fileName
            return fetch(`/download-file-Decryption/${data.filename}`);
        })
        .then(response => response.blob())
        .then(blob => {
            const decryptionalgorithm = formData.get('decryptionalgorithm');
            const file = formData.get('fileDecryption'); // Получаем файл из formData
            let originalFileName = file.name;
            originalFileName = originalFileName.replace("_"+decryptionalgorithm, "");
            originalFileName = originalFileName.replace(".enc", "");
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = originalFileName; // Имя файла для скачивания
            document.body.appendChild(a);
        
        
         // Функция для обновления стиля кнопки в зависимости от темы
         function updateButtonStyle(button) {
            const isDarkTheme = document.body.classList.contains('dark-theme');
            if (isDarkTheme) {
                button.classList.remove('light-theme');
                button.classList.add('dark-theme');
            } else {
                button.classList.remove('dark-theme');
                button.classList.add('light-theme');
            }
        }
        // Создаем кнопку для скачивания файла
        let downloadDecryptButton = document.getElementById('downloadDecryptButton');
        if (!downloadDecryptButton) {
            downloadDecryptButton = document.createElement('button');
            downloadDecryptButton.id = 'downloadDecryptButton';
            downloadDecryptButton.className = 'download-button'; // Добавьте класс
            downloadDecryptButton.innerHTML = '<i class="fas fa-download"></i>'; // Используйте иконку вместо текста

            // Обновляем стиль кнопки при создании
            updateButtonStyle(downloadDecryptButton);
        }

        downloadDecryptButton.onclick = function() {
            a.click();
        };

        const buttonContainer = document.querySelector('.button-decrypt-container');
        buttonContainer.appendChild(downloadDecryptButton);

        // Обновляем стиль кнопки при изменении темы
        if (window.matchMedia) {
            const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQueryList.addListener(() => updateButtonStyle(downloadDecryptButton));
        }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }else{ //Если тип ввода - это текст, сразу шифруем
        const decryptionkey = formData.get('decryptionkey');
        const decryptionalgorithm = formData.get('decryptionalgorithm');
        const encryptedtext = formData.get('encryptedtext');

        fetch('/decrypt', {
            method: 'POST',
            body: JSON.stringify({ encryptedtext, decryptionkey, decryptionalgorithm, inputTypeDecryption }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            const decryptionResult = document.getElementById('decryptionResult');
            const decryptionResultText = document.getElementById('decryptionResultText');
            decryptionResultText.textContent = data.decryptedText;
            decryptionResult.style.display = 'block';
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }
});