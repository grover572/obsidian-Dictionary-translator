export interface TranslatorSaveData {
	calloutType?: calloutType
	title: string
	content: string[]
	record: ArrayBuffer | null
}

type calloutType = "translator-card-callout"
