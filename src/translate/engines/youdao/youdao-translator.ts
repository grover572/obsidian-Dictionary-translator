import {EngineConfig, TranslationStrategy} from "../../const/translate-engines";
import CryptoJS from 'crypto-js';
import {YoudaoConfigs} from "./youdao-configs";
import {TranslateResponse} from "../../const/translate-response";


export class YoudaoTranslator implements TranslationStrategy {

	config: YoudaoConfigs;

	constructor(config: YoudaoConfigs) {
		this.config = config;
	}

	translate(text: string): TranslateResponse {
		return ""
	}

}

// 定义 truncate 函数
function truncate(q: string): string {
	let len = q.length;
	if (len <= 20) return q;
	return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// 数据和配置
let appKey = '7476cfed3071763c';
let key = 'hQUJI5m5hf38mVwYW8Zw4hVycYavBqNX'; // 注意：暴露appSecret，有被盗用造成损失的风险
let to = 'zh-CHS';
let from = 'en';

// JSONP 函数
function jsonp(url: string, data: any, callback: (data: any) => void) {
	// 创建 callback 函数名
	let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
	// 定义全局处理函数
	(window as any)[callbackName] = function (response: any) {
		delete (window as any)[callbackName];
		document.body.removeChild(script);
		callback(response);
	};

	// 添加 data 参数和 JSONP callback 参数
	let src = url + (url.indexOf('?') === -1 ? '?' : '&') + new URLSearchParams(data).toString();
	src += '&callback=' + callbackName;

	// 创建并插入 script 标签
	let script = document.createElement('script');
	script.src = src;
	document.body.appendChild(script);
}

// 使用 JSONP 函数发送请求
export default function youdaoTranslator(token: string) {
	const salt = (new Date()).getTime();
	const curtime = Math.round(new Date().getTime() / 1000);
	jsonp('https://openapi.youdao.com/api', {
		appKey,
		salt,
		from,
		to,
		curtime,
		q: token,
		sign: CryptoJS.SHA256(appKey + truncate(token) + salt + curtime + key).toString(CryptoJS.enc.Hex),
		signType: "v3",
	}, (data) => {
		console.log(data);
	});
}






