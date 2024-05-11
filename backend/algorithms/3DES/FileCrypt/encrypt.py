from Crypto.Cipher import DES3
from Crypto import Random
import os
import sys

def pad(data):
    # 3DES cipher needs multiples of 8 for the data length
    while len(data) % 8 != 0:
        data += b'\0'
    return data

def encrypt_file(key, in_filename, out_filename=None, chunksize=64*1024):
    if not out_filename:
        out_filename = in_filename + '.enc'

    bs = DES3.block_size
    try:
        iv = Random.new().read(bs)
        cipher = DES3.new(key, DES3.MODE_CBC, iv)
    except ValueError as e:
        print("Error: Invalid key or IV.", str(e))
        return None

    try:
        filesize = os.path.getsize(in_filename)
    except OSError as e:
        print("Error: Failed to get file size.", str(e))
        return None

    try:
        with open(in_filename, 'rb') as infile:
            with open(out_filename, 'wb') as outfile:
                outfile.write(iv)
                outfile.write(filesize.to_bytes(8, 'big'))

                while True:
                    chunk = infile.read(chunksize)
                    if len(chunk) == 0:
                        break
                    elif len(chunk) % bs != 0:
                        chunk += b' ' * (bs - len(chunk) % bs)

                    outfile.write(cipher.encrypt(pad(chunk)))
    except IOError as e:
        print("Error: Failed to read input file or write to output file.", str(e))
        return None

    return out_filename  # возвращаем путь к зашифрованному файлу

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <file_path> <key>")
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        key = sys.argv[2].encode()
    except UnicodeEncodeError as e:
        print("Error: Failed to encode key.", str(e))
        sys.exit(1)

    encrypted_file_path = encrypt_file(key, file_path)
    if encrypted_file_path:
        print(encrypted_file_path)
    else:
        print("Encryption failed.")