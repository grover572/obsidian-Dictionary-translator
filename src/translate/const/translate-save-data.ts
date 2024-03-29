export interface TranslatorSaveData {
    calloutType?: calloutType
    title: string
    content: string[]
    radio: ArrayBuffer | null,
    radioLabel: string | null
}

type calloutType = "translator-card-callout"
