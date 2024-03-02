import main as gh
import sys

def decrypt(text, password):
    K = gh.getKeys(password)
    decrypted_text = gh.decrypt(text, K)
    return decrypted_text

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decrypt.py <data> <password>")
        sys.exit(1)

    data = sys.argv[1]
    password = sys.argv[2]

    decrypted_text = decrypt(data, password)
    print(decrypted_text)