import {Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, DictionarySettings, DictionarySettingTab} from "./setting";
import {I18n, I18nKey, LangTypeAndAuto} from "./util/i18n";
import {TranslateEngines, TranslationStrategy} from "./translate/const/translate-engines";
import {TranslationModal} from "./translate/modal/TranslationModal";
import "main.css"
import "styles.css"

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
                if (editor.getSelection().trim().length > 0) {
                    console.log(editor.getSelection())
                    menu.addItem((item) => {
                        item
                            .setTitle(t("tran2target"))
                            .onClick(async () => {
                                const translateResponse = await this.getTranslator()?.translate({
                                    to: this.settings.targetLang,
                                    words: editor.getSelection()
                                });
                                new TranslationModal(this, translateResponse).open();
                                editor.replaceSelection(`[[#^xxxx|${editor.getSelection()}]]`)
                            });
                    });
                }

            })
        );
    }

    onunload() {
        new Notice("Bye ～ 🙋🏻 ")
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getTranslator(): TranslationStrategy | undefined {
        try {
            this.engine = this.engine || new TranslateEngines[this.settings.engine].strategy(this.settings.engineConfig, this);
            return this.engine;
        } catch (e) {
            new Notice(this.i18n.t("init_engine_exception", {error: e.message}))
        }
    }
}

