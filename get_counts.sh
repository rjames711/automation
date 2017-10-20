#Prints and logs all counts to log file in home directory
TZ=America/New_York date | tee -a ~/count_log.txt
counts="$(find /home/pi/automation/ -name  count.txt)"
IFS=' ' read -ra ARR <<< $counts 

for i in "${ARR[@]}"; do
    echo $i ' current count: ' $(cat $i) | tee -a ~/count_log.txt
done

