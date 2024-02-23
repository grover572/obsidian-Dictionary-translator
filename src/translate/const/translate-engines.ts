import {YoudaoTranslator} from "../engines/youdao/youdao-translator";
import {TranslateResponse} from "./translate-response";

export interface TranslationStrategy {
	config: EngineConfig;
	translate(text: string): TranslateResponse;
}

export class EngineConfig {
	[key: string]: any;
}

export interface TranslateEngine {
	strategy: new (config: EngineConfig) => TranslationStrategy;
}

export type SupportEngine = "youdao" | "google"

export const TranslateEngines: Record<SupportEngine, TranslateEngine> = {
	youdao: {
		strategy: YoudaoTranslator,
	},
	google : {
		strategy: YoudaoTranslator
	}
};







