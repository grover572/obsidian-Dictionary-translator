import {YoudaoTranslator} from "../engines/youdao/youdao-translator";
import {TranslateResponse} from "./translate-response";
import {TranslateRequest} from "./translate-request";
import DictionaryPlugin from "../../main";
import {support_lang} from "./support-lang";
import {BaiduBceTranslator} from "../engines/baidubce/baidubce-translator";

export abstract class TranslationStrategy {
    config: EngineConfig;
    plugin: DictionaryPlugin;

    abstract translate(request: TranslateRequest): Promise<TranslateResponse>; // async func
}

export class EngineConfig {
    [key: string]: any;
}

export interface TranslateEngine {
    strategy: new (config: EngineConfig, plugin: DictionaryPlugin) => TranslationStrategy;
}

export type from = keyof typeof support_lang | "auto"
export type to = keyof typeof support_lang

export type SupportEngine = "youdao" | "baidubce"

export const TranslateEngines: Record<SupportEngine, TranslateEngine> = {
    youdao: {
        strategy: YoudaoTranslator,
    },
	baidubce:{
		strategy: BaiduBceTranslator
	}
};
