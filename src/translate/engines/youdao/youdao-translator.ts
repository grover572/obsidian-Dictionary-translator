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
import {from} from "../../const/translate-engines";

const YOUDAO_API = "https://openapi.youdao.com/api"

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
                q: request.words,
                signType: "v3",
                from: request.from,
                to: request.to,
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
        if (len > 20) token = token.substring(0, 10) + len + token.substring(len - 10, len);
        return {
            salt,
            curtime: curTime,
            sign: CryptoJS.SHA256(this.config.appKey + token + salt + curTime + this.config.appSecret).toString(CryptoJS.enc.Hex)
        }
    }

    private parseResponse(youdaoApiResponse: YoudaoApiResponse): TranslateResponse | any {
        if (youdaoApiResponse.errorCode != "0") {
            const i18n = this.plugin.i18n;
            const message = i18n.t("engine_translate_exception", {
                engine: i18n.t("youdao"),
                code: youdaoApiResponse.errorCode
            });
            new Notice(message);
            throw new Error(message)
        }
        console.log(youdaoApiResponse)
        const lang = youdaoApiResponse.l.split("2");
        const result: TranslateResponse | any = {
            isWord: youdaoApiResponse.isWord,
            from: lang[0],
            to: lang[1],
            source: youdaoApiResponse.query,
            translation: youdaoApiResponse.translation
        };
        return youdaoApiResponse.isWord ? {
            ...result,
            speeches: result.from == "en" ? [{
                phonetic: youdaoApiResponse?.basic?.["uk-phonetic"],
                speech: youdaoApiResponse?.basic?.["uk-speech"],
                area: "uk"
            }, {
                phonetic: youdaoApiResponse?.basic?.["us-phonetic"],
                speech: youdaoApiResponse?.basic?.["us-speech"],
                area: "us"
            }] : [],
            explains: youdaoApiResponse.basic.explains,
            extensions: youdaoApiResponse.basic?.wfs?.map(item => ({name: item?.wf?.name, value: item?.wf?.value})),
            isWord: youdaoApiResponse.isWord,
            link: [youdaoApiResponse.dict.url]
        } : {
            ...result,
            speeches: [{speech: youdaoApiResponse?.speakUrl}],
            link: [youdaoApiResponse.mTerminalDict.url]
        };
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
