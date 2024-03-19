declare namespace NodeJS {
    interface ProcessEnv {
        BOT_TOKEN?: string
        HOST: string,
        PORT?: number,
        PASSWORD: string,
    }
}