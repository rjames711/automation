# takes a cmd arg of degrees to step and steps
import stepper, sys, time
motor = stepper.Stepper(20,21,16,3060)
degs=int(sys.argv[1])
print 'degrees: ' , degs
motor.add_move(degs, 4,0)
motor.run_next_move()
time.sleep(.5 + abs(degs)/50) #delay proportionate to step length. Not precise here.
