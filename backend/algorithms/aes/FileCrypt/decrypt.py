from Crypto.Cipher import AES
import os
import sys

def unpad(data):
    # Remove padding added for AES cipher
    while data[-1] == 0:
        data = data[:-1]
    return data

def decrypt_file(key, in_filename, out_filename=None, chunksize=64*1024):
    if not out_filename:
        out_filename = os.path.splitext(in_filename)[0]

    bs = AES.block_size
    try:
        with open(in_filename, 'rb') as infile:
            iv = infile.read(bs)
            filesize = int.from_bytes(infile.read(8), 'big')
            cipher = AES.new(key, AES.MODE_CBC, iv)

            with open(out_filename, 'wb') as outfile:
                while True:
                    chunk = infile.read(chunksize)
                    if len(chunk) == 0:
                        break

                    outfile.write(unpad(cipher.decrypt(chunk)))

                outfile.truncate(filesize)
    except (IOError, ValueError) as e:
        print("Error: Failed to decrypt file.", str(e))
        return None

    return out_filename  # возвращаем путь к расшифрованному файлу

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decrypt.py <file_path> <key>")
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        key = sys.argv[2].encode()
    except UnicodeEncodeError as e:
        print("Error: Failed to encode key.", str(e))
        sys.exit(1)

    decrypted_file_path = decrypt_file(key, file_path)
    if decrypted_file_path:
        print(decrypted_file_path)
    else:
        print("Decryption failed.")