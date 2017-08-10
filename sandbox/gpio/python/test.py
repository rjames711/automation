#!/usr/bin/env python
 
import time
 
import pigpio

pi = pigpio.pi()

pi.set_mode(21,pigpio.OUTPUT)

while True:
    pi.write(21, 1)
    time.sleep(.5)
    pi.write(21,0)
    time.sleep(.5)
