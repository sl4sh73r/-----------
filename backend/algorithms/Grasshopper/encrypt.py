import main as gh
import sys

def encrypt(text, password):
    try:
        K = gh.getKeys(password)
    except Exception as e:
        print("Error: Failed to generate keys.", str(e))
        return None

    try:
        encrypted_text = gh.encrypt(text, K)
    except Exception as e:
        print("Error: Encryption failed.", str(e))
        return None

    return encrypted_text

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <data> <password>")
        sys.exit(1)

    data = sys.argv[1]
    password = sys.argv[2]

    encrypted_text = encrypt(data, password)
    if encrypted_text:
        print(encrypted_text)
    else:
        print("Encryption failed.")