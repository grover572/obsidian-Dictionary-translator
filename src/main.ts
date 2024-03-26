import {Editor, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, DictionarySettings, DictionarySettingTab} from "./setting";
import {I18n, I18nKey, LangTypeAndAuto} from "./util/i18n";
import {TranslateEngines, TranslationStrategy} from "./translate/const/translate-engines";
import {TranslationModal} from "./translate/modal/TranslationModal";
import "main.css"
import "styles.css"
import CryptoJS from "crypto-js"
import {TranslatorSaveData} from "./translate/const/translate-save-data";


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
                if (selection.trim().length > 0) {
                    console.log(selection)
                    menu.addItem((item) => {
                        item
                            .setTitle(t("tran2target"))
                            .onClick(async () => {
                                const translateResponse = await this.getTranslator()?.translate({
                                    to: this.settings.targetLang,
                                    words: selection
                                });
                                new TranslationModal(this, translateResponse, editor).open();
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

    saveNote(editor: Editor, saveData: TranslatorSaveData) {
        const selection = editor.getSelection();
        const hash = this.hash(selection);
        console.log(hash)
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

