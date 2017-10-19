#Pauses all running tests by finding runstate files and echo 0 into them
echo 'turning off inputs'
runs="$(find ~/automation/ -name  run_state.txt)"
echo $runs
IFS=' ' read -ra ARR <<< $runs 

for i in "${ARR[@]}"; do
    echo 'found file ' $i ' current state: ' $(cat $i)
    echo 0 > $i
done

echo wrote zeros to all found run_state files
