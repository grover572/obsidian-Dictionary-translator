import {App, Modal} from "obsidian";
import {createApp,App as VueApp} from "vue";
import TranslationModalComponent from "./TranslationModalComponent.vue";

export class TranslationModal extends Modal {
	component : VueApp;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.empty();
		// 挂载 SettingTab 组件
		const app = createApp(TranslationModalComponent);
		this.component = app;
		app.mount(contentEl);
	}

	onClose() {
		const {contentEl} = this;
		this.component.unmount();
		contentEl.empty();
	}
}
