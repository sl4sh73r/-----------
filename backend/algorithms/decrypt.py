from Crypto.Cipher import Blowfish
from Crypto.Protocol.KDF import PBKDF2
from Crypto import Random
import base64

def decrypt(encrypted_text, key):
    encrypted_text = base64.b64decode(encrypted_text)
    salt = encrypted_text[:8]
    ciphertext = encrypted_text[8:]
    derived_key = PBKDF2(key, salt, 64, 1000)
    cipher = Blowfish.new(derived_key[:32], Blowfish.MODE_CBC, derived_key[32:])
    padded_plaintext = cipher.decrypt(ciphertext)
    return _unpad(padded_plaintext).decode()

def _unpad(data):
    padding_length = data[-1]
    return data[:-padding_length]

if __name__ == "__main__":
    encrypted_text = input("Enter the encrypted text: ")
    key = input("Enter the key: ")
    decrypted_text = decrypt(encrypted_text, key)
    print("Decrypted text:", decrypted_text)
