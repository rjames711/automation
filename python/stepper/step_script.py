import stepper, time
motor=stepper.Stepper(20, 21, 17, 3060)
motor.add_move(100, 3,0)
motor.add_move(200, 4,0)
motor.add_move(300, 5,0)
motor.add_move(400, 6,0)
motor.add_move(500, 7,0)
motor.add_move(600, 8,0)
motor.add_move(700, 9,0)
motor.add_move(800, 3,0)
motor.add_move(700, 3,.5)
motor.add_move(200, 9,0)
motor.add_move(100, 3,0)
motor.add_move(0, 1,0)

print motor.position, motor.target
motor.run_next_move()
while motor.position!=motor.target or motor.moves:
    print motor.position, motor.target
    time.sleep(1)
