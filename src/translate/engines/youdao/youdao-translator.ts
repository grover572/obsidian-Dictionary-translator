import {TranslationStrategy} from "../../const/translate-engines";
import CryptoJS from 'crypto-js';
import {YoudaoConfigs} from "./youdao-configs";
import {TranslateResponse} from "../../const/translate-response";
import {Notice} from "obsidian";
import {TranslateRequest} from "../../const/translate-request";
import {NullConfigError} from "../../const/null_config_error";
import {findEmptyKeys} from "../../../util/utils";
import jsonp from "../../../util/jsonp";


export class YoudaoTranslator implements TranslationStrategy {

	config: YoudaoConfigs;

	constructor(config: YoudaoConfigs) {
		if (config.appKey && config.appSecret) {
			this.config = config;
			console.log(config)
		} else {
			throw new NullConfigError(...findEmptyKeys(config));
		}
	}

	translate(request: TranslateRequest): TranslateResponse {
		const sign = this.generateSign(request.words);
		jsonp('https://openapi.youdao.com/api', {
			appKey: this.config.appKey,
			from: request.from,
			to: request.to,
			q: request.words,
			signType: "v3",
			...sign
		})
			.then(res => console.log(res))
			.catch(error => console.log(error))
		return {}
	}

	private generateSign(token: string): Record<string, any> {
		const salt = (new Date()).getTime();
		const curTime = Math.round(new Date().getTime() / 1000);
		const len = token.length;
		console.log(token)
		if (len > 20) token = token.substring(0, 10) + len + token.substring(len - 10, len);
		return {
			salt, curTime,
			sign: CryptoJS.SHA256("7476cfed3071763c" + token + salt + curTime + "hQUJI5m5hf38mVwYW8Zw4hVycYavBqNX").toString(CryptoJS.enc.Hex)
		}
	}

// // 数据和配置
// 	let appKey = '7476cfed3071763c';
// 	let key = 'hQUJI5m5hf38mVwYW8Zw4hVycYavBqNX'; // 注意：暴露appSecret，有被盗用造成损失的风险
// 	let to = 'zh-CHS';
// 	let from = 'en';

// JSONP 函数
// 	private jsonp(url: string, data: any, callback: (data: any) => void) {
// 		console.log(data)
// 		try {
// 			// 创建 callback 函数名
// 			const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
// 			// eslint-disable-next-line no-debugger
// 			// 定义全局处理函数
// 			(window as any)[callbackName] = function (response: any) {
// 				delete (window as any)[callbackName];
// 				document.body.removeChild(script);
// 				callback(response);
// 			};
//
// 			// 添加 data 参数和 JSONP callback 参数
// 			let src = url + (url.indexOf('?') === -1 ? '?' : '&') + new URLSearchParams(data).toString();
// 			src += '&callback=' + callbackName;
// 			console.log(callbackName)
// 			// 创建并插入 script 标签
// 			const script = document.createElement('script');
// 			script.src = src;
// 			document.body.appendChild(script);
// 		} catch (e) {
// 			new Notice(e.toString());
// 		}
// 	}
}


