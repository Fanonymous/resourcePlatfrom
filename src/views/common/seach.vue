<template>
  <div class="search-container">
    <custom-header></custom-header>
    <div class="search-box">
      <img src="~@/assets/img/logo.png" alt="">
          <el-input placeholder="内容搜一搜" v-model="keywords" size="large" style="width:572px;" @keyup.enter.native="getSearch(1)">
              <el-button size="large" slot="append" icon="el-icon-search" @click="getSearch(1)">搜全网</el-button>
          </el-input>
    </div>
    <div class="index-content--wrapper">
        <div class="feed--box">
            <div v-for="(item, index) in articleList" :key="index" class="item--inner" @click="goDetail(item)">
              <div class="article--img" v-if="item.thumbAddress">
                <img v-real-img="item.thumbAddress" :src="defaultPic">
              </div>
              <div class="rbox--inner">
                <div>
                  <div class="title--box">
                    <span class="title-content">{{item.title.length >65? item.title.substr(0,65)+'...':item.title}}<img v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png" alt=""></span>
                    <!-- <span v-if="item.isWell == 1">优选</span> -->
                  </div>
                  <div class="c-box">
                    <span class="article--type">{{item.channelName}}</span>
                    <span class="article--tag">{{item.tagsName}}</span>
                  </div>
                </div>
                    <div class="y-box">
                        <span style="margin-right: 10px;">
                            <span class="iconfont iconchakan"></span>
                            <span>{{item.viewCount ? item.viewCount : 0}}人看过</span>
                        </span>
                        <span>
                          <template>
                            <el-button type="text" v-if="item.isCollected == 1" v-on:click.stop="setUserCollect(2,item.resourcesId,index)" icon="is-collect iconfont iconbuoumaotubiao44">收藏</el-button>
                            <el-button type="text" v-else size="small" v-on:click.stop="setUserCollect(1,item.resourcesId,index)" icon="iconfont iconbuoumaotubiao44">收藏</el-button>
                          </template>
                          <!-- <el-button type="text" size="small" v-on:click.stop="setUserNotLike(item.resourcesId,index)" icon="iconfont iconexpressionfailure">不感兴趣</el-button> -->
                        </span>

                    </div>
                </div>
            </div>
            <div class="infinite-scroll" v-show="loading" style="text-align: center;padding: 25px;">
                  <span class="infinite-scroll-text">努力加载中...</span><img style="height: 16px;margin-left: 15px;" src="../../assets/img/load.gif" alt="">
                </div>
                <div v-if="articleList.length == 0" style="text-align: center;padding: 50px;">
                  <img src="~@/assets/img/no-data.png" alt="" style="width: 180px;margin-bottom: 15px;">
                  <div>暂无资源</div>
                </div>
        </div>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import customHeader from '../components/header.vue'
import {
    getCommHttpData
  } from '@/utils/common'
  import defaultPic from '@/assets/img/no-thumb.png'

