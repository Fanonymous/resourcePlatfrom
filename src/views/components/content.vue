<template>
  <div class="index-content--wrapper">
    <div class="feed--box">
      <div v-for="(item, index) in articleList" :key="index" class="item--inner" @click="$router.push({path:'/detail',query:{id:item.resourcesId}})">
        <div class="article--img" v-if="item.thumbAddress">
          <img v-real-img="imgUrl + item.thumbAddress" :src="defaultPic">
        </div>
        <div class="rbox--inner">
          <div>
            <div class="title--box">
              <span class="title-content">{{item.title.length >65? item.title.substr(0,65)+'...':item.title}}<img v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png" alt=""></span>
              <!-- <span v-if="item.isPreferred == 1">优选</span> -->
            </div>
            <div class="c-box">
              <span class="article--type">{{item.channelName}}</span>
              <span style="margin-left: 6px; color: #333;">{{item.tagsName}}</span>
            </div>
          </div>
          <div class="y-box">
            <span style="margin-right: 10px;">
              <span class="iconfont iconchakan"></span>
              <span>{{item.viewCount}}人看过</span>
            </span>
            <el-button type="text" size="small" icon="iconfont iconfenxiang">分享</el-button>
            <template>
              <el-button type="text" v-if="item.isCollected == 1" @click="setUserCollect(2,item.resourcesId)" icon="is-collect iconfont iconbuoumaotubiao44">收藏</el-button>
              <el-button type="text" v-else size="small" @click="setUserCollect(1,item.resourcesId)" icon="iconfont iconbuoumaotubiao44">收藏</el-button>
            </template>
            <el-button type="text" size="small" @click="setUserNotLike(item.resourcesId)" icon="iconfont iconexpressionfailure">不感兴趣</el-button>
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
</template>

<script>
  import {
    getCommHttpData
  } from '@/utils/common'
  import defaultPic from '@/assets/img/no-thumb.png'
  export default {
    props:['articleList','loading'],
    data() {
      return {
        rsUserId: this.GLOBAL.getRsUserId(),
        defaultPic:defaultPic,
        imgUrl: window.SITE_CONFIG.imgIP,
      }
    },

    methods: {

      setUserCollect(type, resourcesId) {
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
          if (type == 1) {
            that.$message({
              message: '收藏成功',
              type: 'success',
            });
          }
           that.$emit("initData");
        })

      },
      //添加不感兴趣
      setUserNotLike(resourcesId) {
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
          that.$emit("initData");
        })
      },



    }
  }
</script>

<style lang="scss" scoped>
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
