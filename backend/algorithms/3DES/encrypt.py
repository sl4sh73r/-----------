from struct import pack
from Crypto.Cipher import DES3
from Crypto.Protocol.KDF import PBKDF2
from Crypto import Random
import base64
import sys

def pad(data):
    # 3DES cipher needs multiples of 8 for the data length
    while len(data) % 8 != 0:
        data += b'\0'
    return data

def encrypt(data, key):
    try:
        iv = Random.new().read(DES3.block_size)
    except Exception as e:
        print("Error: Failed to generate initialization vector.", str(e))
        return None

    try:
        cipher = DES3.new(key, DES3.MODE_CBC, iv)
    except ValueError as e:
        print("Error: Invalid key or IV.", str(e))
        return None

    try:
        encrypted_data = iv + cipher.encrypt(pad(data))
    except Exception as e:
        print("Error: Encryption failed.", str(e))
        return None

    try:
        return base64.b64encode(encrypted_data)
    except Exception as e:
        print("Error: Failed to encode encrypted data.", str(e))
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <data> <key>")
        sys.exit(1)

    try:
        ciphertext = sys.argv[1].encode()
        key = sys.argv[2].encode()
    except UnicodeEncodeError as e:
        print("Error: Failed to encode input data or key.", str(e))
        sys.exit(1)

    encrypted_text = encrypt(ciphertext, key)
    if encrypted_text:
        try:
            print(encrypted_text.decode())
        except UnicodeDecodeError:
            print("Error: Encrypted text could not be decoded as UTF-8.")
    else:
        print("Encryption failed.")
