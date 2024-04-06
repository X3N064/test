#!/bin/bash

# Default values for options
ASM_FILE=""
OBJ_FILE=""
EXE_FILE=""
FORMAT="elf64"

# Parse command-line options
while getopts ":s:o:f:" opt; do
  case $opt in
    s)
      ASM_FILE="$OPTARG"
      ;;
    o)
      OBJ_FILE="$OPTARG"
      ;;
    f)
      EXE_FILE="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Check if mandatory options are provided
if [[ -z "$ASM_FILE" || -z "$OBJ_FILE" || -z "$EXE_FILE" ]]; then
    echo "Usage: $0 -s <asm_source_file> -o <object_file> -f <executable_file>"
    exit 1
fi

# Assemble the NASM source file to object file
nasm -f "$FORMAT" -o "$OBJ_FILE" "$ASM_FILE"

# Link the object file to create the executable
ld -s -o "$EXE_FILE" "$OBJ_FILE"
