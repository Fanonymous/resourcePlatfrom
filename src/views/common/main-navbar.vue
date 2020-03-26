<template>
    <nav class="site-navbar">
        <div class="site-navbar__body">
            <div class="site-navbar__body--title" @click="goIndexRoute()">
                <img src="~@/assets/img/logo.png" alt="知识共享服务平台">
            </div>
            <div class="site-navbar__body--right">
                <div class="site-navbar--search">
                    <el-input placeholder="内容搜一搜" v-model="word" size="large" style="width:472px;margin-right:150px;" @keyup.enter.native="word && $router.push({name:'search',params: {wd:word}})">
                        <el-button size="large" slot="append" icon="el-icon-search" @click="word && $router.push({name:'search',params: {wd:word}})">搜全网</el-button>
                    </el-input>
                </div>
                <el-dropdown :show-timeout="0" placement="bottom">
                    <span class="el-dropdown-link">
                      <img v-real-img="imgUrl + userinfo.imageUrl" :src="defaultPic" @click="$router.push({path:'/userinfo',query: {type:1}})" />
                        <!-- <img src="~@/assets/img/avatar.jpg"> -->
                        <span style="color: #8590A6;cursor: pointer;">{{userinfo.fullName}}</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:1}})">我的订阅</el-dropdown-item>
                        <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:2}})">收藏夹</el-dropdown-item>
                        <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:3}})">最近看过</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <a href="https://support.qq.com/products/117498?" target="_blank" style="font-size: 14px; color: #8590A6; margin-bottom: 2px; margin-left: 65px;cursor: pointer;">帮助中心</a>
            </div>
        </div>
    </nav>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import defaultPic from '@/assets/img/avatar.jpg'
export default {
    data () {
        return {
          word:'',
          userinfo:this.GLOBAL.getUserinfo(),
          imgUrl: window.SITE_CONFIG.imgIP,
          defaultPic: defaultPic,
        }
    },
    computed: {
    },
    mounted() {
      console.log(this.userinfo,'123456')
    },
    methods: {
        goIndexRoute () {
          let dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
          let tempUrl = dynamicMenuRoutes.find(item=>{
            return item.url == '/index'
          })
          this.$router.push({
            path: tempUrl.url,
            query: {
              channelId: tempUrl.channelId
            }
          })
          this.$store.commit('common/updateMenuActiveName', tempUrl.channelName)
        }
    }
}
</script>

<style lang="scss" scoped>
.site-navbar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    background-color: #fff;

    &__body {
        height: 60px;
        width: 1170px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        background-color: transparent;
        &--right{
            display: flex;
            align-items: center;
            .site-navbar--search{
                /deep/ .el-input__inner{
                    border: 1px solid #F1F1F1;
                    background-color: #F6F6F6;
                }
                /deep/ .el-input-group__append{
                    color: #fff;
                    border: 0;
                }
                /deep/ .el-button{
                    height: 40px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    background-color: #3C85EE;
                }
            }
        }
    }
    .el-dropdown-link {
        > img {
            width: 34px;
            height: 34px;
            margin-right: 5px;
            border-radius: 50%;
            vertical-align: middle;
        }
    }
}
</style>
