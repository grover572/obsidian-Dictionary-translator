<template>
	<n-card :bordered="false" :on-close="closeCallback" closable>
		<template #header>
			<n-flex class="translate-card-header">
				<span><a :href="response.link?.[0]">{{ response.source }}</a></span>
				<span class="icon"> -> </span>
				<span>{{ response.translation?.[0] }}</span>
			</n-flex>
		</template>
		<n-flex vertical>
			<n-flex>
				<n-flex>{{ response.speeches }}</n-flex>
			</n-flex>
		</n-flex>
	</n-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {TranslateResponse} from '../const/translate-response';
import DictionaryPlugin from "../../main";
import {PropType} from "@vue/runtime-core";
import {NFlex, NIcon, NCard} from "naive-ui"

export default defineComponent({
	name: 'TranslationModalComponent',
	components: {NFlex, NIcon, NCard},
	props: {
		response: {
			type: Object as PropType<TranslateResponse>,
			required: true
		},
		plugin: {
			type: Object as PropType<DictionaryPlugin>,
			required: true // 根据需要设置是否必需
		},
		closeCallback: {
			type: Function,
			required: true // 根据需要设置是否必需
		}
	},
	data() {
		return {}
	},
	mounted() {
		console.log(this.response)
	},
	computed: {
		// title() {
		// 	if (this.response && this.plugin) {
		// 		return this.response.to === this.plugin.settings.targetLang ? this.response.translation : this.response.source;
		// 	}
		// 	return false;
		// }
	},
});
</script>


<style>

</style>
