//% color=#0fbc11 icon="\f544" block="d-Code"
namespace dCode {
    /**
     * Measures distance in centimeters using an HC-SR04 sensor.
     * @param trigPin The trigger pin
     * @param echoPin The echo pin
     */
    //% blockId=ultrasonic_distance block="measure distance trig %trigPin| echo %echoPin"
    //% trigPin.defl=DigitalPin.P0 echoPin.defl=DigitalPin.P1
    export function measureDistance(trigPin: DigitalPin, echoPin: DigitalPin): number {
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);

        let duration = pins.pulseIn(echoPin, PulseValue.High, 23000);
        let distance = duration / 58;

        return distance > 400 ? 400 : distance; // Limit to 400 cm (sensor range)
    }

    /**
     * Reads the value from an IR sensor.
     * @param irPin The pin connected to the IR sensor
     */
    //% blockId=ir_sensor_read block="read IR sensor at %irPin"
    //% irPin.defl=DigitalPin.P2
    export function readIRSensor(irPin: DigitalPin): boolean {
        return pins.digitalReadPin(irPin) == 0;
    }
}
