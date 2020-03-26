<template>
    <div class="index--container">
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
                  <!-- <span v-if="item.isPreferred == 1">优选</span> -->
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
                <!-- <el-button type="text" size="small" icon="iconfont iconfenxiang">分享</el-button> -->
                <template>
                  <el-button type="text" v-if="item.isCollected == 1" v-on:click.stop="setUserCollect(2,item.resourcesId,index)" icon="is-collect iconfont iconbuoumaotubiao44">收藏</el-button>
                  <el-button type="text" v-else size="small" v-on:click.stop="setUserCollect(1,item.resourcesId,index)" icon="iconfont iconbuoumaotubiao44">收藏</el-button>
                </template>
                <el-button type="text" size="small" v-on:click.stop="setUserNotLike(item.resourcesId,index)" icon="iconfont iconexpressionfailure">不感兴趣</el-button>
              </div>
            </div>
          </div>
          <div class="infinite-scroll" v-show="loading" style="text-align: center;padding: 25px;">
                <span class="infinite-scroll-text">努力加载中...</span><img style="height: 16px;margin-left: 15px;" src="../../assets/img/load.gif" alt="">
              </div>
              <div v-if="articleList.length == 0" style="text-align: center;margin-top: 100px;">
                <img src="~@/assets/img/no-data.png" alt="" style="width: 180px;margin-bottom: 15px;">
                <div>暂无资源</div>
              </div>
        </div>
      </div>
        <!-- <atricleContent :articleList ="articleList" :loading="loading" @initData="getDataList" ></atricleContent> -->
        <rightSidebar :scrollTop = "scrollTop" :isClick="page1<totalPage1" :hotList="hotList" :dayPushList="dayPushList" @changeOptimization="changeOptimization" :viewnum="userInfo.viewNum" :collectednum="userInfo.collectedNum" :subscribednum="userInfo.subscribedNum" class="index--right" :channelId="channelId"></rightSidebar>
        <el-backtop></el-backtop>
    </div>

</template>

<script>
import atricleContent from '../components/content'
import rightSidebar from '../components/right-sidebar'
import defaultPic from '@/assets/img/no-thumb.png'
import {
    getCommHttpData
  } from '@/utils/common'
export default {
    data() {
        return {
            articleList:[],
            isrequire:true,
            loading: false,
            channelId:'',
            page:1,
            rsUserId:this.GLOBAL.getRsUserId(),
            totalPage:'',
            defaultPic:defaultPic,
            imgUrl: window.SITE_CONFIG.imgIP,
            userInfo:'',
            hotList:[],
            dayPushList:[],
            page1:1,
            totalPage1:'',
            scrollTop :0
        }
    },

    components: {atricleContent, rightSidebar },
    mounted() {
       this.channelId = this.$route.query.channelId
      this.getDataList()
      this.getUserInfo()
      this.getHotResourceList()
      this.getOptimizationResourceList()
      // 添加滚动事件，检测滚动到页面底部
      window.addEventListener('scroll', this.scrollBottom,true)
    },
    destroyed(){
    			//  删除监听事件
            	window.removeEventListener('scroll',this.scrollBottom,true);
    		},
    methods:{
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
      //添加、取消收藏
      scrollBottom() {
                var h = window.pageYOffset || document.body.scrollTop || document.body.scrollHeight;
                this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        // 滚动到页面底部时，请求前一天的文章内容
        if (((window.screen.height + h) > (document.body.clientHeight)) && this.isrequire && this.page < this.totalPage) {
          // 请求的数据未加载完成时，滚动到底部不再请求前一天的数据
          this.isrequire = false;
          this.loading = true;
          let page = this.page
          this.page = page+1
          this.getDataList()
        }
      },
      //获取阅读量
      getUserInfo(){
        let that = this
        getCommHttpData({
            url: '/iConductor-knowledge-platform/userinfo',
            method: 'post',
            contentType: 2,
            data: {
                rsUserId: this.rsUserId
            },
        },function(res){
            that.userInfo = res.userinfo
        })
      },
      //数据列表
      getDataList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/homepage/resourcesList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            offset: this.page,
            limit:20,
            order:'',
            sidx:''
          },
        }, function(res) {
          let tmpList = [...that.articleList]

          that.articleList = tmpList.concat(res.page.list)
          that.isrequire = true;
          that.loading = false;
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
          if (type == 1) {
            that.articleList[index].isCollected = 1
            that.userInfo.collectedNum=that.userInfo.collectedNum+1
            }else{
                that.articleList[index].isCollected = 0
                that.userInfo.collectedNum=that.userInfo.collectedNum-1
              }
              that.$forceUpdate()
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
        })
      },
      //获取热门榜
      getHotResourceList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/homepage/hotResourceList',
          method: 'post',
          contentType: 2,
          data: {
            limit:5,
            offset:1,
            order:'',
            sidx:''
          },
        }, function(res) {
          that.hotList = res.list
        })
      },
      //获取每日优选
      getOptimizationResourceList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/homepage/optimizationResourceList',
          method: 'post',
          contentType: 2,
          data: {
            isPreferred:1,
            limit:5,
            offset:this.page1,
            order:'',
            sidx:''
          },
        }, function(res) {
          that.dayPushList = res.list
          // that.totalPage1 = res.page.totalPage
        })
      },
      //每日优选换一换
      changeOptimization(){
        // let page = this.page1
        // if(page < this.totalPage1){
        //   this.page1 = page+1
          this.getOptimizationResourceList()
        // }
      }
    }
}
</script>

<style lang="scss" scoped>
.index--container{
    display: flex;
    position: relative;
    margin-left: 206px;
}
.index--right{
    margin-left: 12px;
}
.index-content--wrapper {
    width: 670px;
    background-color: #fff;
  }


  .item--inner {
    display: flex;
    padding: 20px;
    border-bottom: 1px solid #f1f1f1;

    .article--img {
      transform-style: preserve-3d;
      margin-right: 20px;

      img {
        width: 189px;
        height: 104px;
        border-radius: 4px;
        transition: all .5s ease-out .1s;
      }
    }

    .rbox--inner {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .title--box {
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

        .title-content {
          font-size: 16px;
          font-weight: bold;
          &:hover{
            cursor: pointer;
            color: #3C85EE;
          }
        }
      }

      .c-box {
        line-height: 20px;
        padding: 5px 0 0 2px;

        .article--type {
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

      .y-box {
        color: #8590A6;
        margin-top: 10px;

        /deep/ .el-button {
          color: #8590A6;
          font-size: 14px;
          padding: 0;
        }

        /deep/ .el-button .iconfont {
          padding-right: 3px;
        }

        /deep/ .el-button .is-collect {
          color: #3C85EE;
        }
      }
    }
  }
</style>
