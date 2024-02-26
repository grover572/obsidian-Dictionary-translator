import {YoudaoTranslator} from "../engines/youdao/youdao-translator";
import {TranslateResponse} from "./translate-response";
import {TranslateRequest} from "./translate-request";
import {Plugin} from "obsidian";
import DictionaryPlugin from "../../main";

export abstract class TranslationStrategy {
    config: EngineConfig;
    plugin: Plugin;

    abstract translate(request: TranslateRequest): Promise<TranslateResponse>; // async func
}

export class EngineConfig {
    [key: string]: any;
}

export interface TranslateEngine {
    strategy: new (config: EngineConfig, plugin: DictionaryPlugin) => TranslationStrategy;
}

export type SupportEngine = "youdao"

export type from = "en" | "cn"
export type to = "en" | "cn"

export const TranslateEngines: Record<SupportEngine, TranslateEngine> = {
    youdao: {
        strategy: YoudaoTranslator,
    }
};







