<template>
  <div style="background: #F1F4F5;padding-top: 70px;">
    <MainNavbar></MainNavbar>
    <div class="less-container">
      <!-- <el-card> -->
      <div class="header-box" v-if="detailInfo">
        <div class="header-left">
          <b style="padding-left: 0;font-size: 16px;padding-right: 8px;" @click="goMyBook()">电子课本</b>
          <template v-for="(item,index) in detailInfo.tagNameArr">
            <!-- <template v-if="index > 0">&nbsp;|&nbsp;</template><span @click="detailInfo.tagNameArr.length > 1 && handleRouter(paramTags.slice(0,index+2))">{{item}}</span> -->
            <template v-if="index > 0">&nbsp;|&nbsp;</template>
            <span v-if="index == 1 && detailInfo.tagNameArr.length > 2">{{detailInfo.tagNameArr[2]}}</span>
            <span v-else-if="index == 2">{{detailInfo.tagNameArr[1]}}</span>
            <span v-else>{{item}}</span>
          </template>
        </div>
        <div>
          <span class="second-btn" v-if="detailInfo.isCollected == 1" @click="setUserCollect(2)">
            <div class="is-sub"><i class="el-icon-check"></i></i>已加入书架</div>
            <div class="cancel-sub"></i><i class="el-icon-delete"></i>移出书架</div>
          </span>
          <span class="second-btn" v-else @click="setUserCollect(1)"><i class="el-icon-plus"></i>加入书架</span>
        </div>
      </div>
      <div class="icon__group" style="user-select: none;">
        <!-- <i class="iconfont iconsuoxiao" @click="changeLarge"></i>
        <i class="iconfont iconfangda" @click="changeLetting"></i> -->
        <i class="iconfont iconquanping" @click="toggle"></i>
      </div>
      <fullscreen ref="fullscreen" :wrap="true" @change="fullscreenChange">
      <div class="content-resource" :style="'min-height:'+appHeight+'px'">
        <i v-if="currentPage>1" @click="onPrevPage" class="iconfont iconzuojiantou"></i>
        <div class="flipbook">
          <div class="page-container" ref="container" v-for="page in docPages" :style="{height: `${appHeight}px`}" :key="page">
            <canvas>
            </canvas>
          </div>
        </div>
        <i v-if="currentPage<docPages" @click="onNextPage" class="iconfont iconyoujiantou"></i>
      </div>
      </fullscreen>



    </div>
    <ComFooter></ComFooter>
  </div>

</template>

