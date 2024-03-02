import {App, Modal} from "obsidian";
import {createApp, App as VueApp} from "vue";
import TranslationModalComponent from "./TranslationModalComponent.vue";
import {TranslateResponse} from "../const/translate-response";
import DictionaryPlugin from "../../main";

export class TranslationModal extends Modal {

	component: VueApp;
	data: TranslateResponse | undefined;
	plugin: DictionaryPlugin;

	constructor(plugin: DictionaryPlugin, data: TranslateResponse | undefined) {
		super(plugin.app);
		this.data = data;
		this.plugin = plugin;
	}


	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		const app = createApp(TranslationModalComponent, {"response": this.data, "plugin": this.plugin});
		this.component = app;
		app.mount(contentEl);
	}

	onClose() {
		const {contentEl} = this;
		this.component.unmount();
		contentEl.empty();
	}
}
