<template>
	<div class="t-modal">
		{{ response }}
	</div>
</template>

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
	mounted(){
		console.log(this.response)
	},
	computed: {
		title() {
			if (this.response && this.plugin) {
				return this.response.to === this.plugin.settings.targetLang ? this.response.translation : this.response.source;
			}
			return false;
		}
	},
});
</script>


<style scoped>
.t-modal {
	width: 1000px;
	height: 500px;

}
</style>
