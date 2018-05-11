# takes a cmd arg of degrees to step and steps
import stepper, sys, time
steps_per_rev= 200 * 27
motor = stepper.Stepper(20,21,16,steps_per_rev)
degs=int(sys.argv[1])
print 'degrees: ' , degs
motor.add_move(degs, 6,0)
motor.run_next_move()
time.sleep(.5 + abs(degs)*steps_per_rev/(3060*50)) #delay proportionate to step length. Not precise here.
