<template>
  <div class="user-container">
    <custom-header></custom-header>
    <div class="content">
      <header class="panel-heading" v-if="detailInfo.tagNameArr">
        当前位置：
        <span class="res-classtype">
          <template v-if="detailInfo.tagNameArr" v-for="(item,index) in detailInfo.tagNameArr">
            <template v-if="index > 0">&nbsp;>&nbsp;</template>
            <!-- <span @click="detailInfo.tagNameArr.length > 1 && handleRouter(paramTags.slice(0,index+2))">{{item}}</span> -->
            <span>{{item}}</span>
          </template>
          <!-- &nbsp;>&nbsp; -->
          <!-- <span>语文</span>&nbsp;>&nbsp;
          <span>学前小班上</span> -->
        </span>
      </header>
      <el-row :gutter="20" class="marg-20">
        <el-col :span="18">
          <div class="left-wrapper">
            <div class="left-title el-between marg-20">
              <span><i style="font-size: 16px;" class="iconfont iconziyuan"></i>{{detailInfo.title}}</span>
              <el-button type="primary" size="mini" v-show="false">下载</el-button>
            </div>
            <div class="el-between marg-20">
              <div class="pull-box">
                <template v-if="detailInfo.uploadTime">
                  <i class="el-icon-time"></i><span>{{detailInfo.uploadTime}}</span>
                </template>
                <template v-if="detailInfo.downloadCount">
                  <i class="el-icon-download "></i><span>{{detailInfo.downloadCount}}</span>
                </template>
                <template v-if="detailInfo.viewCount">
                  <i class="iconfont iconchakan"></i><span>{{detailInfo.viewCount}}</span>
                </template>
                <template v-if="detailInfo.size">
                  <i class="el-icon-document"></i><span>{{detailInfo.size}}</span>
                </template>
                <template v-if="detailInfo.uploadBy">
                  <i class="el-icon-user"></i><span>{{detailInfo.uploadBy}}</span>
                </template>


                <span v-popover:popover style="cursor: pointer;">详细信息&nbsp;></span>
                <el-popover ref="popover" placement="bottom" width="500" trigger="hover">
                  简介:{{detailInfo.introduction}}
                </el-popover>
              </div>
              <div class="pull-box">
                <i :style="detailInfo.isCollected==1 ? 'color:#3C85EE' : ''" @click="setUserCollect()" class="iconfont iconbuoumaotubiao44"></i>
                <!-- <span>{{detailInfo.collectionCount ? detailInfo.collectionCount : 0}}</span> -->
                <span>收藏</span>
                <i v-if="type2.includes(detailInfo.resourcesType) || detailInfo.resourcesType=='PDF'" style="font-size: 25px;color: #999;" class="iconfont iconquanping" @click="toggle"></i>
                <!-- <i class="iconfont iconfenxiang" style="margin-right: 5px;"></i>分享 -->
              </div>
            </div>
            <div class="left-body" v-loading="detaiLoading">
              <template v-if="detailInfo.resourcesAddress">
                <div v-if="detailInfo.resourcesType=='MP4'" style="text-align: center;">
                  <template v-if="tempType == 'M3U8' || tempType == 'MP4'">
                    <video id="my-video" style="width: 100%;height: 500px;" class="video-js vjs-default-skin vjs-big-play-centered"
                      controls autoplay="autoplay" preload="auto">
                    </video>
                  </template>
                  <template v-else>
                    <div ref='video'></div>
                  </template>

                </div>

                <!-- <video v-if="detailInfo.resourcesType=='MP4'" id="iembed" height="500px" width="100%" :src="detailInfo.resourcesAddress"
                  type="video/mp4" autoplay="autoplay" controls="controls"><img style="display:block;margin:0 auto;width:100%;height:auto;" /></video> -->

                <template v-else-if="detailInfo.resourcesType=='SWF' || detailInfo.resourcesType=='FLV'">
                  <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0">
                    <param name="movie" value="Flvplayer.swf" />
                    <param name="quality" value="high" />
                    <param name="allowFullScreen" value="true" />
                    <embed :src="detailInfo.resourcesAddress" allowfullscreen="true" flashvars="vcastr_file=detailInfo.resourcesAddress+'&IsAutoPlay=1&LogoUrl=images/logo.jpg"
                      quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"
                      width="100%" height="500"></embed>
                  </object>
                </template>
                <div v-else-if="type1.indexOf(detailInfo.resourcesType)>-1" style="text-align:center;height: 500px;display: flex;align-items: center;justify-content: center;">
                  <img style="display:block;margin:0 auto;width:auto;max-height:100%;width:auto;" v-real-img="detailInfo.resourcesAddress"
                    :src="allPic" /></div>

                <div v-else-if="detailInfo.resourcesType=='PDF'" style="text-align:center;">
                  <fullscreen ref="fullscreen" :wrap="true" @change="fullscreenChange">
                    <div class="full__div">
                      <iframe :src="detailInfo.resourcesAddress" style="width:100%;height:500px"></iframe>
                    </div>
                  </fullscreen>
                </div>
                <div v-else-if="type2.includes(detailInfo.resourcesType)" style="text-align:center;">
                  <fullscreen ref="fullscreen" :wrap="true" @change="fullscreenChange">
                    <div class="full__div">
                      <iframe :src="'http://'+detailInfo.resourcesAddress" style="width:100%;height:500px"></iframe>
                    </div>
                  </fullscreen>
                </div>

                <div v-else style="text-align:center;"><img style="display:block;margin:0 auto;width:auto;height:100%;"
                    :src="allPic" /></div>

              </template>
              <template v-else>
                <div style="text-align:center;"><img style="display:block;margin:0 auto;width:auto;height:100%;" :src="allPic" /></div>
              </template>
            </div>
          </div>

        </el-col>
        <el-col :span="6">
          <div class="feed--box">
            <div class="header-body">相关资源推荐</div>
            <el-row :gutter="20">
              <el-col v-if="relationList.length == 0">
                <div style="text-align: center;">暂无资源</div>

              </el-col>
              <el-col :span="24" v-for="item in relationList">
                <div class="sub-item" @click="goDetail(item)">
                  <img class="sub-left" v-real-img="item.thumbAddress" :src="allPic">
                  <div class="sub-right">
                    <div class="right-title" :title="item.title">{{item.title && item.title.length > 10 ? item.title.substr(0,10)+'...':item.title}}</div>
                    <div class="right-item">
                      {{ item.tagsName!=0 ? item.tagsName : '&nbsp;'}}
                    </div>
                    <div class="right-item" style="margin-top: 8px;">
                      浏览过:{{item.viewCount ? item.viewCount : 0}}次
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="24" v-if="page2<totalPage2">
                <div @click="changeRelation()" style="padding: 18px;text-align: center;color:#3C85EE ;cursor: pointer;">
                  查看更多
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div v-if="bestResourceList.length > 0" class="el-between border-bottom marg-20" style="padding-bottom: 10px;"><span
          class="font-bold">名师资源</span><span><i class="el-icon-arrow-left" @click="changeBestList(1)"></i> {{page}}/{{totalPage}}
          <i class="el-icon-arrow-right" @click="changeBestList(2)"></i></span></div>
      <el-row :gutter="12">
        <el-col :span="6" class="marg-20" v-for="item in bestResourceList" :key="item.resourcesId">
          <el-card class="card-wrapper" :body-style="{ padding: '0px' }">
            <div @click="goDetail(item)">
              <div class="mess-box" v-if="item.resourcesType">
                {{item.resourcesType}}
              </div>
              <img v-real-img="item.thumbAddress" :src="allPic" class="image" />
              <div class="resource-mess">
                <div>{{item.tagsName}}| {{item.title}}<img src="~@/assets/img/best-change.png" alt="" v-if="item.isPreferred==1"></div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-if="mayLikeResourceList.length > 0" class="el-between border-bottom marg-20" style="padding-bottom: 10px;"><span
          class="font-bold">猜你喜欢</span><span class="font-grey" :style="{cursor:(page1<totalPage1?'pointer':'not-allowed')}"
          @click="changeMayList()">换一换</span></div>
      <!-- <el-row :gutter="15">
        <el-col :span="6" class="marg-20" v-for="item in mayLikeResourceList">
          <el-card class="card-wrapper" :body-style="{ padding: '0px' }">
            <div @click="goDetail(item)">

              <div class="mess-box" v-if="item.resourcesType">
                {{item.resourcesType}}
              </div>
              <img v-real-img="item.thumbAddress" :src="allPic" class="image" />
              <div class="resource-mess">
                <div>{{item.channelName}}| {{item.title}}<img src="~@/assets/img/best-change.png" alt="" v-if="item.isPreferred==1"></div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row> -->

      <el-row :gutter="15" v-for="rIndex of Math.ceil(mayLikeResourceList.length/4)" :key="rIndex">
        <el-col :span="6" v-for="(item, index) in mayLikeResourceList" v-if="index < 4 && mayLikeResourceList[(rIndex-1)*4+index]"
          style="margin-bottom:20px;">
          <el-card class="card-wrapper" :body-style="{ padding: '0px' }">
            <div @click="goDetail(mayLikeResourceList[(rIndex-1)*4+index])">
              <div class="mess-box" v-if="mayLikeResourceList[(rIndex-1)*4+index].resourcesType">
                {{mayLikeResourceList[(rIndex-1)*4+index].resourcesType}}
              </div>
              <img v-real-img="mayLikeResourceList[(rIndex-1)*4+index].thumbAddress" :src="allPic" class="image" />
              <div class="resource-mess">
                <div>{{mayLikeResourceList[(rIndex-1)*4+index].channelName}}|
                  {{mayLikeResourceList[(rIndex-1)*4+index].title}}<img v-if="mayLikeResourceList[(rIndex-1)*4+index].isPreferred == 1"
                    src="~@/assets/img/best-change.png" alt=""></div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>



    </div>
  </div>
