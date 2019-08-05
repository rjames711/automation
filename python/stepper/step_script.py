import stepper, time, sys
motor=stepper.Stepper(20, 21, 17, 200*8)

with open('run.txt','w') as r:
    r.write('1')
spd = 1
end = 47
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
while True: 
    #print motor.position, motor.target
    try:
        time.sleep(.5)
        with open('run.txt','r') as r:
            if motor.count % 500000 == 0 or not int(r.read()):
                motor.stop_motor()
                print 'Stopping motor'
                sys.exit(0) 
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
        print('exiting controlled')
        sys.exit(0)
    except:
        print 'Caught some random erro'
motor.stop_motor()
motor.pi.stop()
print 'Exiting without exception end of script'
