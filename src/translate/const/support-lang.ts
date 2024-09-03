import {LangTypeAndAuto} from "../../util/i18n";
import {moment} from "obsidian";
import {SupportEngine, to} from "./translate-engines";

export interface SupportLang {
	[key: string]: {
		en: string
		cn: string
		engine: Record<SupportEngine, string> // 引擎自身的的语言编码
	}
}

export const support_lang: SupportLang = {
	"en": {"en": "English", "cn": "英语", engine: {youdao: "en", baidubce: "en"}},
	"fr": {"en": "French", "cn": "法语", engine: {youdao: "fr", baidubce: "fra"}},
	"ja": {"en": "Japanese", "cn": "日语", engine: {youdao: "ja", baidubce: "jp"}},
	"ko": {"en": "Korean", "cn": "韩语", engine: {youdao: "ko", baidubce: "kor"}},
	"zh-CHS": {"en": "LChinese", "cn": "简体中文", engine: {youdao: "zh-CHS", baidubce: "zh"}},
	"zh-CHT": {"en": "Chinese", "cn": "繁体中文", engine: {youdao: "zh-CHT", baidubce: "cht"}},
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
