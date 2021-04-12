<template>
	<div style="">
		<div style="text-align: center;">此页面需要安装插件，才可保证功能的正常使用</div>
		<div @click="downLoad" style="text-align: center;cursor: pointer;color: #409EFF;">点击此处下载插件</div>
		<div style="text-align: center;">安装成功后，点击此处<span @click="sx" style="cursor: pointer;color: #409EFF;">重新加载</span>此页面，如果这些文字还出现可能是当前浏览器不支持此插件</div>
	</div>
	
</template>

<script>
	export default{
		data() {
			return {
				
			}
		},
		methods:{
			//下载插件
			downLoad() {
				window.open('http://ipms.mingm.com.cn/CLodop_Setup_for_Win32NT.exe')
			},
			//刷新页面
			sx() {
				location.reload();
			}
		}
	}
</script>

<style>
</style>
