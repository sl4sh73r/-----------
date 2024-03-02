from Crypto.Cipher import Blowfish
from Crypto import Random
import os

def encrypt_file(key, in_filename, out_filename=None, chunksize=64*1024):
    if not out_filename:
        out_filename = in_filename + '.enc'

    bs = Blowfish.block_size
    iv = Random.new().read(bs)
    cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv)

    filesize = os.path.getsize(in_filename)

    with open(in_filename, 'rb') as infile:
        with open(out_filename, 'wb') as outfile:
            outfile.write(iv)
            outfile.write(filesize.to_bytes(8, 'big'))

            while True:
                chunk = infile.read(chunksize)
                if len(chunk) == 0:
                    break
                elif len(chunk) % bs != 0:
                    chunk += b' ' * (bs - len(chunk) % bs)

                outfile.write(cipher.encrypt(chunk))