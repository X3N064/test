for i in $(seq 0 99); do
    # Calculate different ports for each instance
    proxy_port=$((9050 + i))
    ctrl_port=$((9051 + i))

    # Redirect output to a file named "viewbot_output_i.txt"
    python3 viewbot.py $proxy_port $ctrl_port > "viewbot_output_$i.txt" 2>&1 &
done

# Wait for all background processes to finish
wait
