import {from, to} from "./translate-engines";

export interface TranslateResponse {
	from: from
	to: to
	source: string
	translation: string
	speeches?: [{ //读音
		phonetic: string, // 音标
		speech: string, // 发音
		area: string // 地区
	}]
	explains?: [any] // 解释 说明
	extensions?: [{ // 形式扩充
		name: string,
		value: string
	}]
	isWord: boolean // 是否是单词
	link: [string]
}
