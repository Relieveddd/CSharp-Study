<template>
	<companyList :f_ServiceId = "f_ServiceId"></companyList>
</template>

<script>
	import companyList from "../companyList/index.vue"
	import requestService from "@/utils/serviceCfg"
	export default{
		name: "companyListSyzn",
		components:{
			companyList
		},
		data() {
			return{
				f_ServiceId: requestService.syzn
			}
		}
	}
</script>

<style>
</style>
