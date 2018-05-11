import stepper, time, sys
motor=stepper.Stepper(20, 21, 17, 200*27)
spd = 5

end = 180
stop1 = 10
stop2 = 20
stop3 = end-10
stop4 = end-20

motor.add_move(stop1,1, 0.5 )
motor.add_move(stop2,3, 0 )
motor.add_move(end, spd, 0 )
motor.add_move(stop3, 1, .5 )
motor.add_move(stop4, 3, 0)
motor.add_move(0, spd,0)

print motor.position, motor.target
motor.set_cycle(1)
motor.run_next_move()
while motor.position!=motor.target or motor.moves:
    print motor.position, motor.target
    try:
        time.sleep(1)
    except KeyboardInterrupt:
        print('Homing motor')
        motor.stop_motor()
        motor.clear_moves()
        #if abs(motor.position -(start_pos/360)*3060) > 100: # only try to move home if position is off
        if True:
            motor.add_move(0,3,0)
            motor.run_next_move()
            while motor.running:
                time.sleep(.1)
        print('exiting')
        sys.exit(0)
motor.stop_motor()
motor.pi.stop()
