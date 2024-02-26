import {from, to} from "./translate-engines";

export interface TranslateResponse {
    from: from
    to: to
    fromSource: string
    toSource: string
    speeches?: [{
        phonetic: string, // 音标
        speech: string, // 发音
        area: string // 地区
    }]
    explains?: [any] // shiyi
    extensions: [{
        name: string,
        value: string
    }]
    isWord: boolean
}
