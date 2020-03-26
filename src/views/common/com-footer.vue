<template>
    <div class="footer-main">
        <div class="foter-bottom">
          <p class="footer-copyrts site-footer">Copyright © 2016-{{date}}&nbsp;
          	<span style="color:#303133" v-if="domainType == 4">{{$t('navbar.otherAddress')}}</span>

          	&nbsp;&nbsp;{{$t('navbar.record')}}&nbsp;&nbsp;版本：{{version}}&nbsp;&nbsp;
            <a href="http://www.nuggetdata.com" target="_blank" style="color:#303133">
              <template v-if="domainType == 4">{{$t('navbar.addressQy')}}</template>
              <template v-else-if="domainType == 5">{{$t('navbar.addressEmpty')}}</template>
              <template v-else>{{$t('navbar.address')}}</template>
            </a> <br>
          <!-- <span style="font-size: 8px">推荐使用chrome浏览器访问</span> -->
          </p>
        </div>
    </div>
</template>
<style lang="scss">
    .footer-main{
      margin-top: 10px;
    	width: 100%;
    	text-align: center;
    }
</style>
<script>
	import {getDomainType } from '@/utils/common'
	export default {
		data() {
			return {
				domainType:getDomainType(),
				date:(new Date()).getFullYear(),
				version:window.SITE_CONFIG.sysVersion
			}
		},
		activated() {
		},
		methods: {
		}
	}
</script>
