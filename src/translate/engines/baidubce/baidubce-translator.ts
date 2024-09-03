import {from, TranslationStrategy} from "../../const/translate-engines";
import DictionaryPlugin from "../../../main";
import {TranslateRequest} from "../../const/translate-request";
import {TranslateResponse} from "../../const/translate-response";
import {BaidubceConfigs} from "./baidubce-configs";
import {requestUrl, RequestUrlResponse} from "obsidian";
import * as url from "url";

const BAIDUBCE_TRANSLATE_API = "https://aip.baidubce.com/rpc/2.0/mt/texttrans-with-dict/v1";

export class BaiduBceTranslator implements TranslationStrategy {
	config: BaidubceConfigs;
	plugin: DictionaryPlugin;

	accessToken: string;

	constructor(config: BaidubceConfigs, plugin: DictionaryPlugin) {
		if (config.apiKey && config.secretKey) {
			this.config = config;
			this.plugin = plugin;
		} else {
			throw new Error("配置项缺失");
		}
	}

	async translate(request: TranslateRequest): Promise<TranslateResponse> {
		try {
			await this.getAccessToken();
			console.log(request)
			return this.parseResponse(await requestUrl({
				url: BAIDUBCE_TRANSLATE_API + "?access_token=" + this.accessToken,
				method: "POST",
				contentType: "application/json;charset=utf-8",
				body: JSON.stringify({
					from: "auto",
					// TODO 插件语种 => 引擎语种的映射
					to: request.to === "cn" ? "zh" : request.to,
					q: request.words
				})
			}));
		} catch (error) {
			throw error;
		}
	}

	async getAccessToken() {
		const clientId = this.config.apiKey;
		const clientSecret = this.config.secretKey;
		const url = `https://aip.baidubce.com/oauth/2.0/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
		try {
			// requestUrl 忽略跨域检测
			const response = await requestUrl(url);
			if (response.status != 200 || !response?.json?.access_token) {
				throw new Error("请求百度智能云时失败，HTTP StatusCode:" + response.status);
			}
			this.accessToken = response.json.access_token;
		} catch (e) {
			console.error("Error details:", e);
			throw new Error("请求百度智能云时异常，请检查apiKey与secretKey; 详细信息：" + e.message);
		}

	}


	private parseResponse(requestUrlResponse: RequestUrlResponse): TranslateResponse {
		const transResult = requestUrlResponse?.json?.result?.trans_result?.[0];
		if (!transResult) {
			throw new Error("翻译引擎结果为空");
		}
		console.log(JSON.stringify(transResult))

		const dict = transResult.dict && JSON.parse(transResult.dict);
		const src_tts = transResult.src_tts;
		const isWord = !(!dict);

		const simpleMeans = dict?.word_result?.simple_means;

		console.log(simpleMeans)

		console.log(isWord)

		console.log(dict)

		return {
			// boomExplains: [
			//
			// ],
			// explains: [],
			// extensions: [],
			// from:  transResult.src,
			// isWord: isWord,
			// link: [],
			// source: string,
			// speeches: [{ phonetic: string; speech: string; area: string }],
			// to: transResult.dst,
			// translation: [string]
		}
	}
}
