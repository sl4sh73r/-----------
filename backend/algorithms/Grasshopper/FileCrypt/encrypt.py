import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import main as gh

import base64

def encrypt_file(file_path, password):
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"Файл {file_path} не найден")
    if not isinstance(password, str):
        raise ValueError("Пароль должен быть строкой")

    # Открываем файл и считываем его содержимое
    with open(file_path, 'rb') as file:
        data = file.read()
    print("PROGRESS: 25")


    # Преобразуем байты в base64
    data = base64.b64encode(data).decode('utf-8')
    print("PROGRESS: 50")

    K = gh.getKeys(password)
    encrypted_data = gh.encrypt(data, K)


    # Преобразуем зашифрованные данные обратно в байты
    encrypted_data = base64.b64decode(encrypted_data.encode('utf-8'))
    print("PROGRESS: 75")

    return encrypted_data

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <file_path> <password>")
        sys.exit(1)

    file_path = sys.argv[1]
    password = sys.argv[2]

    try:
        encrypted_text = encrypt_file(file_path, password)
    except Exception as e:
        print(f"Произошла ошибка при шифровании файла: {e}")
        sys.exit(1)

    # Создаем новый файл с зашифрованным текстом
    new_file_path = os.path.splitext(file_path)[0] + ".enc"
    try:
        with open(new_file_path, 'wb') as file:
            file.write(encrypted_text)
        print("PROGRESS: 100")
    except Exception as e:
        print(f"Произошла ошибка при записи в файл: {e}")
        sys.exit(1)

    print(new_file_path)