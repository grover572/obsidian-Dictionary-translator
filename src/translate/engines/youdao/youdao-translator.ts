import {TranslationStrategy} from "../../const/translate-engines";
import CryptoJS from 'crypto-js';
import {YoudaoConfigs} from "./youdao-configs";
import {TranslateResponse} from "../../const/translate-response";
import {TranslateRequest} from "../../const/translate-request";
import {NullConfigError} from "../../const/null_config_error";
import {findEmptyKeys} from "../../../util/utils";
import jsonp from "../../../util/jsonp";
import {Notice} from "obsidian";
import DictionaryPlugin from "../../../main";
import {from, to} from "../../const/translate-engines";

const YOUDAO_API = "https://openapi.youdao.com/api"

const LANG_MAP: { [key in from]: string } = {
    en: "en",
    cn: "zh-CHS"
}

export class YoudaoTranslator implements TranslationStrategy {
    plugin: DictionaryPlugin;
    config: YoudaoConfigs;

    constructor(config: YoudaoConfigs, plugin: DictionaryPlugin) {
        if (config.appKey && config.appSecret) {
            this.config = config;
            this.plugin = plugin;
        } else {
            throw new NullConfigError(...findEmptyKeys(config));
        }
    }

    async translate(request: TranslateRequest): Promise<TranslateResponse> {
        try {
            return this.parseResponse(await jsonp<YoudaoApiResponse>(YOUDAO_API, {
                appKey: this.config.appKey,
                ...this.covertLang(request),
                q: request.words,
                signType: "v3",
                ...this.generateSign(request.words)
            }));
        } catch (error) {
            throw error;
        }
    }

    private generateSign(token: string): Record<string, any> {
        const salt = (new Date()).getTime();
        const curTime = Math.round(new Date().getTime() / 1000);
        const len = token.length;
        console.log(token)
        if (len > 20) token = token.substring(0, 10) + len + token.substring(len - 10, len);
        return {
            salt,
            curtime: curTime,
            sign: CryptoJS.SHA256(this.config.appKey + token + salt + curTime + this.config.appSecret).toString(CryptoJS.enc.Hex)
        }
    }

    private parseResponse(param: YoudaoApiResponse): TranslateResponse | any {
        if (param.errorCode != "0") {
            const i18n = this.plugin.i18n;
            const message = i18n.t("engine_translate_exception", {
                engine: i18n.t("youdao"),
                code: param.errorCode
            });
            new Notice(message);
            throw new Error(message)
        }

        return {};
    }

    private covertLang(request: TranslateRequest): { from: string, to: string } {
        return {from: LANG_MAP[request.from], to: "to"}
    }
}

interface YoudaoApiResponse {
    returnPhrase: string[];
    query: string;
    errorCode: string;
    l: string;
    tSpeakUrl: string;
    web: Array<{
        value: string[];
        key: string;
    }>;
    requestId: string;
    translation: string[];
    mTerminalDict: {
        url: string;
    };
    dict: {
        url: string;
    };
    webdict: {
        url: string;
    };
    basic: {
        exam_type: string[];
        "us-phonetic": string;
        phonetic: string;
        "uk-phonetic": string;
        wfs: Array<{
            wf: {
                name: string;
                value: string;
            };
        }>;
        "uk-speech": string;
        explains: string[];
        "us-speech": string;
    };
    isWord: boolean;
    speakUrl: string;
}
