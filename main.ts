//% color=#0fbc11 icon="\uf229" block="dCode"
namespace dCode {

    //% group="Actuators"
    //% blockId=servo_motor block="set servo %servo to %angle°"
    //% angle.min=0 angle.max=180
    //% servo.defl=Servo.S1
    export function setServoAngle(servo: Servo, angle: number): void {
        let pin = (servo == Servo.S1) ? AnalogPin.P6 : AnalogPin.P7;
        let pulseWidth = (angle * 2000) / 180 + 500; // Convert angle (0-180) to pulse width (500-2500µs)
        pins.servoSetPulse(pin, pulseWidth);
    }

    //% blockId=servo_enum block="%servo"
    //% blockHidden=true
    export enum Servo {
        //% block="S1"
        S1 = 0,
        //% block="S2"
        S2 = 1
    }



    //% group="Sensors"
    //% blockId=dht11_sensor block="read DHT11 %dhtData at pin %pin"
    //% pin.defl=DigitalPin.P2
    export function readDHT11(dhtData: DHT11Data, pin: DigitalPin): number {
        let buffer: number[] = [];
        let startTime: number;
        let signal: number;

        // Start signal
        pins.digitalWritePin(pin, 0);
        basic.pause(18);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(40);
        pins.setPull(pin, PinPullMode.PullUp);

        // Wait for response
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        // Read 40-bit data (5 bytes)
        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(pin) == 0);
            startTime = control.micros();
            while (pins.digitalReadPin(pin) == 1);
            signal = control.micros() - startTime;
            buffer.push(signal > 40 ? 1 : 0);
        }

        // Convert data
        let humidity = (buffer.slice(0, 8).reduce((a, b) => (a << 1) | b, 0));
        let temperature = (buffer.slice(16, 24).reduce((a, b) => (a << 1) | b, 0));

        return dhtData == DHT11Data.Temperature ? temperature : humidity;
    }

    //% blockId=dht11_data block="%dhtData"
    //% blockHidden=true
    export enum DHT11Data {
        //% block="Temperature (°C)"
        Temperature = 0,
        //% block="Humidity (%)"
        Humidity = 1
    }


    //% group="Sensors"
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

    //% group="Sensors"
    //% blockId=analog_sensor block="read Analog sensor at pin %pin"
    //% pin.defl=AnalogPin.P0
    export function readAnalogSensor(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }


    //% group="Sensors"
    //% blockId=digital_sensor block="read Digital sensor at pin %pin"
    //% pin.defl=DigitalPin.P1
    export function readDigitalSensor(pin: DigitalPin): number {
        return pins.digitalReadPin(pin);
    }



    //% group="LCD Display"
    /**
     * Displays text on an I2C 16x2 LCD display at a specified column and row.
     * @param text The text to display
     * @param col The column number (0-15)
     * @param row The row number (0 or 1)
     */
    //% blockId=i2c_lcd_display block="display %text=text on LCD at column %col row %row"
    //% col.min=0 col.max=15 row.min=0 row.max=1
    export function displayTextLCD(text: string | number | boolean, col: number, row: number): void {
        let addr = 0x27; // Default I2C address for 16x2 LCD
        let buf = pins.createBuffer(2);
        buf[0] = 0x80 | (row == 0 ? 0x00 : 0x40) | col; // Set cursor position
        pins.i2cWriteBuffer(addr, buf);

        // Convert non-string values to string
        let strText: string;
        if (typeof text === "boolean") {
            strText = text ? "true" : "false";
        } else {
            strText = "" + text; // Convert number to string
        }

        // Write text to LCD
        for (let i = 0; i < strText.length; i++) {
            buf[0] = strText.charCodeAt(i);
            pins.i2cWriteBuffer(addr, buf);
        }
    }




    //% group="LCD Display"
    /**
     * Clears the I2C 16x2 LCD display.
     */
    //% blockId=i2c_lcd_clear block="clear LCD display"
    export function clearLCD(): void {
        let addr = 0x27; // Default I2C address for 16x2 LCD
        let buf = pins.createBuffer(1);
        buf[0] = 0x01; // Clear display command
        pins.i2cWriteBuffer(addr, buf);
        basic.pause(2); // Wait for LCD to clear
    }



    //% group="LCD Display"
    //% blockId=i2c_lcd_scroll block="scroll %text on LCD speed %speed ms | direction %direction=scr_direction"
    //% speed.min=50 speed.max=500
    export function scrollTextLCD(text: string, speed: number, direction: ScrollDirection): void {
        let addr = 0x27; // Default I2C address for 16x2 LCD
        let buf = pins.createBuffer(1);

        // Display the initial text at position (0,0)
        displayTextLCD(text, 0, 0);

        // Scroll text left or right
        for (let i = 0; i < 16; i++) {
            buf[0] = (direction == ScrollDirection.Left) ? 0x18 : 0x1C; // LCD shift command
            pins.i2cWriteBuffer(addr, buf);
            basic.pause(speed);
        }
    }

    //% blockId=scr_direction block="%direction"
    //% blockHidden=true
    export enum ScrollDirection {
        //% block="Left"
        Left = 0,
        //% block="Right"
        Right = 1
    }


    //% group="LCD Display"
    //% blockId=i2c_lcd_backlight block="LCD backlight %state=backlight_state"
    export function setLcdBacklight(state: BacklightState): void {
        let addr = 0x27; // Default I2C address for 16x2 LCD
        let backlightCmd = (state == BacklightState.On) ? 0x08 : 0x00; // 0x08 = ON, 0x00 = OFF

        pins.i2cWriteNumber(addr, backlightCmd, NumberFormat.UInt8BE);
    }

    //% blockId=backlight_state block="%state"
    //% blockHidden=true
    export enum BacklightState {
        //% block="ON"
        On = 1,
        //% block="OFF"
        Off = 0
    }



    

}
