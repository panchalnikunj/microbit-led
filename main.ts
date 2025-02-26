//% color=#0fbc11 icon="\uf2c9" block="dCode"
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

    /**
     * Displays text on an I2C 16x2 LCD display at a specified row and column.
     * @param text The text to display
     * @param row The row number (0 or 1)
     * @param col The column number (0-15)
     */
    //% blockId=i2c_lcd_display block="display %text on LCD at row %row column %col"
    //% row.min=0 row.max=1 col.min=0 col.max=15
    export function displayTextLCD(text: string, row: number, col: number): void {
        let addr = 0x27; // Default I2C address for 16x2 LCD
        let buf = pins.createBuffer(2);
        buf[0] = 0x80 | (row == 0 ? 0x00 : 0x40) | col; // Set cursor to row and column
        pins.i2cWriteBuffer(addr, buf);
        for (let i = 0; i < text.length; i++) {
            buf[0] = text.charCodeAt(i);
            pins.i2cWriteBuffer(addr, buf);
        }
    }
}