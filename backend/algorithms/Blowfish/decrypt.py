from Crypto.Cipher import Blowfish
import base64
import sys

def unpad(data):
    # Remove padding added for Blowfish cipher
    while data[-1] == 0:
        data = data[:-1]
        
    return data

def decrypt(data, key):
    try:
        data = base64.b64decode(data)
    except (TypeError, binascii.Error) as e:
        print("Error: Invalid base64 input data.", str(e))
        return None

    if len(data) < Blowfish.block_size:
        print("Error: Input data is too short.")
        return None

    iv = data[:Blowfish.block_size]
    data = data[Blowfish.block_size:]

    try:
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
    except ValueError as e:
        print("Error: Invalid key or IV.", str(e))
        return None

    try:
        decrypted_data = unpad(cipher.decrypt(data))
    except ValueError as e:
        print("Error: Decryption failed.", str(e))
        return None

    return decrypted_data

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decrypt.py <encrypted_text> <key>")
    else:
        encrypted_text = sys.argv[1].encode()
        key = sys.argv[2].encode()
        
        decrypted_text = decrypt(encrypted_text, key)
        if decrypted_text:
            try:
                print(decrypted_text.decode())
            except UnicodeDecodeError:
                print("\nError: Decrypted text could not be decoded as UTF-8.\nDisplaying as hex:")
                print(decrypted_text.hex())
        else:
            print("Decryption failed.")