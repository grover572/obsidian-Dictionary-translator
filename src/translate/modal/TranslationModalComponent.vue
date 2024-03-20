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
              <n-button ghost color="#f1f1f1" @click="speechPlay(index)" v-if="speech.speech">
                <span style="color: black" v-if="speech.phonetic">{{
                    speech.area?.toUpperCase() + "."
                  }} /{{ speech.phonetic }}/</span>
                <template #icon v-if="speech.speech">
                  <n-icon size="20">
                    <PlayIcon/>
                  </n-icon>
                </template>
              </n-button>
              <audio v-if="speech.speech" controls :src="speech.speech" style="display: none"
                     :ref="'speechAudio'"></audio>
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
        <n-flex vertical>
          <n-flex>
            <n-form
                ref="formRef"
                :model="saveData"
                label-placement="top"
            >
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi
                    :span="24"
                    v-if="response.speeches"
                    :label="plugin.i18n.t('pick_voice')"
                    path="radioGroupValue"
                    size="large"
                >
                  <n-radio-group v-model:value="saveData.speech" name="speechRadio">
                    <n-radio-button :value="speech.speech"
                                    v-for="(speech,index) in response.speeches"
                                    @click="speechPlay(index)"
                                    :key="index"
                                    v-if="plugin.settings.show_radio"
                    >
                      <span style="color: black" v-if="speech.phonetic">{{
                          speech.area?.toUpperCase() + "."
                        }} /{{ speech.phonetic }}/</span>
                      <audio v-if="speech.speech" controls :src="speech.speech" style="display: none"
                             :ref="'speechAudio'"></audio>
                    </n-radio-button>
                    <n-radio-button @click="recordVoice" :value="recordVoiceFile">
                      我来录一个
                    </n-radio-button>
                  </n-radio-group>
                  <button @click="startRecord" :disabled="isRecording">开始录音</button>
                  <button @click="stopRecording" :disabled="!isRecording">停止录音</button>
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </n-flex>
        </n-flex>
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
  NFormItemGi,
  NRadioGroup,
  NRadioButton
} from "naive-ui"
import PlayIcon from "../../assets/icon/PlayIcon.vue";
import LinkIcon from "../../assets/icon/LinkIcon.vue";
import NoteIcon from "../../assets/icon/NoteIcon.vue";

export default defineComponent({
  name: 'TranslationModalComponent',
  components: {LinkIcon, PlayIcon, NoteIcon, NFlex, NIcon, NCard, NButton, NTable, NTabs, NTabPane, NDynamicInput, NForm, NGrid, NFormItemGi, NRadioGroup, NRadioButton},
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
        speech: null
      },
      recordVoiceFile: "",
      stream: null,
      mediaRecorder: null,
      isRecording: false,
    }
  },
  methods: {
    speechPlay(index: Number) {
      this.$refs.speechAudio[index].play()
    },
    addToNode() {
      console.log("addToNode")
    },
    recordVoice() {
      console.log("recordVoice")
    },
    async startRecord(){
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);

        const chunks = [];
        this.mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.isRecording = false;
      }
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
    }
  },
});
</script>


<style>

</style>
