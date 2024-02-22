import {App, Modal, PluginSettingTab, Setting} from "obsidian";
import WordBookPlugin from "./main";
import {Token} from "./interface/Token";
import {YoudaoToken} from "./translate/youdao/youdaoToken";

export interface WordBookSettings {
	engine: "youdao" | "tencent" | string;
	token: Token | null
}

export const DEFAULT_SETTINGS: WordBookSettings = {
	engine: 'youdao',
	token: null
}

export class WordBookSettingTab extends PluginSettingTab {
	plugin: WordBookPlugin;

	constructor(app: App, plugin: WordBookPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {

		const {containerEl} = this;
		containerEl.empty();

		const engine = new Setting(containerEl);
		engine.setName('翻译引擎')
			.setDesc('translation engine')
			.addDropdown(cb => cb.addOptions({
					"youdao": "有道翻译",
					"tencent": "腾讯翻译"
				}).onChange(async (value) => {
					console.log(value)
					this.plugin.settings.engine = value;
					await this.plugin.saveSettings();
				})
			);

		const appKey = new Setting(containerEl);
		appKey.setName("appKey")
			.addText(component => component.onChange(async value => {
				console.log(this.plugin.settings.token)
				this.plugin.settings.token = {appKey:value}
				await this.plugin.saveSettings();
			}))

	}
}
