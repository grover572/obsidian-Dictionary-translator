<template>
	<div>

	</div>
</template>

<style scoped>
.sample-class {
	margin-left: 1em;
	color: #6C31E3;
}
</style>

<script lang="ts">
import {defineComponent} from 'vue';
import {TranslateResponse} from '../const/translate-response';
import DictionaryPlugin from "../../main";
import {PropType} from "@vue/runtime-core";

export default defineComponent({
	name: 'TranslationModalComponent',
	props: {
		response: {
			type: Object as PropType<TranslateResponse>,
			required: true
		},
		plugin: {
			type: Object as PropType<DictionaryPlugin>,
			required: true // 根据需要设置是否必需
		}
	},
	data(){
		return {

		}
	},
	computed: {
		title() {
			if (this.response && this.plugin) {
				return this.response.to === this.plugin.settings.targetLang;
			}
			return false;
		}
	},
});
</script>
