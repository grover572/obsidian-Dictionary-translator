import {LangTypeAndAuto} from "../../util/i18n";
import {moment} from "obsidian";
import {to} from "./translate-engines";

export interface SupportLang {
    [key: string]: {
        en: string
        cn: string
    }
}

export const support_lang: SupportLang = {
    "ar": {"en": "Arabic", "cn": "阿拉伯语"},
    "de": {"en": "German", "cn": "德语"},
    "en": {"en": "English", "cn": "英语"},
    "es": {"en": "Spanish", "cn": "西班牙语"},
    "fr": {"en": "French", "cn": "法语"},
    "id": {"en": "Indonesian", "cn": "印度尼西亚语"},
    "it": {"en": "Italian", "cn": "意大利语"},
    "ja": {"en": "Japanese", "cn": "日语"},
    "ko": {"en": "Korean", "cn": "韩语"},
    "nl": {"en": "Dutch", "cn": "荷兰语"},
    "pt": {"en": "Portuguese", "cn": "葡萄牙语"},
    "ru": {"en": "Russian", "cn": "俄语"},
    "th": {"en": "hai", "cn": "泰语"},
    "vi": {"en": "Vietnamese", "cn": "越南语"},
    "zh-CHS": {"en": "LChinese", "cn": "简体中文"},
    "zh-CHT": {"en": "Chinese", "cn": "繁体中文"},
    "am": {"en": "Amharic", "cn": "阿姆哈拉语"},
    "az": {"en": "Azeerbaijani", "cn": "阿塞拜疆语"},
    "be": {"en": "Belarusian", "cn": "白俄罗斯语"},
    "bg": {"en": "Bulgarian", "cn": "保加利亚语"},
    "bn": {"en": "Bangla", "cn": "孟加拉语"},
    "bs": {"en": "Bosnian (Latin)", "cn": "波斯尼亚语"},
    "ca": {"en": "Catalan", "cn": "加泰隆语"},
    "ceb": {"en": "Cebuano", "cn": "宿务语"},
    "co": {"en": "Corsican", "cn": "科西嘉语"},
    "cs": {"en": "Czech", "cn": "捷克语"},
    "cy": {"en": "Welsh", "cn": "威尔士语"},
    "da": {"en": "Danish", "cn": "丹麦语"},
    "el": {"en": "Greek", "cn": "希腊语"},
    "eo": {"en": "Esperanto", "cn": "世界语"},
    "et": {"en": "Estonian", "cn": "爱沙尼亚语"},
    "eu": {"en": "Basque", "cn": "巴斯克语"},
    "fa": {"en": "Persian", "cn": "波斯语"},
    "fi": {"en": "Finnish", "cn": "芬兰语"},
    "fj": {"en": "Fijian", "cn": "斐济语"},
    "fy": {"en": "Frisian", "cn": "弗里西语"},
    "ga": {"en": "Irish", "cn": "爱尔兰语"},
    "gd": {"en": "Scots", "cn": "苏格兰盖尔语"},
    "gl": {"en": "Galician", "cn": "加利西亚语"},
    "gu": {"en": "Gujarati", "cn": "古吉拉特语"},
    "ha": {"en": "Hausa", "cn": "豪萨语"},
    "haw": {"en": "Hawaiian", "cn": "夏威夷语"},
    "he": {"en": "Hebrew", "cn": "希伯来语"},
    "hi": {"en": "Hindi", "cn": "印地语"},
    "hr": {"en": "Croatian", "cn": "克罗地亚语"},
    "ht": {"en": "Haitian", "cn": "海地克里奥尔语"},
    "hu": {"en": "Hungarian", "cn": "匈牙利语"},
    "hy": {"en": "Armenian", "cn": "亚美尼亚语"},
    "ig": {"en": "Igbo", "cn": "伊博语"},
    "is": {"en": "Icelandic", "cn": "冰岛语"},
    "jw": {"en": "Javanese", "cn": "爪哇语"},
    "ka": {"en": "Georgian", "cn": "格鲁吉亚语"},
    "kk": {"en": "Kazakh", "cn": "哈萨克语"},
    "km": {"en": "Khmer", "cn": "高棉语"},
    "kn": {"en": "Kannada", "cn": "卡纳达语"},
    "ku": {"en": "Kurdish", "cn": "库尔德语"},
    "ky": {"en": "Kyrgyz", "cn": "柯尔克孜语"},
    "la": {"en": "Latin", "cn": "拉丁语"},
    "lb": {"en": "Luxembourgish", "cn": "卢森堡语"},
    "lo": {"en": "Lao", "cn": "老挝语"},
    "lt": {"en": "Lithuanian", "cn": "立陶宛语"},
    "lv": {"en": "Latvian", "cn": "拉脱维亚语"},
    "mg": {"en": "Malagasy", "cn": "马尔加什语"},
    "mi": {"en": "Maori", "cn": "毛利语"},
    "mk": {"en": "Macedonian", "cn": "马其顿语"},
    "ml": {"en": "Malayalam", "cn": "马拉雅拉姆语"},
    "mn": {"en": "Mongolian", "cn": "蒙古语"},
    "mr": {"en": "Marathi", "cn": "马拉地语"},
    "ms": {"en": "Malay", "cn": "马来语"},
    "mt": {"en": "Maltese", "cn": "马耳他语"},
    "mww": {"en": "Hmong", "cn": "白苗语"},
    "my": {"en": "Myanmar (Burmese)", "cn": "缅甸语"},
    "ne": {"en": "Nepali", "cn": "尼泊尔语"},
    "no": {"en": "Norwegian", "cn": "挪威语"},
    "ny": {"en": "Nyanja (Chichewa)", "cn": "齐切瓦语"},
    "otq": {"en": "Querétaro Otomi", "cn": "克雷塔罗奥托米语"},
    "pa": {"en": "Punjabi", "cn": "旁遮普语"},
    "pl": {"en": "Polish", "cn": "波兰语"},
    "ps": {"en": "Pashto", "cn": "普什图语"},
    "ro": {"en": "Romanian", "cn": "罗马尼亚语"},
    "sd": {"en": "Sindhi", "cn": "信德语"},
    "si": {"en": "Sinhala (Sinhalese)", "cn": "僧伽罗语"},
    "sk": {"en": "Slovak", "cn": "斯洛伐克语"},
    "sl": {"en": "Slovenian", "cn": "斯洛文尼亚语"},
    "sm": {"en": "Samoan", "cn": "萨摩亚语"},
    "sn": {"en": "Shona", "cn": "修纳语"},
    "so": {"en": "Somali", "cn": "索马里语"},
    "sq": {"en": "Albanian", "cn": "阿尔巴尼亚语"},
    "sr-Cyrl": {"en": "Serbian (Cyrillic)", "cn": "塞尔维亚语(西里尔文)"},
    "sr-Latn": {"en": "Serbian (Latin)", "cn": "塞尔维亚语(拉丁文)"},
    "st": {"en": "Sesotho", "cn": "塞索托语"},
    "su": {"en": "Sundanese", "cn": "巽他语"},
    "sv": {"en": "Swedish", "cn": "瑞典语"},
    "sw": {"en": "Kiswahili", "cn": "斯瓦希里语"},
    "ta": {"en": "Tamil", "cn": "泰米尔语"},
    "te": {"en": "Telugu", "cn": "泰卢固语"},
    "tg": {"en": "Tajik", "cn": "塔吉克语"},
    "tl": {"en": "Filipino", "cn": "菲律宾语"},
    "tlh": {"en": "Klingon", "cn": "克林贡语"},
    "to": {"en": "Tongan", "cn": "汤加语"},
    "tr": {"en": "Turkish", "cn": "土耳其语"},
    "ty": {"en": "Tahitian", "cn": "塔希提语"},
    "uk": {"en": "Ukrainian", "cn": "乌克兰语"},
    "ur": {"en": "Urdu", "cn": "乌尔都语"},
    "uz": {"en": "Uzbek", "cn": "乌兹别克语"},
    "xh": {"en": "Xhosa", "cn": "南非科萨语"},
    "yi": {"en": "Yiddish", "cn": "意第绪语"},
    "yo": {"en": "Yoruba", "cn": "约鲁巴语"},
    "yua": {"en": "Yucatec", "cn": "尤卡坦玛雅语"},
    "yue": {"en": "Cantonese (Traditional)", "cn": "粤语"},
    "zu": {"en": "Zulu", "cn": "南非祖鲁语"}
}

export function getLanguageOptions(lang: LangTypeAndAuto): Record<string, string> {

    let l: "cn" | "en" = "cn";
    if (lang === "en" || (lang === "auto" && moment.locale().replace("-", "_") === "en")) {
        l = "en";
    }

    const languageMap = Object.entries(support_lang).reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = value[l];
        return acc;
    }, {});
    return languageMap;
}

export function getLangName(target: to, lang: LangTypeAndAuto): string {
    let l: "cn" | "en" = "cn";
    if (lang === "en" || (lang === "auto" && moment.locale().replace("-", "_") === "en")) {
        l = "en";
    }
    return support_lang[target][l];
}
