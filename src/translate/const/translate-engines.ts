import {YoudaoTranslator} from "../engines/youdao/youdao-translator";
import {TranslateResponse} from "./translate-response";

export interface TranslationStrategy {
	config: EngineConfig;
	translate(text: string): TranslateResponse;
}

export interface EngineConfig {
	[key: string]: any;
}

export interface TranslateEngine {
	code: string;
	strategy: new (config: EngineConfig) => TranslationStrategy;
}

export const TranslateEngines: Record<string, TranslateEngine> = {
	youdao: {
		code: 'youdao',
		strategy: YoudaoTranslator,
	}
};






