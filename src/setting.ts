import {App, Modal, PluginSettingTab, Setting} from "obsidian";
import WordBookPlugin from "./main";
import {Token} from "./Token";
import {YoudaoToken} from "./translate/youdao/youdaoToken";
import {LangTypeAndAuto} from "./i18n";

export interface WordBookSettings {
	engine: "youdao" | "tencent" | string;
	token: Token | null,
	lang: LangTypeAndAuto
}

export const DEFAULT_SETTINGS: WordBookSettings = {
	engine: 'youdao',
	token: null,
	lang: "auto"
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

		// containerEl.createEl("h1", { text: "Remotely Save" });
		//
		// const serviceChooserDiv = containerEl.createDiv();
		// serviceChooserDiv.createEl("h2", { text: t("settings_chooseservice") });

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
