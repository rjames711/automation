#!/usr/bin/python
import time
import pigpio
pi = pigpio.pi()
#pin mappings for orginal breadboard prototype:
#26 (solenoid), 13 and 19 (sense in) 
#pin mappings for asme_valve fixture pcb rev 1:
# 19 (solenoid), 17 and 27 (sense in) 
sol_pin = 26
in1_pin=13
in2_pin=19
delay =3
# blinking function
def blink(pin):
    global sol_count #bad bad bad
    pi.write(pin,1)
    time.sleep(delay)
    pi.write(pin,0)
    time.sleep(delay)
    callback(sol_pin,1,'')
    print(sol_count,in1_count,in2_count)
    return

def log_data(file_name, data, mode):
    file=open(file_name,mode)
    file.write(str(data))
    file.close()
    file=open('log.txt', 'a')
    file.write(file_name+' '+str(data)+' '+str(time.time())+'\n')
    file.close()

last_time=time.time()
last_gpio=1
def callback(gpio, level, tick):
    global in2_count, in1_count, sol_count, last_time, last_gpio #just terrible, shameful
    if time.time()-last_time < .01 and last_gpio==gpio:
        last_time=time.time()
        last_gpio=gpio
        return
    last_time=time.time()
    last_gpio=gpio
    if level==1:
        print ('caught gpio', gpio)
        if gpio==sol_pin:
            sol_count+=1
            log_data('sol.txt',sol_count, 'w')
        if gpio==in1_pin:
            in1_count+=1
            log_data('in1.txt', in1_count, 'w')
            
        if gpio==in2_pin:
            in2_count+=1
            log_data('in2.txt', in2_count, 'w')


# set up GPIO output channel
pi.set_mode(sol_pin, pigpio.OUTPUT) # GPIO 17 as output
pi.set_mode( in1_pin, pigpio.INPUT)  # GPIO  4 as input
pi.set_mode( in2_pin, pigpio.INPUT)  # GPIO  4 as input
pi.set_pull_up_down(in1_pin, pigpio.PUD_UP)
pi.set_pull_up_down(in2_pin, pigpio.PUD_UP)
cb1 = pi.callback(in1_pin, pigpio.EITHER_EDGE, callback)
cb1 = pi.callback(in2_pin, pigpio.EITHER_EDGE, callback)
sol_count=int(open('sol.txt').read())
in1_count=int(open('in1.txt').read())
in2_count=int(open('in2.txt').read())
print(sol_count, in1_count, in2_count)


# blink GPIO17 
while True:
    blink(sol_pin)
    #time.sleep(5)
    print('cycled')
GPIO.cleanup()


