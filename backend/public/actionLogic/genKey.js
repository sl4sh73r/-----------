function genKey() {
    // Получаем выбранный алгоритм
    var algorithm = document.getElementById('algorithm').value;

    // Генерируем ключ в зависимости от выбранного алгоритма
    var key;
    switch (algorithm) {
        case 'blowfish':
            key = generateRandomString(12); // Blowfish можетать ключи от 4 до 56 символов
            break;
        case 'grasshopper':
            key = generateRandomString(12); // Grasshopper использует 256-битные ключи
            break;
        case 'aes':
            key = generateRandomString(32); // AES может использовать 128, 192 или 256-битные ключи
            break;
        case '3des':
            key = generateRandomString(24); // 3DES использует 168-битные ключи (24 символа)
            break;
        default:
            alert('Please select an algorithm');
            return;
    }

    // Заполняем поле ключа сгенерированным ключом
    document.getElementById('key').value = key;
}

function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}