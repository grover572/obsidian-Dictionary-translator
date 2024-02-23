import {App, Modal, PluginSettingTab, Setting} from "obsidian";
import DictionaryPlugin from "./main";
import {LangTypeAndAuto} from "./util/i18n";

export interface DictionarySettings {
	engine: "youdao" | "tencent" | string;
	lang: LangTypeAndAuto
}

export const DEFAULT_SETTINGS: DictionarySettings = {
	engine: 'youdao',
	lang: "auto"
}

export class DictionarySettingTab extends PluginSettingTab {
	plugin: DictionaryPlugin;

	constructor(app: App, plugin: DictionaryPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {

		const {containerEl} = this;
		containerEl.empty();

		containerEl.createEl("h1", { text: "Dictionary  Settings" });
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
				// console.log(this.plugin.settings.token)
				// this.plugin.settings.token = {appKey:value}
				await this.plugin.saveSettings();
			}))

	}
}
