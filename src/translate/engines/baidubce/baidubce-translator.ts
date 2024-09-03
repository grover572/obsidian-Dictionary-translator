import {from, TranslationStrategy} from "../../const/translate-engines";
import DictionaryPlugin from "../../../main";
import {TranslateRequest} from "../../const/translate-request";
import {TranslateResponse} from "../../const/translate-response";
import {BaidubceConfigs} from "./baidubce-configs";
import {requestUrl} from "obsidian";

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
			return new class implements TranslateResponse {
				boomExplains: [{ type: string; explains: [string] }];
				explains: [any];
				extensions: [{ name: string; value: string }];
				from: from;
				isWord: boolean;
				link: [string];
				source: string;
				speeches: [{ phonetic: string; speech: string; area: string }];
				to: "to";
				translation: [string];
			}
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


}
