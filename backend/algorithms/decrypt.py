from Crypto.Cipher import Blowfish
from Crypto import Random
import base64

def unpad(data):
    # Remove padding added for Blowfish cipher
    while data[-1] == 0:
        data = data[:-1]
    return data

def decrypt(encrypted_text, key):
    encrypted_text = base64.b64decode(encrypted_text)
    iv = encrypted_text[:Blowfish.block_size]
    cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
    decrypted_data = cipher.decrypt(encrypted_text[Blowfish.block_size:])
    return unpad(decrypted_data)

if __name__ == "__main__":
    encrypted_text = input("Enter the encrypted text: ")
    key = input("Enter the key: ")
    decrypted_text = decrypt(encrypted_text.encode(), key.encode())
    print("Decrypted text:", decrypted_text.decode())