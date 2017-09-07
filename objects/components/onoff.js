//A dummy file run code which uses onoff library on a computer without the actual gpio hardware. Can be deleted if better solution is implemented


"use strict";

var fs = require('fs')


function Gpio(w,x) {
 this.x=x;
 
};

exports.Gpio = Gpio;

/**
 * Read GPIO value asynchronously.
 *
 * [callback: (err: error, value: number) => {}] // Optional callback
 */
Gpio.prototype.read = function (callback) {
 
};

/**
 * Read GPIO value synchronously.
 *
 * Returns - number // 0 or 1
 */
Gpio.prototype.readSync = function () {

};

/**
 * Write GPIO value asynchronously.
 *
 * value: number                  // 0 or 1
 * [callback: (err: error) => {}] // Optional callback
 */
Gpio.prototype.write = function (value, callback) {

};

/**
 * Write GPIO value synchronously.
 *
 * value: number // 0 or 1
 */
Gpio.prototype.writeSync = function (value) {

};

/**
 * Watch for hardware interrupts on the GPIO. Inputs and outputs can be
 * watched. The edge argument that was passed to the constructor determines
 * which hardware interrupts are watcher for.
 *
 * Note that the value passed to the callback does not represent the value of
 * the GPIO the instant the interrupt occured, it represents the value of the
 * GPIO the instant the GPIO value file is read which may be several
 * milliseconds after the actual interrupt. By the time the GPIO value is read
 * the value may have changed. There are scenarios where this is likely to
 * occur, for example, with buttons or switches that are not hadrware
 * debounced.
 *
 * callback: (err: error, value: number) => {}
 */
Gpio.prototype.watch = function (callback) {


};

/**
 * Stop watching for hardware interrupts on the GPIO.
 */
Gpio.prototype.unwatch = function (callback) {

};

/**
 * Remove all watchers for the GPIO.
 */
Gpio.prototype.unwatchAll = function () {

};

/**
 * Set GPIO direction.
 *
 * direction: string // Specifies whether the GPIO should be configured as an
 *                   // input or output. The valid values are: 'in', 'out',
 *                   // 'high', and 'low'. 'high' and 'low' are variants of
 *                   // 'out' that configure the GPIO as an output with an
 *                   // initial level of high or low respectively.
 */
Gpio.prototype.setDirection = function (direction) {

};

/**
 * Get GPIO interrupt generating edge.
 *
 * Returns - string // 'none', 'rising', 'falling' or 'both'
 */
Gpio.prototype.edge = function () {

};

/**
 * Set GPIO interrupt generating edge.
 *
 * edge: string // The interrupt generating edge for the GPIO. Can be
 *              // specified for GPIO inputs and outputs. The edge
 *              // specified determine what watchers watch for. The valid
 *              // values are: 'none', 'rising', 'falling' or 'both'.
 */
Gpio.prototype.setEdge = function (edge) {

};

/**
 * Get GPIO activeLow setting.
 *
 * Returns - boolean
 */
Gpio.prototype.activeLow = function () {

};

/**
 * Set GPIO activeLow setting.
 *
 * invert: boolean // Specifies whether the values read from or
 *                 // written to the GPIO should be inverted. The
 *                 // interrupt generating edge for the GPIO also
 *                 // follow this this setting. The valid values for
 *                 // activeLow are true and false. Setting activeLow
 *                 // to true inverts. The default value is false.
 */
Gpio.prototype.setActiveLow = function (invert) {

};

/**
 * Get GPIO options.
 *
 * Returns - object // Must not be modified
 */
Gpio.prototype.options = function () {
  return this.opts;
};

/**
 * Reverse the effect of exporting the GPIO to userspace. The Gpio object
 * should not be used after calling this method.
 */
Gpio.prototype.unexport = function () {

};

