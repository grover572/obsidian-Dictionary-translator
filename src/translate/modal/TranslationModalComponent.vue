<template>
	<n-card class="translate-card" :bordered="false" :on-close="closeCallback" closable>
		<template #header>
			<n-flex class="translate-card-header" align="center">
				<span>{{ response.source }}</span>
				<n-button text ghost tag="a" :href="response.link" v-show="response.link">
					<n-icon size="20">
						<LinkIcon/>
					</n-icon>
				</n-button>
			</n-flex>
		</template>
		<n-tabs type="line" animated placement="bottom">
			<n-tab-pane name="chap1" tab="预览">
				<n-flex vertical>
					<n-flex justify="start" size="large" :wrap="false">
						<n-flex class="speech" v-for="(speech,index) in response.speeches" :key="index"
								v-if="plugin.settings.show_radio">
							<n-button ghost color="#f1f1f1" v-if="speech.speech" @click="speechPlay(speech.speech)">
                <span style="color: black" v-if="speech.phonetic">{{
						speech.area?.toUpperCase() + "."
					}} /{{ speech.phonetic }}/</span>
								<template #icon v-if="speech.speech">
									<n-icon size="20">
										<PlayIcon/>
									</n-icon>
								</template>
							</n-button>

						</n-flex>
					</n-flex>
					<n-flex>
						<ul style="margin-left: -20px">
							<li v-for="explain in response.explains">
								{{ explain }}
							</li>
						</ul>
					</n-flex>
					<n-flex>
						<n-table :bordered="true" :single-line="false" v-show="extensionField">
							<thead>
							<tr>
								<th v-for="v in extensionField">
									{{ v }}
								</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td v-for="v in extensionValue">
									{{ v }}
								</td>
							</tr>
							</tbody>
						</n-table>
					</n-flex>
				</n-flex>
			</n-tab-pane>
			<n-tab-pane name="chap2" :tab="plugin.i18n.t('web_site')" v-if="response.link && plugin.settings.show_link">
				<n-flex>
					<iframe :src="response.link" class="translate-card-link"></iframe>
				</n-flex>
			</n-tab-pane>
			<n-tab-pane name="append" :tab="plugin.i18n.t('into_note')">
				<n-form
					ref="formRef"
					:model="saveData"
					label-placement="top"
				>
					<n-form-item path="speech">
						<template #label>
							<n-flex vertical>
								<span>{{ plugin.i18n.t("pick_voice") }}</span>
								<n-button class="record-button" dashed size="tiny" @click="toggleRecording"
										  :type="isRecording ? 'info' : ''">
									<template #icon>
										<n-icon>
											<Mic/>
										</n-icon>
									</template>
									{{ isRecording ? 'Stop Record' : 'Start Record' }}
								</n-button>
							</n-flex>
						</template>

						<n-radio-group v-model:value="saveData.speech" name="speechRadio">
							<n-flex>
								<n-radio :value="speech.speech"
										 @click="speechPlay(speech.speech)"
										 :key="index"
										 v-for="(speech,index) in response.speeches"
										 v-if="plugin.settings.show_radio"
								>
					                      <span v-if="speech.phonetic">{{
												  speech.area?.toUpperCase() + "."
											  }} /{{ speech.phonetic }}/</span>
									<span v-else>
												{{ plugin.i18n.t("play_the_radio") }}
											</span>
								</n-radio>
								<n-radio v-for="(speech,index) in selfSpeech" @click="speechPlay(speech)"
										 :key="index"
										 :value="speech">
									{{ `My Record ${index + 1}` }}
								</n-radio>
							</n-flex>
						</n-radio-group>
					</n-form-item>
					<n-form-item :label="plugin.i18n.t('select_explains')" path="explains">
						<n-checkbox>
							<n-dynamic-tags v-model:value="saveData.explains"/>
						</n-checkbox>
						<!--							<n-flex vertical>-->
						<!--								<n-flex v-for="(explains,index) in dynamicExplainTags">-->
						<!--									-->
						<!--								</n-flex>-->
						<!--							</n-flex>-->
					</n-form-item>
				</n-form>
			</n-tab-pane>
		</n-tabs>
	</n-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {TranslateResponse} from '../const/translate-response';
import DictionaryPlugin from "../../main";
import {PropType} from "@vue/runtime-core";
import {
	NFlex,
	NIcon,
	NCard,
	NButton,
	NTable,
	NTabs,
	NTabPane,
	NDynamicInput,
	NForm,
	NGrid,
	NFormItem,
	NRadioGroup,
	NRadio,
	NDynamicTags
} from "naive-ui"
import PlayIcon from "../../assets/icon/PlayIcon.vue";
import LinkIcon from "../../assets/icon/LinkIcon.vue";
import NoteIcon from "../../assets/icon/NoteIcon.vue";
import {Mic} from "lucide-vue-next";
import {Notice} from "obsidian";

export default defineComponent({
	name: 'TranslationModalComponent',
	components: {
		LinkIcon,
		PlayIcon,
		NoteIcon,
		NFlex,
		NIcon,
		NCard,
		NButton,
		NTable,
		NTabs,
		NTabPane,
		NDynamicInput,
		NForm,
		NGrid,
		NFormItem,
		NRadioGroup,
		NRadio,
		Mic,
		NDynamicTags
	},
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
	data() {
		return {
			saveData: {
				speech: "",
				explains: []
			},
			selfSpeech: [],
			stream: null,
			mediaRecorder: null,
			isRecording: false,
		}
	},
	methods: {
		speechPlay(url: string) {
			let audio = new Audio(url);
			audio.play();
		},
		addToNode() {
			console.log("addToNode")
		},
		recordVoice() {
			console.log("recordVoice")
		},
		async toggleRecording() {
			if (this.isRecording) {
				this.stopRecording();
			} else {
				await this.startRecord()
			}
		},
		async startRecord() {
			try {
				this.isRecording = true;
				this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
				this.mediaRecorder = new MediaRecorder(this.stream);

				const chunks = [];
				this.mediaRecorder.ondataavailable = (e) => {
					chunks.push(e.data);
				};

				this.mediaRecorder.onstop = () => {
					const blob = new Blob(chunks, {type: 'audio/wav'});
					const url = URL.createObjectURL(blob);
					this.selfSpeech.push(url)
				};

				this.mediaRecorder.start();

			} catch (error) {
				console.error('Error starting recording:', error);
			}
		},
		stopRecording() {
			console.log("stop")
			if (this.mediaRecorder && this.isRecording) {
				this.mediaRecorder.stop();
				this.stream.getTracks().forEach((track) => {
					track.stop();
				});
				this.isRecording = false;
			}
		}
	},
	beforeDestroy() {
		this.mediaRecorder = null;
		this.stream = null;
	},
	watch: {
		saveData: {
			handler(n, o) {
				console.log(n, o)
			},
			deep: true
		}
	},
	mounted() {
		console.log(this.response)
	},
	computed: {
		extensionField() {
			return this.response.extensions && this.response.extensions.map(ex => ex.name)
		},
		extensionValue() {
			return this.response.extensions && this.response.extensions.map(ex => ex.value)
		},
		dynamicExplainTags() {

		}
	},
});
</script>


<style>

</style>
