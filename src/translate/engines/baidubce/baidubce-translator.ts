import {EngineConfig, from, TranslationStrategy} from "../../const/translate-engines";
import DictionaryPlugin from "../../../main";
import {TranslateRequest} from "../../const/translate-request";
import {TranslateResponse} from "../../const/translate-response";
import axios from "axios";
import {BaidubceConfigs} from "./baidubce-configs";
import {YoudaoConfigs} from "../youdao/youdao-configs";
import {NullConfigError} from "../../const/null_config_error";
import {findEmptyKeys} from "../../../util/utils";
import jsonp from "../../../util/jsonp";

export class BaiduBceTranslator implements TranslationStrategy {
	config: BaidubceConfigs;
	plugin: DictionaryPlugin;

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
			console.log(this.config)
			this.getAccessToken()
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

		const rsp = await jsonp(url,{client_id:this.config.apiKey,client_secret:this.config.secretKey,grant_type:'client_credentials'})
		console.log(rsp)
	}


}
