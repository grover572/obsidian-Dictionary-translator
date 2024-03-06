import {App, Modal} from "obsidian";
import {createApp, App as VueApp} from "vue";
import TranslationModalComponent from "./TranslationModalComponent.vue";
import {TranslateResponse} from "../const/translate-response";
import DictionaryPlugin from "../../main";

export class TranslationModal extends Modal {

	component: VueApp;
	data: TranslateResponse | undefined;
	plugin: DictionaryPlugin;

	constructor(plugin: DictionaryPlugin, data: TranslateResponse | undefined) {
		super(plugin.app);
		this.data = data;
		this.plugin = plugin;
	}


	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		const app = createApp(TranslationModalComponent, {"response": {
				"isWord": true,
				"from": "en",
				"to": "zh-CHS",
				"source": "hello",
				"translation": [
					"你好"
				],
				"speeches": [
					{
						"phonetic": "həˈləʊ",
						"speech": "https://openapi.youdao.com/ttsapi?q=hello&langType=en&sign=56F1F23D0A70925A9E0ECCADE165D06B&salt=1709735801002&voice=5&format=mp3&appKey=7476cfed3071763c&ttsVoiceStrict=false&osType=api",
						"area": "uk"
					},
					{
						"phonetic": "həˈloʊ",
						"speech": "https://openapi.youdao.com/ttsapi?q=hello&langType=en&sign=56F1F23D0A70925A9E0ECCADE165D06B&salt=1709735801002&voice=6&format=mp3&appKey=7476cfed3071763c&ttsVoiceStrict=false&osType=api",
						"area": "us"
					}
				],
				"explains": [
					"int. 喂，你好（用于问候或打招呼）；喂，你好（打电话时的招呼语）；喂，你好（引起别人注意的招呼语）；<非正式>喂，嘿 (认为别人说了蠢话或分心)；<英，旧>嘿（表示惊讶）",
					"n. 招呼，问候；（Hello）（法、印、美、俄）埃洛（人名）",
					"v. 说（或大声说）“喂”；打招呼"
				],
				"extensions": [
					{
						"name": "复数",
						"value": "hellos"
					},
					{
						"name": "第三人称单数",
						"value": "helloes"
					},
					{
						"name": "现在分词",
						"value": "helloing"
					},
					{
						"name": "过去式",
						"value": "helloed"
					},
					{
						"name": "过去分词",
						"value": "helloed"
					}
				],
				"link": [
					"http://mobile.youdao.com/dict?le=eng&q=hello"
				]
			}, "plugin": this.plugin});
		this.component = app;
		app.mount(contentEl);
	}

	onClose() {
		const {contentEl} = this;
		this.component.unmount();
		contentEl.empty();
	}
}
