window.onload = function() {
    let dropZone = document.getElementById('drop_zone');
    let fileInput = document.getElementById('fileEncryption');
    let fileInfo = document.getElementById('fileInfo');
    let uploadStatus = document.getElementById('uploadStatus');

    // При перетаскивании файла в зону
    dropZone.ondragover = function(event) {
        event.preventDefault();
        this.style.background = '#999';
    };

    // Когда файл покидает зону
    dropZone.ondragleave = function() {
        this.style.background = 'none';
    };

    // Когда файл отпущен в зону
    dropZone.ondrop = function(event) {
        event.preventDefault();
        this.style.background = 'none';

        let files = event.dataTransfer.files;
        fileInput.files = files;

        // Имитация процесса загрузки
        uploadStatus.textContent = 'Uploading...';
        setTimeout(function() {
            uploadStatus.textContent = 'Done!';
            dropZone.className = 'drop-zone done';
        }, 1000); // Задержка в 2 секунды

        // Обновление информации о файле
        updateFileInfo();
    };

    // Обновление информации о файле при выборе нового файла через input
    fileInput.onchange = updateFileInfo;

    function updateFileInfo() {
        if (fileInput.files.length > 0) {
            let fileName = fileInput.files[0].name;
            fileInfo.textContent = 'File: ' + fileName;
        }
    }

    let dropZoneDecryption = document.getElementById('drop_zone_decryption');
    let fileInputDecryption = document.getElementById('fileDecryption');
    let fileInfoDecryption = document.getElementById('fileInfoDecryption');
    let uploadStatusDecryption = document.getElementById('uploadStatusDecryption');

    // При перетаскивании файла в зону
    dropZoneDecryption.ondragover = function(event) {
        event.preventDefault();
        this.style.background = '#999';
    };

    // Когда файл покидает зону
    dropZoneDecryption.ondragleave = function() {
        this.style.background = 'none';
    };

    // Когда файл отпущен в зону
    dropZoneDecryption.ondrop = function(event) {
        event.preventDefault();
        this.style.background = 'none';

        let files = event.dataTransfer.files;
        fileInputDecryption.files = files;

        // Имитация процесса загрузки
        uploadStatusDecryption.textContent = 'Uploading...';
        setTimeout(function() {
            uploadStatusDecryption.textContent = 'Done!';
            dropZoneDecryption.className = 'drop-zone done';
        }, 1000); // Задержка в 2 секунды

        // Обновление информации о файле
        updateFileInfoDecryption();
    };

    // Обновление информации о файле при выборе нового файла через input
    fileInputDecryption.onchange = updateFileInfoDecryption;

    function updateFileInfoDecryption() {
        if (fileInputDecryption.files.length > 0) {
            let fileName = fileInputDecryption.files[0].name;
            fileInfoDecryption.textContent = 'File: ' + fileName;
        }
    }
};