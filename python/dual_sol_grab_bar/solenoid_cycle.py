import pigpio
import time
import sys

sol1_pin=19
sol2_pin=13

pi = pigpio.pi()
pi.set_mode(sol1_pin,pigpio.OUTPUT)
pi.set_mode(sol2_pin,pigpio.OUTPUT)
delay1=.5
delay2=3
count= int(open('count.txt').read())



while True:
        try:
#cycle button
            pi.write(sol1_pin,0)
            time.sleep(delay1)
            pi.write(sol1_pin,1)
            time.sleep(delay1)
#move up
            pi.write(sol2_pin,1)
            time.sleep(delay2)
#move down
            pi.write(sol2_pin,0)
            time.sleep(delay2)

            count+=1
            log=open('count.txt','w')
            log.write(str(count))
            log.close()
            print count
        except KeyboardInterrupt:
            pi.write(sol1_pin,1)
            pi.write(sol2_pin,0)
            sys.exit(0)
            
    
