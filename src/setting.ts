import {App, Modal, moment, Notice, PluginSettingTab, Setting, TextComponent} from "obsidian";
import DictionaryPlugin from "./main";
import {LangTypeAndAuto, I18nKey, I18n} from "./util/i18n";
import {EngineConfig, SupportEngine, to, TranslateEngines} from "./translate/const/translate-engines";
import {createElement, Eye, EyeOff} from "lucide";
import {YoudaoConfigs} from "./translate/engines/youdao/youdao-configs";
import {logo_image} from "./assets/engine-logo/logos";
import {getLanguageOptions, support_lang} from "./translate/const/support-lang";
import {BaidubceConfigs} from "./translate/engines/baidubce/baidubce-configs";

export interface DictionarySettings {
	show_radio: boolean;
	show_link: boolean;
	attach: string;
	engine: keyof typeof TranslateEngines;
	lang: LangTypeAndAuto,
	targetLang: to,
	engineConfig: EngineConfig
}

export const DEFAULT_SETTINGS: DictionarySettings = {
	show_radio: true,
	show_link: true,
	attach: "",
	engine: "youdao",
	lang: "auto",
	targetLang: moment.locale() in support_lang ? moment.locale() : "zh-CHS",
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
		// containerEl.createEl("h1", {text: "Dictionary Settings"});

		// Div : enginesChooserDiv
		const enginesChooserDiv = containerEl.createDiv();

		const youdaoEngineDiv = this.renderYoudaoEngineSettings(containerEl, i18n);

		const baidubceEngineDiv = this.renderBaiduBceEngineSettings(containerEl, i18n);

		// common connect test
		new Setting(containerEl)
			.setName(i18n("connect_test"))
			.setDesc(i18n("connect_test_desc"))
			.addButton((bc) => {
				bc.setButtonText(i18n("test"));
				bc.onClick(async evt => {
					let en: boolean = false;
					if (this.plugin.settings.lang === "en" ||
						(this.plugin.settings.lang === "auto"
							&& moment.locale().replace("-", "_") === "en")) {
						en = true;
					}

					const words = en ? "你好" : "hello";
					try {
						const translateResponse = await this.plugin.getTranslator()?.translate({
							from: en ? "cn" : "en",
							to: en ? "en" : "cn",
							words: words
						});
						console.debug(translateResponse)
						if (translateResponse) {
							new Notice(`${i18n("connect_test_success")} : ${words}  ➡️   ${translateResponse.translation}`)
						} else {
							new Notice(i18n("init_engine_exception", {error: "unknown"}))
						}
					} catch (e) {
						new Notice(i18n("init_engine_exception", {error: e.message}))
					}
				})
			})


		const engine = new Setting(enginesChooserDiv);
		engine.setName(i18n("translate_engine"))
			.setDesc(i18n("engines_chooser_div_title"))
			.addDropdown(cb => cb.addOptions(this.getEnginesOptions())
				.setValue(`${this.plugin.settings.engine}`)
				.onChange(async (value) => {
					console.debug("engine:" + value)
					this.plugin.settings.engine = value as SupportEngine;
					youdaoEngineDiv.toggleClass("settings-hide", value !== "youdao")
					baidubceEngineDiv.toggleClass("settings-hide", value !== "baidubce")
					// googleEngineDiv.toggleClass("settings-hide", value !== "google")
					await this.plugin.saveSettings();
				})
			);

		const baseSettingDiv = containerEl.createDiv({cls: "setting-base-box"});
		const baseHeader = baseSettingDiv.createDiv({cls: "setting-title"});
		baseHeader.createEl("span", {text: i18n("base_setting"), cls: "guide"})
		new Setting(baseSettingDiv)
			.setName(i18n("first_target_lang"))
			.setDesc(i18n("first_target_lang_desc"))
			.addDropdown(cb => cb.addOptions(getLanguageOptions(this.plugin.settings.lang))
				.setValue(this.plugin.settings.targetLang as string)
				.onChange(async value => {
					this.plugin.settings.targetLang = value;
					await this.plugin.saveSettings();
				})
			)


		new Setting(baseSettingDiv)
			.setName(i18n("attach"))
			.setDesc(i18n("attach_desc"))
			.addText(text => {
				text.setPlaceholder(i18n("attach_placeholder"))
					.setValue(this.plugin.settings.attach)
					.onChange(async (value) => {
						this.plugin.settings.attach = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(i18n("show_link"))
			.setDesc(i18n("show_link_desc"))
			.addToggle(tc => {
				tc.setValue(this.plugin.settings.show_link)
					.onChange(async (value) => {
						this.plugin.settings.show_link = value;
						await this.plugin.saveSettings();
					})
			})

		new Setting(containerEl)
			.setName(i18n("show_radio"))
			.setDesc(i18n("show_radio_desc"))
			.addToggle(tc => {
				tc.setValue(this.plugin.settings.show_radio)
					.onChange(async (value) => {
						this.plugin.settings.show_radio = value;
						await this.plugin.saveSettings();
					})
			})

	}

	private renderYoudaoEngineSettings(containerEl: HTMLElement, i18n: Function) {
		/**
		 * ==========
		 * ==youdao==
		 * ==========
		 */
		const youdaoEngineDiv = containerEl.createDiv({cls: "setting-config-box"});
		youdaoEngineDiv.toggleClass("settings-hide", this.plugin.settings.engine !== "youdao")
		const youdaoHeader = youdaoEngineDiv.createDiv({cls: "setting-engine-header"});
		youdaoHeader.createEl("span", {text: i18n("guide", {engine: i18n("youdao")}) + ":", cls: "guide"})
		youdaoHeader.createEl("img", {attr: {src: logo_image.youdao}})
		const youdaoGuideP = youdaoEngineDiv.createEl("p");
		youdaoGuideP.createEl("a", {
			href: "https://ai.youdao.com/console/",
			text: i18n("youdao_console"),
		});
		youdaoGuideP.createEl("span", {text: i18n("youdao_guide")})


		new Setting(youdaoEngineDiv)
			.setName(i18n("youdao_app_key"))
			.setDesc("AppKey")
			.addText((text) => {
				text.inputEl.setAttribute("type", "password");
				text
					.setValue(`${(this.plugin.settings.engineConfig as YoudaoConfigs).appKey ?? ""}`)
					.onChange(async (value) => {
						this.setConfigValue(this.plugin.settings.engineConfig, 'appKey', value)
						await this.plugin.saveSettings();
					});
				this.addPasswordFocusEvent(text);
			});

		new Setting(youdaoEngineDiv)
			.setName(i18n("youdao_app_secret"))
			.setDesc("AppSecret")
			.addText((text) => {
				text.inputEl.setAttribute("type", "password");
				text
					.setValue(`${(this.plugin.settings.engineConfig as YoudaoConfigs).appSecret ?? ""}`)
					.onChange(async (value) => {
						this.setConfigValue(this.plugin.settings.engineConfig, 'appSecret', value)
						await this.plugin.saveSettings();
					});
				this.addPasswordFocusEvent(text);
			});
		return youdaoEngineDiv;
	}

	private renderBaiduBceEngineSettings(containerEl: HTMLElement, i18n: Function) {
		const baidubceEngineDiv = containerEl.createDiv({cls: "setting-config-box"});
		baidubceEngineDiv.toggleClass("settings-hide", this.plugin.settings.engine !== "baidubce")
		const baidubceHeader = baidubceEngineDiv.createDiv({cls: "setting-engine-header"});
		baidubceHeader.createEl("span", {text: i18n("guide", {engine: i18n("baidubce")}) + ":", cls: "guide"})
		baidubceHeader.createEl("img", {attr: {src: logo_image.baidubce}})
		const baidubceGuideP = baidubceEngineDiv.createEl("p");
		baidubceGuideP.createEl("a", {
			href: "https://console.bce.baidu.com/",
			text: i18n("baidubce_console"),
		});
		baidubceGuideP.createEl("span", {text: i18n("baidubce_guide")})


		new Setting(baidubceGuideP)
			.setName(i18n("api_key"))
			.setDesc("API Key")
			.addText((text) => {
				text.inputEl.setAttribute("type", "password");
				text
					.setValue(`${(this.plugin.settings.engineConfig as BaidubceConfigs).apiKey ?? ""}`)
					.onChange(async (value) => {
						this.setConfigValue(this.plugin.settings.engineConfig, 'apiKey', value)
						await this.plugin.saveSettings();
					});
				this.addPasswordFocusEvent(text);
			});

		new Setting(baidubceGuideP)
			.setName(i18n("secret_key"))
			.setDesc("Secret Key")
			.addText((text) => {
				text.inputEl.setAttribute("type", "password");
				text
					.setValue(`${(this.plugin.settings.engineConfig as BaidubceConfigs).secretKey ?? ""}`)
					.onChange(async (value) => {
						console.log(value)
						this.setConfigValue(this.plugin.settings.engineConfig, 'secretKey', value)
						await this.plugin.saveSettings();
					});
				this.addPasswordFocusEvent(text);
			});
		return baidubceEngineDiv;
	}

	private addPasswordFocusEvent(text: TextComponent) {
		text.inputEl.addEventListener("focus", function () {
			this.setAttribute("type", "text");
		});

		text.inputEl.addEventListener("blur", function () {
			this.setAttribute("type", "password");
		});
	}

	private setConfigValue<T, K extends keyof T, V extends T[K]>(obj: T | undefined, key: K, value: V): T {
		const updatedObj = obj ?? {} as T;
		updatedObj[key] = value;
		return updatedObj;
	}

	private getEnginesOptions(): Record<string, string> {
		const options: Record<string, string> = {}
		Object.entries(TranslateEngines).forEach(([key, value]) => {
			options[key] = this.plugin.i18n.t(key as I18nKey)
		});
		return options
	}


}

