<template>
	<n-card class="translate-card" :bordered="false" :on-close="closeCallback" closable>
		<template #header>
			<n-flex class="translate-card-header">
				<span>{{ response.source }}</span>
				<!--				<span class="arrows">  →  </span>-->
				<!--				<span>{{ response.translation?.[0] }}</span>-->
			</n-flex>
		</template>
		<n-flex vertical>
			<n-flex justify="start" size="large" :wrap="false">
				<n-flex class="speech" v-for="(speech,index) in response.speeches" :key="index">
					<n-button ghost color="#f1f1f1" @click="speechPlay(index)">
						<span style="color: black">{{ speech.area?.toUpperCase() + "." }} /{{ speech.phonetic }}/</span>
						<template #icon>
							<n-icon size="20">
								<svg t="1710241062525" class="icon" viewBox="0 0 1024 1024" version="1.1"
									 xmlns="http://www.w3.org/2000/svg" p-id="6056" width="200" height="200">
									<path
										d="M512 1024a512 512 0 1 1 512-512 512 512 0 0 1-512 512z m0-992a480 480 0 1 0 480 480A480 480 0 0 0 512 32z m145.744 506.64l-192 127.84A32 32 0 0 1 416 639.888v-255.68a32 32 0 0 1 49.744-26.592l192 127.84a32 32 0 0 1 0 53.184zM620.8 493.248l-150.224-99.088A45.488 45.488 0 0 0 448 389.568v243.376a51.2 51.2 0 0 0 22.576-5.616l150.224-92.576a26.128 26.128 0 0 0 11.712-21.76 22.784 22.784 0 0 0-11.712-19.744z"
										fill="#3d3d3d" p-id="6057"></path>
								</svg>
							</n-icon>
						</template>
					</n-button>
					<audio controls :src="speech.speech" style="display: none" :ref="'speechAudio'"></audio>
				</n-flex>
			</n-flex>
			<n-flex>
				<ul>
					<li v-for="explain in response.explains">
						{{ explain }}
					</li>
				</ul>
			</n-flex>
		</n-flex>
	</n-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {TranslateResponse} from '../const/translate-response';
import DictionaryPlugin from "../../main";
import {PropType} from "@vue/runtime-core";
import {NFlex, NIcon, NCard, NButton} from "naive-ui"

export default defineComponent({
	name: 'TranslationModalComponent',
	components: {NFlex, NIcon, NCard, NButton},
	props: {
		response: {
			type: Object as PropType<TranslateResponse>,
			required: true
		},
		plugin: {
			type: Object as PropType<DictionaryPlugin>,
			required: true
		},
		closeCallback: {
			type: Function,
			required: true
		}
	},
	methods: {
		speechPlay(index: Number) {
			this.$refs.speechAudio[index].play()
		}
	},
	data() {
		return {}
	},
	mounted() {
		console.log(this.response)
	},
	computed: {},
});
</script>


<style>

</style>
