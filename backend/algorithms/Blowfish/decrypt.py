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
        iv = data[:Blowfish.block_size]
        data = data[Blowfish.block_size:]
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(data))
        return decrypted_data
    except (ValueError, TypeError) as e:
        print("Error: Invalid input data or key.", str(e))
        return None
    except KeyError as e:
        print("Error: Invalid key.", str(e))
        return None
    except Exception as e:
        print("Error: An unexpected error occurred.", str(e))
        return None

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
