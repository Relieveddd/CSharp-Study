<template>
		<daoC :templateType = "templateType"></daoC>
</template>

<script>
	import daoC from "../daorudaochumoban/index.vue"
	export default{
		components:{
			daoC
		},
		data() {
			return {
				templateType: 2
			}
		}
	}
</script>

<style>
</style>
