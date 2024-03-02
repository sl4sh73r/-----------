from struct import pack
from Crypto.Cipher import Blowfish
from Crypto.Protocol.KDF import PBKDF2
from Crypto import Random
import base64
import sys

def pad(data):
    # Blowfish cipher needs multiples of 8 for the data length
    while len(data) % 8 != 0:
        data += b'\0'
    return data

def encrypt(data, key):
    try:
        iv = Random.new().read(Blowfish.block_size)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
        encrypted_data = iv + cipher.encrypt(pad(data))
        return base64.b64encode(encrypted_data)
    except ValueError as e:
        print("Blowfish encryption error:", str(e))
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <data> <key>")
        sys.exit(1)

    ciphertext = sys.argv[1].encode()
    key = sys.argv[2].encode()

    encrypted_text = encrypt(ciphertext, key)
    if encrypted_text:
        print(encrypted_text.decode())
