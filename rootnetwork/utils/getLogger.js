import pino from "pino"
import pretty from "pino-pretty"

export function getLogger() {
    return pino({
        transport: {
            target: "pino-pretty",
        },
    })
}
