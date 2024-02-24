import {App, Modal, Notice, PluginSettingTab, Setting, TextComponent} from "obsidian";
import DictionaryPlugin from "./main";
import {LangTypeAndAuto, I18nKey, I18n} from "./util/i18n";
import {EngineConfig, SupportEngine, TranslateEngines} from "./translate/const/translate-engines";
import {createElement, Eye, EyeOff} from "lucide";
import {YoudaoConfigs} from "./translate/engines/youdao/youdao-configs";

export interface DictionarySettings {
	engine: keyof typeof TranslateEngines;
	lang: LangTypeAndAuto,
	engineConfig: EngineConfig
}

export const DEFAULT_SETTINGS: DictionarySettings = {
	engine: "youdao",
	lang: "auto",
	engineConfig: new YoudaoConfigs("", "")
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
		const i18n = (x: I18nKey, vars?: any) => {
			return this.plugin.i18n.t(x, vars);
		};

		// title
		containerEl.createEl("h1", {text: "Dictionary Settings"});

		// Div : enginesChooserDiv
		const enginesChooserDiv = containerEl.createDiv();

		/**
		 * ==========
		 * ==youdao==
		 * ==========
		 */
		const youdaoEngineDiv = containerEl.createDiv();
		youdaoEngineDiv.toggleClass("settings-hide", this.plugin.settings.engine !== "youdao")

		youdaoEngineDiv.createEl("h5", {text: i18n("guide", {engine: i18n("youdao")}) + ":"})
		let youdaoGuideP = youdaoEngineDiv.createEl("p");
		youdaoGuideP.createEl("a", {
			href: "https://ai.youdao.com/console/",
			text: i18n("youdao_console"),
		});
		youdaoGuideP.createEl("span", {text: i18n("youdao_guide")})


		new Setting(youdaoEngineDiv)
			.setName(i18n("youdao_app_key"))
			.setDesc("AppKey")
			.addText((text) => {
				wrapTextWithPasswordHide(text);
				text
					.setValue(`${(this.plugin.settings.engineConfig as YoudaoConfigs).appKey ?? ""}`)
					.onChange(async (value) => {
						this.setConfigValue(this.plugin.settings.engineConfig, 'appKey', value)
						await this.plugin.saveSettings();
					});
			});

		new Setting(youdaoEngineDiv)
			.setName(i18n("youdao_app_secret"))
			.setDesc("AppSecret")
			.addText((text) => {
				wrapTextWithPasswordHide(text);
				text
					.setValue(`${(this.plugin.settings.engineConfig as YoudaoConfigs).appSecret ?? ""}`)
					.onChange(async (value) => {
						this.setConfigValue(this.plugin.settings.engineConfig, 'appSecret', value)
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(i18n("connect_test"))
			.setDesc(i18n("connect_test_desc"))
			.addButton((bc) => {
				bc.setButtonText(i18n("test"));
				bc.onClick(evt => {
					const translateResponse = this.plugin.getTranslator()?.translate({
						from: "auto",
						to: "zh-CHS",
						words: "hello"
					});
					console.log(translateResponse)
				})
			})

		/**
		 * TODO Google Engine
		 * ==========
		 * ==google==
		 * ==========
		 */
			// const googleEngineDiv = containerEl.createDiv();
			// googleEngineDiv.toggleClass("settings-hide", this.plugin.settings.engine !== "google")
			//
			// googleEngineDiv.createEl("h5", {text: i18n("guide", {engine: i18n("google")}) + ":"})
			// let googleGuideP = googleEngineDiv.createEl("p");
			// googleEngineDiv.createEl("a", {
			//     href: "https://ai.youdao.com/console/",
			//     text: i18n("youdao_console"),
			// });
			// googleEngineDiv.createEl("span", {text: i18n("youdao_guide")})
			//
			// new Setting(googleEngineDiv)
			//     .setName(i18n("youdao_app_key"))
			//     .setDesc("AppKey")
			//     .addText((text) => {
			//         wrapTextWithPasswordHide(text);
			//         text
			//             .setValue(`${this.plugin.settings.config['appKey']}`)
			//             .onChange(async (value) => {
			//                 this.plugin.settings.config['appKey'] = value
			//                 await this.plugin.saveSettings();
			//             });
			//     });
			//

		const engine = new Setting(enginesChooserDiv);
		engine.setName(i18n("translate_engine"))
			.setDesc(i18n("engines_chooser_div_title"))
			.addDropdown(cb => cb.addOptions(this.getEnginesOptions())
				.setValue(`${this.plugin.settings.engine}`)
				.onChange(async (value) => {
					console.log("engine:" + value)
					this.plugin.settings.engine = value as SupportEngine;
					youdaoEngineDiv.toggleClass("settings-hide", value !== "youdao")
					// googleEngineDiv.toggleClass("settings-hide", value !== "google")
					await this.plugin.saveSettings();
				})
			);

	}

	setConfigValue<T, K extends keyof T, V extends T[K]>(obj: T | undefined, key: K, value: V): T {
		const updatedObj = obj ?? {} as T;
		updatedObj[key] = value;
		return updatedObj;
	}

	getEnginesOptions(): Record<string, string> {
		const options: Record<string, string> = {}
		Object.entries(TranslateEngines).forEach(([key, value]) => {
			options[key] = this.plugin.i18n.t(key as I18nKey)
		});
		return options
	}

}

const getEyesElements = () => {
	const eyeEl = createElement(Eye);
	const eyeOffEl = createElement(EyeOff);
	return {
		eye: eyeEl.outerHTML,
		eyeOff: eyeOffEl.outerHTML,
	};
};

const wrapTextWithPasswordHide = (text: TextComponent) => {
	const {eye, eyeOff} = getEyesElements();
	const hider = text.inputEl.insertAdjacentElement("afterend", createSpan())!;
	// the init type of hider is "hidden" === eyeOff === password
	hider.innerHTML = eyeOff;
	hider.addEventListener("click", (e) => {
		const isText = text.inputEl.getAttribute("type") === "text";
		hider.innerHTML = isText ? eyeOff : eye;
		text.inputEl.setAttribute("type", isText ? "password" : "text");
		text.inputEl.focus();
	});

	// the init type of text el is password
	text.inputEl.setAttribute("type", "password");
	return text;
};
