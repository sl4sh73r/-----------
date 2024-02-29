from Crypto.Cipher import Blowfish
from Crypto.Protocol.KDF import PBKDF2
from Crypto import Random
import base64

def encrypt(plaintext, key):
    salt = Random.new().read(8)
    derived_key = PBKDF2(key, salt, 64, 1000)
    cipher = Blowfish.new(derived_key[:32], Blowfish.MODE_CBC, derived_key[32:])
    padded_plaintext = _pad(plaintext.encode())
    ciphertext = cipher.iv + cipher.encrypt(padded_plaintext)
    return base64.b64encode(salt + ciphertext).decode()

def _pad(data):
    padding_length = 8 - (len(data) % 8)
    padding = bytes([padding_length] * padding_length)
    return data + padding

if __name__ == "__main__":
    plaintext = input("Enter the plaintext: ")
    key = input("Enter the key: ")
    encrypted_text = encrypt(plaintext, key)
    print("Encrypted text:", encrypted_text)
