export interface OpenJLPT_LLM {
    id: string
    name: string
    apiKey: string
    baseURL: string
    modelID: string
}

export interface OpenJLPT_Config {
    id: string
    llms: OpenJLPT_LLM[]
}
