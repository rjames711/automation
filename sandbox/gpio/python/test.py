#!/usr/bin/env python
 
import time
 
import pigpio

pi = pigpio.pi()
pin=20
pi.set_mode(pin,pigpio.OUTPUT)

while True:
    pi.write(pin, 1)
    print('high')
    time.sleep(.01)
    pi.write(pin,0)
    print('low')
    time.sleep(.01)
