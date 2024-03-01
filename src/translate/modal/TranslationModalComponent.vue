<template>
	<div>
		<button @click="add_one">+1</button>
		<span class="sample-class">{{ count }}</span>
	</div>
</template>

<style scoped>
.sample-class {
	margin-left: 1em;
	color: #6C31E3;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TranslationModal",
	data() {
		return {
			count: 0
		}
	},
	methods: {
		add_one() {
			this.count += 1;
		}
	},
	mounted(){
		console.log("我被挂载")
	},
	unmounted(){
		console.log("我被卸载")
	},
	destroyed(){
		console.log("我被销毁")
	}
})
</script>
