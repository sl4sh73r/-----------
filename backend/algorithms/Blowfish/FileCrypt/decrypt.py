from Crypto.Cipher import Blowfish
import os
import sys

def decrypt_file(key, in_filename, out_filename=None, chunksize=24*1024):
    if not out_filename:
        out_filename = os.path.splitext(in_filename)[0]

    bs = Blowfish.block_size

    try:
        with open(in_filename, 'rb') as infile:
            iv = infile.read(bs)
            if len(iv) != bs:
                print("Error: Input file is too short.")
                return None

            try:
                cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
            except ValueError as e:
                print("Error: Invalid key or IV.", str(e))
                return None

            filesize_bytes = infile.read(8)
            if len(filesize_bytes) != 8:
                print("Error: Input file is too short.")
                return None

            filesize = int.from_bytes(filesize_bytes, 'big')

            try:
                with open(out_filename, 'wb') as outfile:
                    while True:
                        chunk = infile.read(chunksize)
                        if len(chunk) == 0:
                            break

                        outfile.write(cipher.decrypt(chunk))

                    outfile.truncate(filesize)
            except IOError as e:
                print("Error: Failed to write to output file.", str(e))
                return None
    except IOError as e:
        print("Error: Failed to read input file.", str(e))
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