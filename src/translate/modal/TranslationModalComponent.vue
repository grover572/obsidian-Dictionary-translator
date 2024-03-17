<template>
	<n-card class="translate-card" :bordered="false" :on-close="closeCallback" closable>
		<template #header>
			<n-flex class="translate-card-header" align="center">
				<span>{{ response.source }}</span>
				<n-button text ghost tag="a" :href="response.link" v-show="response.link">
					<n-icon size="20">
						<svg t="1710668631077" class="icon" viewBox="0 0 1024 1024" version="1.1"
							 xmlns="http://www.w3.org/2000/svg" p-id="4261" width="200" height="200">
							<path
								d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
								p-id="4262"></path>
							<path
								d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
								p-id="4263"></path>
						</svg>
					</n-icon>
				</n-button>
				<n-button>
					<template #icon>
						<n-icon size="25">
							<svg t="1710672344285" class="icon" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" p-id="5273" width="200" height="200">
								<path d="M0 0m0 0l1024 0q0 0 0 0l0 1024q0 0 0 0l-1024 0q0 0 0 0l0-1024q0 0 0 0Z"
									  fill="#E8EFF8"
									  p-id="5274"></path>
								<path
									d="M139.636364 651.636364a23.272727 23.272727 0 0 1 23.272727-23.272728h395.636364a23.272727 23.272727 0 0 1 23.272727 23.272728v116.363636a23.272727 23.272727 0 0 1-23.272727 23.272727H162.909091a23.272727 23.272727 0 0 1-23.272727-23.272727v-116.363636z"
									fill="#247ADE" p-id="5275"></path>
								<path
									d="M139.636364 442.181818a23.272727 23.272727 0 0 1 23.272727-23.272727h395.636364a23.272727 23.272727 0 0 1 23.272727 23.272727v116.363637a23.272727 23.272727 0 0 1-23.272727 23.272727H162.909091a23.272727 23.272727 0 0 1-23.272727-23.272727v-116.363637z"
									fill="#69CB91" p-id="5276"></path>
								<path
									d="M861.090909 232.727273a23.272727 23.272727 0 0 0-23.272727-23.272728H162.909091a23.272727 23.272727 0 0 0-23.272727 23.272728v116.363636a23.272727 23.272727 0 0 0 23.272727 23.272727h674.909091a23.272727 23.272727 0 0 0 23.272727-23.272727v-116.363636z"
									fill="#A0BFF7" p-id="5277"></path>
								<path
									d="M733.090909 581.818182a23.272727 23.272727 0 0 1 46.545455 0v69.818182H861.090909a23.272727 23.272727 0 1 1 0 46.545454h-81.454545v69.818182a23.272727 23.272727 0 1 1-46.545455 0v-69.818182H651.636364a23.272727 23.272727 0 0 1 0-46.545454h81.454545v-69.818182z"
									fill="#247ADE" p-id="5278"></path>
							</svg>
						</n-icon>
					</template>
					{{ plugin.i18n.t("into_note") }}
				</n-button>
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
				<ul style="margin-left: -20px">
					<li v-for="explain in response.explains">
						{{ explain }}
					</li>
				</ul>
			</n-flex>
			<n-flex>
				<n-table :bordered="true" :single-line="false">
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
	</n-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {TranslateResponse} from '../const/translate-response';
import DictionaryPlugin from "../../main";
import {PropType} from "@vue/runtime-core";
import {NFlex, NIcon, NCard, NButton, NTable} from "naive-ui"

export default defineComponent({
	name: 'TranslationModalComponent',
	components: {NFlex, NIcon, NCard, NButton, NTable},
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

		}
	},
	methods: {
		speechPlay(index: Number) {
			this.$refs.speechAudio[index].play()
		}
	},

	mounted() {
		console.log(this.response)
	},
	computed: {
		extensionField() {
			return this.response.extensions.map(ex => ex.name)
		},
		extensionValue() {
			return this.response.extensions.map(ex => ex.value)
		}
	},
});
</script>


<style>

</style>
