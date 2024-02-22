import {App, Modal, PluginSettingTab, Setting} from "obsidian";
import WordBookPlugin from "./main";

export interface MyPluginSettings {
	engine: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	engine: 'youdao'
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



	}
}
