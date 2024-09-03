import {Editor, normalizePath, Notice, Plugin, TFile, TFolder} from 'obsidian';
import {DEFAULT_SETTINGS, DictionarySettings, DictionarySettingTab} from "./setting";
import {I18n, I18nKey, LangTypeAndAuto} from "./util/i18n";
import {TranslateEngines, TranslationStrategy} from "./translate/const/translate-engines";
import {TranslationModal} from "./translate/modal/TranslationModal";
import "styles.css"
import {TranslatorSaveData} from "./translate/const/translate-save-data";
import * as CryptoJS from 'crypto-js';
import {support_lang} from "./translate/const/support-lang";

export default class DictionaryPlugin extends Plugin {
	settings: DictionarySettings;
	i18n!: I18n;
	private engine: TranslationStrategy;

	async onload() {

		await this.loadSettings();

		this.i18n = new I18n(this.settings.lang!, async (lang: LangTypeAndAuto) => {
			this.settings.lang = lang;
			await this.saveSettings();
		});

		this.addSettingTab(new DictionarySettingTab(this.app, this));

		const t = (x: I18nKey, vars?: any) => {
			return this.i18n.t(x, vars);
		};

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				const selection = editor.getSelection();
				const onlyPunctuation = /^[\u2000-\u206F\u2E00-\u2E7F\\'!"#\$%&\(\)\*\+,\-\./:;<=>\?@\[\]\^_`\{\|\}~]+$/.test(selection.replace(" ", ""));
				if (selection.trim().length > 0 && !onlyPunctuation) {
					menu.addItem((item) => {
						item
							.setTitle(t("tran2target"))
							.setIcon("languages")
							.onClick(async () => {
								const translateResponse = await this.getTranslator()?.translate({
									to: support_lang[this.settings.targetLang].engine[this.settings.engine],
									words: selection
								});
								// new TranslationModal(this, translateResponse, editor).open();
							});
					});
				}

			})
		);
	}


	private hash(selection: string): string {
		const timestamp = new Date().getTime();
		const combinedString = timestamp.toString() + selection;
		let hash = 0;
		let i;

		for (i = 0; i < combinedString.length; i++) {
			hash = ((hash << 5) - hash) + combinedString.charCodeAt(i);
			hash |= 0;
		}

		const hashStr = Math.abs(hash).toString();
		return hashStr.length > 10 ? hashStr.slice(-10) : hashStr.padStart(10, '0');
	}

	async saveNote(editor: Editor, saveData: TranslatorSaveData) {
		const selection = editor.getSelection();
		const hash = this.hash(selection);
		await this.reloadAttachFolder();

		let radioPath;
		// save radio
		if (saveData.radio) {
			radioPath = this.settings.attach + "/" + saveData.title.substring(0, 10) + "-" + hash + ".mp3";
			this.app.vault.createBinary(radioPath, saveData.radio);
		}

		const appendPosition = editor.lastLine() + 1;

		const title = `\n\n>[!translator-card-callout]+ ${saveData.title}\n`
		const content = saveData.content.map(c => `>${c.trim()}`).join("\n");
		const radio = `\n![[${radioPath}]]`
		const anchor = `\n^${hash}`
		editor.setLine(appendPosition, title + content + (saveData.radio ? radio : "") + anchor)

		editor.replaceSelection(`[[#^${hash}|${selection}]]`);

	}

	onunload() {
		new Notice("Bye ～ 🙋🏻 ")
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(this.decrypt(await this.loadData())));
	}

	private key: string = "saturn1&&saturn2"

	private encrypt(param: string) {
		const encrypted = CryptoJS.AES.encrypt(param, this.key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7,
		});
		return encrypted.toString();
	}

	private decrypt(param: any) {
		if (!param) return "{}"
		const decrypted = CryptoJS.AES.decrypt(param, this.key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7,
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}

	async saveSettings() {
		console.log(JSON.stringify(this.settings))
		await this.saveData(this.encrypt(JSON.stringify(this.settings)));
	}

	getTranslator(): TranslationStrategy | undefined {
		try {
			this.engine = new TranslateEngines[this.settings.engine].strategy(this.settings.engineConfig, this);
			return this.engine;
		} catch (e) {
			new Notice(this.i18n.t("init_engine_exception", {error: e.message}))
		}
	}

	async reloadAttachFolder() {
		const folderpath = normalizePath(this.settings.attach);
		const vault = this.app.vault;
		const folder = vault.getAbstractFileByPath(folderpath);
		if (folder && folder instanceof TFolder) {
			return;
		}
		if (folder && folder instanceof TFile) {
			new Notice(this.i18n.t("file_exist", {folderpath}))
		}
		return await vault.createFolder(folderpath);
	}


}

