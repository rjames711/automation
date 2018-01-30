import pigpio
import time
import sys

sol1_pin=19
sol2_pin=13

pi = pigpio.pi()
pi.set_mode(sol1_pin,pigpio.OUTPUT)
pi.set_mode(sol2_pin,pigpio.OUTPUT)

pi.write(sol1_pin,0)
pi.write(sol2_pin,0)
            
    
