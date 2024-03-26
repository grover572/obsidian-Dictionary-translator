import {App, Editor, Modal} from "obsidian";
import {createApp, App as VueApp} from "vue";
import TranslationModalComponent from "./TranslationModalComponent.vue";
import {TranslateResponse} from "../const/translate-response";
import DictionaryPlugin from "../../main";

export class TranslationModal extends Modal {

	component: VueApp;
	data: TranslateResponse | undefined;
	plugin: DictionaryPlugin;
	// func: Record<string, Function>;
	editor: Editor;

	constructor(plugin: DictionaryPlugin, data: TranslateResponse | undefined, editor: Editor) {
		super(plugin.app);
		this.data = data;
		this.plugin = plugin;
		this.editor = editor;
	}


	onOpen() {
		const {modalEl} = this;
		modalEl.empty();

		const app = createApp(TranslationModalComponent, {
			response: this.data,
			plugin: this.plugin,
			closeCallback: () => this.close()
		});
		this.component = app;
		app.mount(modalEl);
	}

	onClose() {
		console.log("close")
		const {modalEl} = this;
		this.component.unmount();
		modalEl.empty();
	}
}
