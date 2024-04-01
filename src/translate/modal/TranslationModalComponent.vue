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
              <n-button ghost style="color: black" color="#f1f1f1" v-if="speech.speech"
                        @click="speechPlay(speech.speech)">
                <span v-if="speech.phonetic">{{
                    speech.area?.toUpperCase() + "."
                  }} /{{ speech.phonetic }}/</span>
                <span v-else>
                  {{ plugin.i18n.t("play_the_radio") }}
                </span>
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
              <li v-for="explain in (response.isWord ? response.explains : response.translation)">
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

          <n-flex vertical>
            <n-flex align="center">
              <h6> - {{ plugin.i18n.t("pick_voice") }}</h6>
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
          </n-flex>

          <n-flex vertical>
            <h6> - {{ plugin.i18n.t("select_explains") }}</h6>
            <n-flex v-for="(explain,index) in saveData.boomExplains" class="explain-card" vertical
                    v-if="response.isWord">
              <n-flex>
                <n-checkbox v-model:checked="explain.checked">
                  {{ explain.type }}
                </n-checkbox>
                <n-button size="tiny" ghost secondary type="info" :disabled="!explain.checked"
                          @click="resetExplains(index)">
                  Reset
                </n-button>
              </n-flex>
              <n-dynamic-tags v-model:value="explain.explains" :disabled="!explain.checked"/>
            </n-flex>
            <n-flex v-for="(translation,index) in saveData.translations" class="explain-card" vertical
                    v-else>
              <n-flex>
                <n-checkbox v-model:checked="translation.checked">
                  {{ translation.translation }}
                </n-checkbox>
              </n-flex>
            </n-flex>
          </n-flex>

          <n-flex>
            <n-button type="primary" ghost block icon-placement="right" @click="addToNode">
              <template #icon>
                <SendHorizontal/>
              </template>
              {{ plugin.i18n.t("save_to_note") }}
            </n-button>
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
  NFormItem,
  NRadioGroup,
  NRadio,
  NDynamicTags,
  NCheckbox
} from "naive-ui"
import PlayIcon from "../../assets/icon/PlayIcon.vue";
import LinkIcon from "../../assets/icon/LinkIcon.vue";
import NoteIcon from "../../assets/icon/NoteIcon.vue";
import {Mic, SendHorizontal} from "lucide-vue-next";
import {Notice, Editor} from "obsidian";
import {TranslatorSaveData} from "../const/translate-save-data";

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
    Mic, SendHorizontal,
    NDynamicTags,
    NCheckbox,
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
    },
    editor: {
      type: Editor,
      required: true
    }
  },
  data() {
    return {
      saveData: {
        speech: this.response?.speeches[0]?.speech,
        speechLabel: this.response?.speeches[0]?.phonetic,
        boomExplains: this.response.boomExplains?.map(item => ({
          ...item,
          checked: true,
        })),
        translations: this.response.translation.map(item => ({
          translation: item,
          checked: true
        })),
        isWord: this.response.isWord
      },
      selfSpeech: [],
      stream: null,
      mediaRecorder: null,
      isRecording: false,
      radioCache: new Map()
    }
  },
  methods: {
    async speechPlay(url: string) {
      try {
        const cachedBuffer = this.radioCache.get(url);
        if (cachedBuffer) {
          this.playBuffer(cachedBuffer.slice(0))
        } else {
          let audioResponse = await fetch(url);
          console.debug(audioResponse)
          if (!audioResponse.ok || audioResponse.status != 200) {
            throw new Error()
          }
          let audioBuffer = await audioResponse.arrayBuffer();
          this.radioCache.set(url, audioBuffer);
          this.playBuffer(audioBuffer.slice(0))
        }
      } catch (e) {
        this.radioCache.delete(url);
        new Notice(this.plugin.i18n.t("play_error"))
      }
    },
    async addToNode() {

      let title = this.response.source;

      let radio = null;
      const speechURL = this.saveData.speech;
      try {
        if (speechURL) {
          radio = this.radioCache.get(speechURL);
          if (!radio) {
            let audioResponse = await fetch(speechURL);
            radio = await audioResponse.arrayBuffer();
            this.radioCache.set(speechURL, radio.slice(0))
          }
        }
      } catch (e) {
        console.debug(e)
        new Notice(this.plugin.i18n.t("save_radio_fail"))
      }

      let content: string[] = [];
      if (this.saveData.isWord) {
        content = this.saveData.boomExplains.filter(explains => explains.checked);
        content = content.map(explains => explains.type + (explains.type ? "." : "") + explains.explains.join(";"))
      } else {
        content = this.saveData.translations.filter(t => t.checked).map(t => t.translation);
      }

      const saveData: TranslatorSaveData = {content, radio, title, radioLabel: this.saveData.speechLabel}
      await this.plugin.saveNote(this.editor, saveData)
      this.closeCallback()
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
          console.debug(url)
        };

        this.mediaRecorder.start();

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
    },
    resetExplains(index) {
      this.saveData.boomExplains[index] = JSON.parse(JSON.stringify(this.response.boomExplains[index]));
      this.saveData.boomExplains[index].checked = true;
    },
    playBuffer(speechBuffer: ArrayBuffer) {
      const audioContext = new AudioContext();
      console.debug(speechBuffer.byteLength)
      audioContext.decodeAudioData(speechBuffer).then(copyBuffer => {
        const source = audioContext.createBufferSource();
        source.buffer = copyBuffer;
        source.connect(audioContext.destination);
        source.start();
      })
    }
  },
  beforeDestroy() {
    this.mediaRecorder = null;
    this.stream = null;
    this.radioCache.clear();
  },
  watch: {
    saveData: {
      handler(n, o) {
      },
      deep: true
    }
  },
  mounted() {
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
