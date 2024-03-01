from struct import pack
from Crypto.Cipher import Blowfish
from Crypto.Protocol.KDF import PBKDF2
from Crypto import Random
import base64

def pad(data):
    # Blowfish cipher needs multiples of 8 for the data length
    while len(data) % 8 != 0:
        data += b'\0'
    return data

def encrypt(data, key):
    iv = Random.new().read(Blowfish.block_size)
    cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
    encrypted_data = iv + cipher.encrypt(pad(data))
    return base64.b64encode(encrypted_data)

if __name__ == "__main__":
    plaintext = input("Enter the plaintext: ")
    key = input("Enter the key: ")
    encrypted_text = encrypt(plaintext.encode(), key.encode())
    print("Encrypted text:", encrypted_text.decode())
