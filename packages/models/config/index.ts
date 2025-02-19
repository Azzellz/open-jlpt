export interface OpenJLPT_AI {
    name: string
    apiKey: string
    baseURL: string
    modelID: string
}

export interface OpenJLPT_Config {
    id: string
    ai: OpenJLPT_AI[]
}