<script>
  import {
    getCommHttpData
  } from '@/utils/common'
  import allPic from '@/assets/img/no-thumb.png'
  import MainNavbar from '../components/header'
  import ComFooter from '../common/com-footer'
  // import remoteLoad from './remoteLoad2'
  import pdfJS from 'pdfjs-dist'
  import turn from '@/utils/turn.js'
  export default {
    data() {
      return {
        allPic: allPic,
        imgUrl: window.SITE_CONFIG.imgIP,
        rsUserId: this.GLOBAL.getRsUserId(),
        userinfo: this.GLOBAL.getUserinfo(),
        detailInfo: null,
        loading: false,
        resourcesId: '',
        appHeight: 800,
        paramTags: [],

        doc: null,
        docPages: 0,
        currentPage: 0,
        pageHeight: 0,
        renderList: [],
        show: false,
        fullscreen: false,
        scale:1
      }

    },
    mounted() {
      this.resourcesId = this.$route.query.id
      window.addEventListener('resize', () => {
        this.appHeight = window.innerHeight - 180
      })

      this.appHeight = window.innerHeight - 180
      this.getDetail()
    },
    components: {
      MainNavbar,
      ComFooter
    },
    methods: {
      //我的书架
      goMyBook(){
        window.location.href = location.origin+'/my-book?channelId='+this.$route.query.channelId
        // this.$router.push({
        //   path: '/my-book',
        //   query: {
        //     channelId: this.channelId
        //   }
        // })
      },
      toggle() {
          this.$refs['fullscreen'].toggle()
      },
      fullscreenChange(fullscreen) {
          this.fullscreen = fullscreen
      },
      //tiaozhuan
      handleRouter(item){

        this.$router.push({path:'/text-book',query:{tagIds:item.toString(),channelId: this.$route.query.channelId}})
      },
      //fangda
      // changeLarge(){
      //   this.scale += 0.1;
      //   this.renderPage(this.currentPage,1);
      // },
      // changeLetting(){
      //   this.scale -= 0.1;
      //   console.log(this.currentPage,'dhdhdhhd')
      //   this.renderPage(this.currentPage,1);
      // },
      getPDFFile(url) {
        if (!url) return
        this.currentPage = 0
        let that = this
        pdfJS.getDocument(url).then(pdf => {
          this.doc = pdf
          this.docPages = pdf.numPages
          // this.docPages = 2
          this.$nextTick(() => {
            this.docPages && this.renderPage(1)
            this.$nextTick(() => {
              // function loadApp(){
                  $('.flipbook').turn({
                    width: 1070,
                    height: that.appHeight,
                    elevation: 10,
                    gradients: true,
                    autoCenter: true,
                    acceleration:false,
                    when: {
                      turning: function(e, page, view) {
                        that.renderPage(page)
                        that.renderPage(page+1)
                      },
                      turned: function(e, page, view) {
                      },
                      missing: function(e, pages) {
                      },
                    }
                  });
              // }
              // Modernizr.load({
              //     test: Modernizr.csstransforms,
              //     yep: './src/utils/turn.js',
              //     complete: loadApp
              // });
            });
          })
        })
      },
      // 渲染page
      renderPage(pageNo,type) {
        console.log(pageNo,'nononono')
        if(!type){
            this.currentPage = pageNo
        }
        let that = this
        this.doc.getPage(pageNo).then(page => {
          let container = this.$refs.container[pageNo - 1]
          if (!container) return
          let canvas = container.querySelector('canvas')
          if (!canvas || canvas.__rendered) return
          let ctx = canvas.getContext('2d')
          let dpr = 0.8
          let bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
          let ratio = dpr / bsr
          let rect = container.getBoundingClientRect()
          let viewport = page.getViewport(that.scale)
          let width = rect.width
          let height = width / viewport.width * viewport.height
          // canvas.style.width = `${width}px`
          // canvas.style.height = `${height}px`
          canvas.style.width = `535px`
          canvas.style.height = that.appHeight
          this.pageHeight = height
          canvas.height = height * ratio
          canvas.width = width * ratio
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          page.render({
            canvasContext: ctx,
            viewport: page.getViewport(width / viewport.width)
          })
          canvas.__rendered = true
        })
      },
      onPrevPage(){
        var pageCount = $(".flipbook").turn("pages");//总页数
        var currentPage = $(".flipbook").turn("page");//当前页
        if (currentPage >= 2) {
            $(".flipbook").turn('page', currentPage - 1);
            $(".flipbook").turn('page', currentPage - 2);
        }
      },
      onNextPage(){
        var pageCount = $(".flipbook").turn("pages");//总页数
        var currentPage = $(".flipbook").turn("page");//当前页
        if (currentPage <= pageCount) {
            $(".flipbook").turn('page', currentPage + 1);
            $(".flipbook").turn('page', currentPage + 2);
        }
      },




      //查看教材库
      goBook() {
        this.$router.push({
          path: '/text-book',
          query: {
            channelId: this.channelId
          }
        })
      },
      //加入书架
      setUserCollect(type) {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/add/userCollected',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            type: type,
            resourcesId: this.detailInfo.resourcesId
          },
        }, function(res) {
          that.$message({
            message: type == 1 ? '加入成功' : '移除成功',
            type: 'success',
          });
          if (type == 1) {
            that.detailInfo.isCollected = 1
          } else {
            that.detailInfo.isCollected = 0
          }
          that.$forceUpdate()
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
          // that.detaiLoading = false
          that.detailInfo = res.fileDetail
          that.detailInfo.tagNameArr = that.detailInfo.tagsName && that.detailInfo.tagsName.split(',')
          let tags = that.detailInfo.tags && that.detailInfo.tags.split(',')
          that.paramTags = that.detailInfo.tagNameArr && tags.slice(1, that.detailInfo.tagNameArr.length + 2)
          that.$nextTick(() => {
            that.getPDFFile(that.detailInfo.resourcesAddress)
          })
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




    }

    // components: {atricleContent, rightSidebar }
  }
</script>

<style lang="scss" scoped>
  .less-container {
    width: 1170px;
    margin: 0 auto;
  }
  .fullscreen{
    .content-resource{
      height: 100% !important;
      justify-content: center;
    }
  }
  .icon__group{
    width: 100%;
    text-align: right;
    background: #FFFFFF;
    padding-top: 15px;
    padding-right: 15px;
    i{
      font-size: 30px;
      color: #999999;
      margin-left: 6px;
    }
  }
  .header-box {
    padding: 15px;
    background: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .header-left {
      line-height: 14px;
      height: 14px;
      color: #333333;
      cursor: pointer;
    }

    .second-btn {
      color: #3C85EE;
      cursor: pointer;

      .is-sub {
        display: inline-block;
      }

      .cancel-sub {
        display: none;
      }

      &:hover {
        .is-sub {
          display: none;
        }

        .cancel-sub {
          display: inline-block;
        }
      }
    }
  }

  .content-resource {
    width: 100%;
    padding: 20px 50px;
    background: #FFFFFF;
    position: relative;
    display: flex;
    align-items: center;
    i{
      font-size: 50px;
      color: #999999;
    }
    .iconzuojiantou{
      position: absolute;
      left: 0;
    }
    .iconyoujiantou{
      position: absolute;
      right: 0;
    }
  }

</style>
