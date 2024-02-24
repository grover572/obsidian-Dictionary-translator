import {App, Menu, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, moment} from 'obsidian';
import {DEFAULT_SETTINGS, DictionarySettings, DictionarySettingTab} from "./setting";
import {I18n, LangTypeAndAuto} from "./util/i18n";
import {TranslateEngines, TranslationStrategy} from "./translate/const/translate-engines";
import {NullConfigError} from "./translate/const/null_config_error";

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

		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			new Notice("I'm your personal translator");
			// youdaoTranslator("hello");
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item
						.setTitle("🔃  英译汉")
						.setIcon("🔃")
						.onClick(async () => {
							console.log(editor.getSelection())
						});
				});
			})
		);

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DictionarySettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			// console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	getTranslator(): TranslationStrategy | undefined {
		try {
			this.engine = new TranslateEngines[this.settings.engine].strategy(this.settings.engineConfig);
			return this.engine;
		} catch (e) {
			new Notice(this.i18n.t("init_engine_exception", {error: e.message}))
		}
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

