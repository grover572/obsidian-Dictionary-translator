export interface TranslatorSaveData {
	calloutType?: calloutType
	title: string
	content: string
	record: ArrayBuffer
}

type calloutType = "translator-card-callout"