export default {
    data () {
        return {
          keywords:'',
          imgUrl: window.SITE_CONFIG.imgIP,
          defaultPic: defaultPic,
          rsUserId:this.GLOBAL.getRsUserId(),
          page:1,
          articleList: [],
          totalPage:'',
          isrequire:true,
          loading: false,
        }
    },
    computed: {
        // userName: {
        //     get () { return this.$store.state.user.name }
        // }
    },
     components:{customHeader},
    mounted() {
      this.keywords=this.$route.params.wd ? this.$route.params.wd : ''
      this.getSearch()
       window.addEventListener('scroll', this.scrollBottom,true)
    },
    destroyed(){
    			//  删除监听事件
            	window.removeEventListener('scroll',this.scrollBottom,true);
    		},
    methods: {
      //查看资源详情
      goDetail(item){
        let routeData
        if(item.channelName == '电子课本'){
          routeData = this.$router.resolve({path:'/book-detail',query:{id:item.resourcesId}});
        }else{
          routeData = this.$router.resolve({path:'/detail',query:{id:item.resourcesId}});
        }
          window.open(routeData.href, '_blank');
      },
      scrollBottom() {
                var h = window.pageYOffset || document.body.scrollTop || document.body.scrollHeight;
        // 滚动到页面底部时，请求前一天的文章内容
        if (((window.screen.height + h) > (document.body.clientHeight)) && this.isrequire && this.page < this.totalPage) {
          // 请求的数据未加载完成时，滚动到底部不再请求前一天的数据
          this.isrequire = false;
          this.loading = true;
          let page = this.page
          this.page = page+1
          this.getSearch()
        }
      },
        //搜索
        getSearch(type){
          if(!this.keywords){
            return false
          }
          if(type ==1){
            this.page =1
            this.articleList = []
          }
          let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/resourcesInfo/search',
              method: 'post',
              contentType: 2,
              data: {
                rsUserId: this.rsUserId,
                keywords:this.keywords,
                offset:this.page,
                limit:20,
                sidx:'',
                order:''
              },
            }, function(res) {
              let tmpList = [...that.articleList]

                that.isrequire = true;
               that.loading = false;
              that.articleList = tmpList.concat(res.page.list)
              that.totalPage = res.page.totalPage
            })
        },
        setUserCollect(type, resourcesId,index) {
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/add/userCollected',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              type: type,
              resourcesId: resourcesId
            },
          }, function(res) {
			  that.$message({
			    message: type == 1 ? '收藏成功' : '取消成功',
			    type: 'success',
			  });
              that.articleList[index].isCollected = type == 1 ? 1 : 0
            that.$forceUpdate()

             // that.$emit("initData");
          })

        },
        //添加不感兴趣
        setUserNotLike(resourcesId,index) {
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/add/userNotLike',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              resourcesId: resourcesId
            },
          }, function(res) {
            that.articleList.splice(index,1)
            // that.$emit("initData");
          })
        },
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
    background-color: #FFFFFF;
    // padding-left: 15px;
    // padding-right: 30px;

    &__body {
        height: 60px;
        width: 1170px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #3c85ee;
        background-color: transparent;
        .site-navbar-list{
          display: flex;
          span{
            margin: 0 15px;
            color: #3c85ee;cursor: pointer;
            font-size: 15px;
          }
        }
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
.search-container{
  width: 1170px;
      margin: 0px auto;
      margin-top: 85px;
}
.search-box{
  text-align: center;
  img{
    height: 35px;
    margin-right: 10px;
  }
  /deep/ .el-button{
      background-color: #3C85EE;
      color: #FFFFFF;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
  }
}
.index-content--wrapper{
    width: 900px;
    background-color: #fff;
    margin-left: 150px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.item--inner{
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #f1f1f1;
    .article--img{
        transform-style: preserve-3d;
        margin-right: 20px;
        img{
            width: 189px;
            height: 104px;
            border-radius:4px;
            transition: all .5s ease-out .1s;
        }
    }
    .rbox--inner{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title--box{
            max-height: 52px;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            /* autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            -webkit-line-clamp: 2;
            .title-content{
                font-size: 16px;
                font-weight: bold;
                &:hover{
                  cursor: pointer;
                  color: #3C85EE;
                }
            }
        }
        .c-box{
            line-height: 20px;
            padding: 5px 0 0 2px;
            .article--type{
                font-size: 12px;
                padding: 1px 2px;
                border: 1px solid #FEB23A;
                color: #FEB23A;
            }
            .article--tag{
              margin-left: 6px;
              color: #333;
              &:hover{
                cursor: pointer;
                color: #999999;
              }
            }
        }
        .y-box{
            color: #8590A6;
            margin-top: 10px;
             display: flex;
             justify-content: space-between;
            /deep/ .el-button{
               color: #8590A6;
               font-size: 14px;
               padding: 0;
            }
            /deep/ .el-button .iconfont{
                padding-right: 3px;
            }
            /deep/ .el-button .is-collect {
              color: #3C85EE;
            }
        }
    }
}
</style>