</template>

<script>
  import allPic from '@/assets/img/no-thumb.png'
  import customHeader from '../components/header.vue'
  import {
    getCommHttpData
  } from '@/utils/common'
  import videojs from 'video.js/dist/video.min'
  import 'video.js/dist/video-js.min.css'
  import 'videojs-flash/dist/videojs-flash';
  export default {
    data() {
      return {
        detaiLoading: true,
        paramTags: [],
        word: '',
        allPic: allPic,
        activeName: 'first',
        imgUrl: window.SITE_CONFIG.imgIP,
        type1: ['PNG', 'JPG', 'JPEG', 'GIF'],
        rsUserId: this.GLOBAL.getRsUserId(),
        resourcesId: '',
        type2: ['XLS', 'XLSX', 'XLSM', 'DOC', 'DOCX', 'DOT', 'DOTM', 'DOCM', 'TXT', 'PPTX', 'PPT', 'POT', 'POTM',
          'PPTM', 'XLS', 'XLSX', 'XLSM'],
        detailInfo: {},
        relationList: [],
        bestResourceList: [],
        mayLikeResourceList: [],
        page1: 1,
        page: 1,
        totalPage: '',
        totalPage1: '',
        page2: 1,
        totalPage2: '',
        myVideo: '',
        tempType: '',
        fullscreen: false,
      }
    },
    computed: {
      // userName: {
      //   get() {
      //     return this.$store.state.user.name
      //   }
      // }
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          window.location.reload();
        },
        // 深度观察监听
        deep: true
      }
    },
    components: {
      customHeader
    },
    mounted() {
      this.resourcesId = this.$route.query.id
      this.getDetail()
      this.getRelationResources()
      this.getBestTeacherResources()
      this.getMayLikeResources()
    },
    beforeDestroy: function() {
      this.myVideo && this.myVideo.dispose();
    },
    methods: {
      //全屏
      toggle() {
        this.$refs['fullscreen'].toggle()
      },
      fullscreenChange(fullscreen) {
        this.fullscreen = fullscreen
      },
      //查看资源详情
      goDetail(item) {
        let routeData
        if (item.channelName == '电子课本') {
          routeData = this.$router.resolve({
            path: '/book-detail',
            query: {
              id: item.resourcesId
            }
          });
        } else {
          routeData = this.$router.resolve({
            path: '/detail',
            query: {
              id: item.resourcesId
            }
          });
        }
        window.open(routeData.href, '_blank');
      },
      //tiaozhuan
      handleRouter(item) {
        this.$router.push({
          path: '/less-plan',
          query: {
            tagIds: item.toString()
          }
        })
      },
      //是否收藏
      setUserCollect() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/add/userCollected',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            type: that.detailInfo.isCollected == 1 ? 0 : 1,
            resourcesId: that.detailInfo.resourcesId
          },
        }, function(res) {
          let isCollect = that.detailInfo.isCollected
          let count = that.detailInfo.collectionCount
          that.$message({
            message: isCollect != 1 ? '收藏成功' : '取消成功',
            type: 'success',
          });
          if (isCollect != 1) {
            that.detailInfo.isCollected = 1;
            that.detailInfo.collectionCount = count + 1
          } else {
            that.detailInfo.isCollected = 0
            that.detailInfo.collectionCount = count - 1
          }
        })

      },
      //查询资源详情
      getDetail() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/resourcesInfo/info',
          method: 'post',
          contentType: 1,
          data: {
            resourcesId: this.resourcesId,
            rsUserId: this.rsUserId
          },
        }, function(res) {
          that.detaiLoading = false
          that.detailInfo = res.fileDetail
          if (!that.detailInfo.resourcesType && that.detailInfo.resourcesAddress) {
            let temAddr = that.detailInfo.resourcesAddress.lastIndexOf(".")
            let fileNameLength = that.detailInfo.resourcesAddress.length; //获取到文件名长度
            that.detailInfo.resourcesType = that.detailInfo.resourcesAddress.substring(temAddr + 1, fileNameLength)
              .toUpperCase();
          }
          that.detailInfo.tagNameArr = that.detailInfo.tagsName && that.detailInfo.tagsName.split(',')
          let tags = that.detailInfo.tags && that.detailInfo.tags.split(',')
          that.paramTags = that.detailInfo.tagNameArr && tags.slice(1, that.detailInfo.tagNameArr.length + 2)
          if (that.detailInfo.resourcesType == 'MP4') {
            let temAddr = that.detailInfo.resourcesAddress.lastIndexOf(".")
            let fileNameLength = that.detailInfo.resourcesAddress.length; //获取到文件名长度
            that.tempType = that.detailInfo.resourcesAddress.substring(temAddr + 1, fileNameLength).toUpperCase();
            if (that.tempType == 'M3U8' || that.tempType == 'MP4') {
              that.$nextTick(() => {
                that.myVideo = videojs("my-video", {
                  bigPlayButton: true,
                  textTrackDisplay: false,
                  posterImage: false,
                  errorDisplay: false,
                  hls: {
                    withCredentials: true
                  },
                  function() {
                    this.play()
                  }
                });
                that.myVideo.src({
                  src: that.detailInfo.resourcesAddress,
                  type: that.tempType == 'M3U8' ? 'application/x-mpegURL' : 'video/mp4',
                })
              })
            } else {
              that.$nextTick(() => {
                let ele = document.createElement('script')
                ele.src = that.detailInfo.resourcesAddress
                ele.type = "text/javascript"
                that.$refs.video.append(ele)
              })
            }
          }
          getCommHttpData({
            url: '/iConductor-knowledge-platform/read/resourcesInfo',
            method: 'post',
            contentType: 2,
            data: {
              resourcesId: that.resourcesId,
              rsUserId: that.rsUserId
            },
          }, function(res) {

          })
        })
      },
      //格式化资源

      //相关资源推荐
      getRelationResources() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/resourcesInfo/relationResources',
          method: 'post',
          contentType: 2,
          data: {
            resourcesId: this.resourcesId,
            offset: this.page2,
            limit: 6,
            order: '',
            sidx: ''
          },
        }, function(res) {
          let tmpList = [...that.relationList]
          that.relationList = tmpList.concat(res.page.list)
          that.totalPage2 = res.page.totalPage
        })
      },
      changeRelation() {
        let page = this.page2
        if (page < this.totalPage2) {
          this.page2 = page + 1
          this.getRelationResources()
        }

      },
      //名师资源
      getBestTeacherResources() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/resourcesInfo/bestTeacherResources',
          method: 'post',
          contentType: 2,
          data: {
            resourcesId: this.resourcesId,
            rsUserId: this.rsUserId,
            offset: this.page,
            limit: 4,
            order: '',
            sidx: ''
          },
        }, function(res) {
          that.bestResourceList = res.page.list
          that.totalPage = res.page.totalPage
        })
      },
      //猜你喜欢
      getMayLikeResources() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/resourcesInfo/mayLikeResources',
          method: 'post',
          contentType: 2,
          data: {
            resourcesId: this.resourcesId,
            rsUserId: this.rsUserId,
            offset: this.page1,
            limit: 8,
            order: '',
            sidx: ''
          },
        }, function(res) {
          that.mayLikeResourceList = res.page.list
          that.totalPage1 = res.page.totalPage
        })
      },
      changeMayList() {
        let page = this.page1
        if (page < this.totalPage1) {

          this.page1 = page + 1
          this.getMayLikeResources()
        }
      },
      changeBestList(type) {
        if (type == 1 && this.page == 1 && this.page == this.totalPage) {
          return false
        }
        let page = this.page
        this.page = type == 1 ? (page - 1) : (page + 1)
        this.getBestTeacherResources()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .border-left {
    border-left: 6px solid #3C85EE;
    padding: 5px;

    border-bottom: 1px solid #CCCCCC;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .user-container {
    width: 1170px;
    margin: 0px auto;
    margin-top: 80px;

  }
  .fullscreen{
    background: #FFFFFF !important;
    .full__div{
      text-align: center;
      margin: 0 auto;
      height: 100%;
      width: 1050px;
      border: 1px solid #CCCCCC;
      padding: 15px;
      iframe{
        height: 100% !important;
      }
    }
  }

  .content {
    .panel-heading {
      margin-bottom: 20px;

      .res-classtype {
        cursor: pointer;
        font-weight: normal;
        font-size: 14px;

        // span:hover {
        //   color: #3C85EE;
        // }
      }
    }

    .left-wrapper {
      background-color: #fff;
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      padding: 15px;

      .left-title {
        font-size: 15px;
        font-weight: bold;

        i {
          font-size: 22px;
          margin-right: 10px;
        }
      }

      .pull-box {
        span {
          margin-right: 20px;
          margin-left: 5px;
        }
      }

      .left-body {
        height: 533px;
        padding: 15px;
        border: 1px solid #CCCCCC;
      }
    }

    .feed--box {
      // width: 270px;
      background-color: #fff;
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      padding: 15px;
      height: 649px;
      overflow-y: auto;
      padding-bottom: 0;

      &::-webkit-scrollbar {
        /*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
        width: 5px;
        height: 5px;
      }

      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        background: rgba(144, 147, 153, .5);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        background: #FFFFFF;
      }

      .header-body {
        margin-bottom: 15px;
        // border-left: 6px solid #3C85EE;
        font-weight: bold;
      }

      .sub-item {
        border-bottom: 1px solid #eee;
        padding-top: 15px;
        padding-bottom: 15px;
        // padding-left: 0;
        display: flex;
        align-items: center;
        // margin-bottom: 15px;

        .sub-left {
          width: 30%;
          height: 60px;
          // border-radius: 50%;
          margin-right: 15px;
        }

        .sub-right {
          flex: 1;

          .right-title {
            color: #333;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .right-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #8590A6;
            font-size: 12px;
          }
        }
      }
    }

    .card-wrapper {
      position: relative;
      cursor: pointer;

      .image {
        width: 100%;
        margin-bottom: 10px;
        // margin: 0px 10% 15px;
        height: 128px;
      }

      .mess-box {
        position: absolute;
        top: 10px;
        right: 0px;
        font-size: 12px;

        background: #FEB23A;
        color: #FFFFFF;
        padding: 2px 4px;
        border-radius: 4px 0px 0px 4px;
      }

      .resource-mess {
        padding-left: 15px;
        padding-bottom: 15px;

        img {
          width: 32px;
          height: 18px;
          margin-left: 5px;
        }
      }
    }


  }
</style>
