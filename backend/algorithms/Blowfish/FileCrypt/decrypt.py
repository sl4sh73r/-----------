from Crypto.Cipher import Blowfish
import os

def decrypt_file(key, in_filename, out_filename=None, chunksize=24*1024):
    if not out_filename:
        out_filename = os.path.splitext(in_filename)[0]

    bs = Blowfish.block_size

    with open(in_filename, 'rb') as infile:
        iv = infile.read(bs)
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)
        filesize = int.from_bytes(infile.read(8), 'big')

        with open(out_filename, 'wb') as outfile:
            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break

                outfile.write(cipher.decrypt(chunk))

            outfile.truncate(filesize)