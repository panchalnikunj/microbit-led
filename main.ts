namespace screenMagic {
    /**
     * Address LEDs liners
     * Min 0 Max 25
     */
    export function plotAt(index : number): void{
        index |= 0
        const y = Math.floor(index / 5);
        const x = Math.floor(index % 5);
        led.plot(x,y)
    }
}