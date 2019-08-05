#!/usr/bin/python
# coding: utf-8
from flask import Flask, Blueprint, flash, g, redirect, render_template, request, url_for, session
import os
app = Flask(__name__)

tests = []
class TestObj:
    def __init__(self, name, path):
        self.name = name
        self.path = path+self.name
        self.countfile = self.path+"/count.txt"
        self.count = self.read_count()
        self.run_file = self.path + "/run.txt"
        self.running = self.get_run_state() 
    
    def read_count(self):
        return int(open(self.countfile).read())

    def get_run_state(self):
        return int(open(self.run_file).read())
    
    def toggle_run(self):
        newstate = str(int(not bool(self.get_run_state())))
        with open(self.run_file,'w') as rf:
            rf.write(newstate)
            

@app.route('/', methods=('GET','POST'))
def main():
    if request.method == 'POST':
        print('got request')
        test = list(dict(request.form))[0]
        testobj = None
        for t in tests:
            if t.name == test:
                testobj = t
                testobj.toggle_run()
        print ('test',testobj)
        
    global tests    
    tests = generate_tests()
    return render_template('index.html',tests=tests)

def generate_tests():
    a_dir = "/home/pi/current_tests/"
    tests = [name for name in os.listdir(a_dir) if os.path.isdir(os.path.join(a_dir, name))]
    testobjs= [ TestObj(x,a_dir) for x in tests]
    return testobjs



if __name__ == '__main__':
    print(generate_tests())
    app.run(host='0.0.0.0', debug=True)

