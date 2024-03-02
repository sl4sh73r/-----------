import main as gh
import sys

def encrypt(text, password):
    K = gh.getKeys(password)
    encrypted_text = gh.encrypt(text, K)
    return encrypted_text

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python encrypt.py <data> <password>")
        sys.exit(1)

    data = sys.argv[1]
    password = sys.argv[2]

    encrypted_text = encrypt(data, password)
    print(encrypted_text)