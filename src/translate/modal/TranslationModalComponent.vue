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
            <n-flex class="speech" v-for="(speech,index) in response.speeches" :key="index">
              <n-button ghost color="#f1f1f1" @click="speechPlay(index)">
                <span style="color: black">{{ speech.area?.toUpperCase() + "." }} /{{ speech.phonetic }}/</span>
                <template #icon>
                  <n-icon size="20">
                    <PlayIcon/>
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
      </n-tab-pane>
      <n-tab-pane name="chap2" :tab="plugin.i18n.t('into_note')">
        <n-flex vertical>
          <n-flex>
            <n-dynamic-input>

            </n-dynamic-input>
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
import {NFlex, NIcon, NCard, NButton, NTable, NTabs, NTabPane, NDynamicInput} from "naive-ui"
import PlayIcon from "../../assets/icon/PlayIcon.vue";
import LinkIcon from "../../assets/icon/LinkIcon.vue";
import NoteIcon from "../../assets/icon/NoteIcon.vue";

export default defineComponent({
  name: 'TranslationModalComponent',
  components: {LinkIcon, PlayIcon, NoteIcon, NFlex, NIcon, NCard, NButton, NTable, NTabs, NTabPane, NDynamicInput},
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
    return {}
  },
  methods: {
    speechPlay(index: Number) {
      this.$refs.speechAudio[index].play()
    },
    addToNode() {
      console.log("addToNode")
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
