import sys, time, pigpio

class Stepper:

    def __init__(self, step_pin, dir_pin,sense_pin, steps_per_rev):
        self.step_pin=step_pin
        self.dir_pin=dir_pin
        self.sense_pin=sense_pin
        self.steps_per_rev=steps_per_rev
        self.pi = pigpio.pi()
        self.pi.set_mode(self.step_pin, pigpio.OUTPUT)
        self.pi.set_mode(self.dir_pin, pigpio.OUTPUT)
        self.pi.set_mode(self.sense_pin, pigpio.INPUT)
        self.home=0
        self.position=0
        self.set_speed(1) #set default low speed
        self.target=0
        self.pi.callback(step_pin, pigpio.RISING_EDGE, self.on_step)
        self.pi.callback(sense_pin, pigpio.RISING_EDGE, self.on_sense)
        self.pi.write(dir_pin,0) # set default direction
        self.moves= []
        self.cycle=False
        self.cycle_moves=[]
        self.running=False
        self.count=int(open('count.txt').read())
        self.pos_error=0
        print 'Loaded count: ',self.count
        self.update_line()
        self.new_home_pass=False
    #Param is a integer 1 - 9 which corresponds to a frequency (speed) 
    #Function sets the pwm frquency. Available frequencies based on pigpio docs
    def set_speed(self, spd):  
        speeds=[0,320,400,500,800,1000,1600,2000,4000,8000]
        self.pi.set_PWM_frequency(self.step_pin, speeds[spd])
    
    def start_motor(self):
        self.pi.set_PWM_dutycycle(self.step_pin, 128) #starts pwm with 1/2 duty cycle

    #direction is 1 or 0
    def set_direction(self, direction):  
        self.pi.write(self.dir_pin, direction)

    #stop motor by killing pwm by writing pin low (tested works)
    def stop_motor(self):
        self.pi.write(self.step_pin, 0)
    #Callback function for step_pin to catch steps and keep track of position
    def on_step(self, gpio, level, tick):
        if self.pi.read(self.dir_pin):
            self.position+=1
        else:
            self.position-=1
        if self.position==self.target:
            self.run_next_move()
    
    #May need fixing if home in other direction (switch read values)
    # Right now is set to rehome position since this program is losing steps somewhere.
    def on_sense(self,gpio,level,tick):
        if self.new_home_pass and self.pi.read(self.dir_pin)==0:
            self.pos_error = self.position
            self.new_home_pass=False
            self.position=0 #reset position to zero (to use if steps are missing)
        elif self.pi.read(self.dir_pin)==1:
            self.new_home_pass=True

    
    def update_line(self):
	sys.stdout.write('Count: '  + str(self.count)+' Pos Error: '+ str(self.pos_error) + "\r")
        sys.stdout.flush()
    
    def log_count(self):
        log=open('count.txt','w')
        log.write(str(self.count))

    
    

    def run_next_move(self):
        self.running=True
        if not self.moves:
            self.moves=list(self.cycle_moves) #if cycle is set, cycle_move will have moves
            self.count+=1 #if no moves left that a cycles has completed
            self.log_count()
            self.update_line()
        if self.moves:
            move=self.moves.pop(0)
            self.step_deg_pos(move[0], move[1], move[2])
        else:
            self.stop_motor()
            self.running=False

    def add_move(self, deg_pos, spd, delay):
        self.moves.append([deg_pos, spd, delay])

    def step_deg_pos(self, deg,spd, delay):
        self.set_speed(spd)
        self.stop_motor()
        time.sleep(delay)
        steps= int(self.steps_per_rev*(deg/360.0))
        self.target=steps
        if self.position < self.target:
            self.set_direction(1)
        else:
            self.set_direction(0)
        self.start_motor()
    
    def find_home(self, spd, direction):
        self.set_speed(spd)
        self.set_direction(direction)
        self.start_motor()
        while not self.pi.read(self.sense_pin):
            time.sleep(.1)
        self.stop_motor() 
        self.position=0

    def set_cycle(self, on_off):
        self.cycle=bool(on_off)
        if on_off:
            self.cycle_moves=list(self.moves)
        else:
            self.cycle_moves=[]
    
    def clear_moves(self):
        self.moves=[]
        self.cycle_moves=[]
if __name__=='__main__':
    #Begin Script 
    start_pos=20
    motor=Stepper(20, 21, 17, 3060)
    motor.find_home(1,0)
    motor.add_move(start_pos-100,3,.5)
    motor.add_move(start_pos,3,.5)
    motor.set_cycle(1)
    motor.run_next_move()

    #Keep running until cntrl-c then go home
    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            print('Homing motor')
            motor.stop_motor()
            motor.clear_moves()
            #if abs(motor.position -(start_pos/360)*3060) > 100: # only try to move home if position is off
            if True:
                motor.add_move(start_pos,2,0)
                motor.run_next_move()
                while motor.running:
                    time.sleep(.1)
            print('exiting')
            sys.exit(0)
    motor.stop_motor()
    motor.pi.stop()


    '''
    motor.set_direction(0)
    motor.set_speed(3)
    motor.start_motor()
    time.sleep(3)
    motor.set_direction(1)
    motor.stop_motor()
    time.sleep(1)
    motor.start_motor()
    motor.set_speed(5)
    time.sleep(6)
    print('timeouit')
    motor.stop_motor()
    '''
