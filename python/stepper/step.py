import stepper, time, sys
degrees=int(sys.argv[1])
print 'stepping ',degrees, 'degrees'
motor=stepper.Stepper(20, 21, 17, 200)
motor.add_move(degrees, 3,0)

print motor.position, motor.target
motor.run_next_move()
while motor.position!=motor.target or motor.moves:
    print motor.position, motor.target
    time.sleep(1)
