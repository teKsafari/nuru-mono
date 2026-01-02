export interface Gpio {
    pin: number
    mode: "input" | "output"
    state: "HIGH" | "LOW"
}

