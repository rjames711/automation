import pigpio
import time
import sys

sol1_pin=19
sol2_pin=13

pi = pigpio.pi()
pi.set_mode(sol1_pin,pigpio.OUTPUT)
pi.set_mode(sol2_pin,pigpio.OUTPUT)
delay=30
count= int(open('count.txt').read())


while True:
        try:
            time.sleep(1)
            pi.write(sol1_pin,1)
            time.sleep(delay)
            pi.write(sol1_pin,0)

            pi.write(sol2_pin,1)
            time.sleep(delay)
            pi.write(sol2_pin,0)
            count+=1
            log=open('count.txt','w')
            log.write(str(count))
            log.close()
            print count
        except KeyboardInterrupt:
            pi.write(sol1_pin,0)
            pi.write(sol2_pin,0)
            sys.exit(0)
            
    
