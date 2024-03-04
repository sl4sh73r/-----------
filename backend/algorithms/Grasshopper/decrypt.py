import main as gh
import sys

def decrypt(text, password):
    try:
        K = gh.getKeys(password)
    except Exception as e:
        print("Error: Failed to generate keys.", str(e))
        return None

    try:
        decrypted_text = gh.decrypt(text, K)
    except Exception as e:
        print("Error: Decryption failed.", str(e))
        return None

    return decrypted_text

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decrypt.py <data> <password>")
        sys.exit(1)

    data = sys.argv[1]
    password = sys.argv[2]

    decrypted_text = decrypt(data, password)
    if decrypted_text:
        print(decrypted_text)
    else:
        print("Decryption failed.")