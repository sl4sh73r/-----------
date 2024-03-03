import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import main as gh

import base64

def decrypt_file(file_path, password):
    try:
        # Открываем файл и считываем его содержимое
        with open(file_path, 'rb') as file:
            data = file.read()

        # Преобразуем байты в base64
        data = base64.b64encode(data).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: File {file_path} not found.")
        return None
    except PermissionError:
        print(f"Error: Permission denied to read the file {file_path}.")
        return None

    try:
        K = gh.getKeys(password)
        decrypted_data = gh.decrypt(data, K)

        # Преобразуем расшифрованные данные обратно в байты
        decrypted_data = base64.b64decode(decrypted_data.encode('utf-8'))
    except Exception as e:
        print(f"Error: An error occurred during decryption. {str(e)}")
        return None

    return decrypted_data

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decrypt.py <file_path> <password>")
        sys.exit(1)

    file_path = sys.argv[1]
    password = sys.argv[2]

    decrypted_data = decrypt_file(file_path, password)
    decrypted_data = decrypted_data.rstrip(b'\x00')

    if decrypted_data is None:
        print("Decryption failed.")
        sys.exit(1)

    # Создаем новый файл с расшифрованными данными
    base_name = os.path.splitext(os.path.splitext(file_path)[0])[0]
    new_file_path = base_name
    try:
        with open(new_file_path, 'wb') as file:
            file.write(decrypted_data)
    except PermissionError:
        print(f"Error: Permission denied to write to the file {new_file_path}.")
        sys.exit(1)

    print(new_file_path)