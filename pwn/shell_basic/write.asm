section .text
global _start
_start:
    mov rax, 0x0
    push rax 
    mov rax, 0x676E6F6F6F6F6F6F
    push rax 
    mov rax, 0x6C5F73695F656D61
    push rax 
    mov rax, 0x6E5F67616C662F63
    push rax 
    mov rax, 0x697361625F6C6C65
    push rax 
    mov rax, 0x68732F656D6F682F 
    push rax
    mov rsi, rsp
    push 1
    pop rdi
    push 0x6
    pop rdx
    push 1
    pop rax
    syscall





b800 0000 0050 48b8 6f6f 6f6f 6f6f 6e67
5048 b861 6d65 5f69 735f 6c50 48b8 632f
666c 6167 5f6e 5048 b865 6c6c 5f62 6173
6950 48b8 2f68 6f6d 652f 7368 5048 89e6
6a01 5f6a 065a 6a01 580f 05