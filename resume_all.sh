#Resumes all running tests by finding runstate files and echo 1 into them
echo 'turning off inputs'
runs="$(find ~/automation/ -name  run_state.txt)"
echo $runs
IFS=' ' read -ra ARR <<< $runs 

for i in "${ARR[@]}"; do
    echo 'found file ' $i ' current state: ' $(cat $i)
    echo 1 > $i
done

echo wrote ones to all found run_state files
