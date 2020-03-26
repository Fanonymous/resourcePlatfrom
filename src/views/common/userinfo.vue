<template>
  <div class="user-container">
    <custom-header></custom-header>
    <div class="header-box">
      <img v-real-img="imgUrl + userinfo.imageUrl" :src="defaultPic">
      <!-- <img src="~@/assetsavatar.jpgr.png"> -->
      <span style="color: #FFFFFF;cursor: pointer;">{{userinfo && userinfo.fullName ? userinfo.fullName : 'qiaolulu'}}</span>

    </div>
    <div class="content">
      <div class="left-wrapper">
        <div class="left-tab">
          <div class="tab-item" :class="isTabActive == 1 ? 'is-active' : ''" @click="activeClick1()">我的订阅</div>
          <div class="tab-item" :class="isTabActive == 2 ? 'is-active' : ''" @click="activeClick2()">收藏夹</div>
          <div class="tab-item" :class="isTabActive == 3 ? 'is-active' : ''" @click="activeClick3()">最近看过</div>
        </div>
        <!-- 热门榜 -->
        <!-- <div ref="fixedDiv"> -->
          <div class="right-hot--club">
              <div class="hot--title">
                  <img src="~@/assets/img/hot.png">
                  <span>热门榜</span>
              </div>
              <div class="hot-content">
                  <div class="hot-item" v-for="(i, j) in hotList" @click="goDetail(i)">
                      <template v-if="i.thumbAddress">
                        <div class="hot-item--left">
                            <img v-real-img="i.thumbAddress" :src="defaultPic" class="hot-img--inner">
                            <img :src="require(`@/assets/img/${j}.png`)" class="serial--number">
                        </div>
                        <div class="hot-item--right">
                            <span>{{i.title}}</span><br>
                            <span>{{i.tagsName}}</span>
                        </div>
                      </template>
                      <template v-else>
                        <img style="height: 21px;margin-right: 10px;" :src="require(`@/assets/img/${j}.png`)">
                        <div class="hot-item--right">
                            <span>{{i.title}}</span><br>
                            <span>{{i.tagsName}}</span>
                        </div>
                      </template>
                  </div>

              </div>
          </div>

          <!-- 每日优选 -->
          <div class="right-day--push" v-if="dayPushList && dayPushList.length == 5">
              <div class="right-day--title">
                  <div style="display: flex; align-items: center;">
                      <img src="~@/assets/img/wellchoise.png">
                      <span style="padding-left: 5px;">每日优选</span>
                  </div>
                  <div style="color: #8590A6">
                      <!-- <span :style="{cursor:(page<totalPage?'pointer':'not-allowed')}" @click="changeOptimization">换一换</span> -->
                      <span style="cursor: pointer;" @click="changeOptimization">换一换</span>
                  </div>
              </div>
              <div class="day-push--content">
                  <div class="day-push-item" v-for="(m, n) in dayPushList" @click="goDetail(m)">
                      <div class="day-push--left" v-if="m.thumbAddress">
                          <img v-real-img="m.thumbAddress" :src="noThumbPic" class="day-push--inner">
                      </div>
                      <div class="day-push--right">
                          <span>{{m.title}}</span>
                      </div>
                  </div>
              </div>
          </div>
        <!-- </div> -->

      </div>
        <div class="feed--box">
          <div v-if="isTabActive == 1">
            <div class="header-body">我的订阅 <span>{{!!subscribeList&&subscribeList.length ? subscribeList.length : 0}}</span></div>
                  <el-row :gutter="20" v-if="subscribeList.length > 0 && !firstStep&& !secondStep">
                      <el-col :span="8" v-for="(item,index) in subscribeList">
                        <div class="sub-item">
                          <!-- <img class="sub-left" src="~@/assets/img/avatar.jpg"> -->
                          <div class="sub-right">
                            <div class="right-title">{{item.tagName}}</div>
                            <div class="right-item">
                              <span>资源:{{item.resourcesNum ? item.resourcesNum : '0'}}条</span>
                              <span>
                                <el-button class="is__hover" plain size="mini" @click="cancelSubscribe(item.tagId)"><div class="is-sub">已订阅</div><div class="cancel-sub">取消订阅</div></el-button>
                              </span>
                            </div>
                            <!-- <div class="right-item" style="margin-top: 8px;">
                              <span>订阅量:{{item.subscribeNum ? item.subscribeNum : '0'}}</span>
                            </div> -->
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="el-center sub-item" style="height: 72px;cursor: pointer;"  @click="firstStep=true;getTagList(1)">
                          +&nbsp;订阅更多
                        </div>
                      </el-col>
                  </el-row>

                  <div class="sub-wrapper_box" style="overflow-y:auto;margin-top: 20px;" v-if="!!subscribeList && subscribeList.length == 0 ||firstStep|| secondStep">
                        <div class="el-center el-column" style="height:500px" v-if="!firstStep && !secondStep">
                          <div class="marg-20">暂无订阅资源</div>
                          <el-button type="primary" size="mini" @click="" plain @click="firstStep=true;getTagList(1)">添加订阅</el-button>
                        </div>
                        <div class="sub-content" v-if="firstStep || secondStep">
                          <div class="content-title marg-20" style="margin-bottom: 20px;" v-if="firstStep">请选择学段：</div>
                          <div class="content-title marg-20" style="margin-bottom: 20px;" v-if="secondStep">请选择订阅内容：</div>
                          <div v-show="firstStep">
                            <el-radio-group v-model="firstTagId" size="small" @change="handleRadio" style="width: 100%;">
                              <el-row :gutter="20" class="marg-20">
                                <el-col style="margin-bottom: 10px;" :span="4" v-for="(item,index) in tagList">
                                  <el-radio :key="index" :label="item.tagId" border>{{item.tagName}}</el-radio>
                                  </el-col>
                                 </el-row>

                            </el-radio-group>
                            <div class="el-between" style="margin-top:150px;">
                              <div>
                              </div>
                              <el-button type="primary" :disabled="!firstTagId" plain @click="handleNext()">下一步</el-button>
                            </div>
                          </div>
                          <div v-show="secondStep">
                            <template v-for="(item,index) in secondTagList">
                              <div class="font-grey marg-20">{{item.tagTypeName}}</div>
                              <el-row :gutter="20" class="marg-20">
                                <el-col style="margin-bottom: 10px;" :span="6" v-for="(sItem,sIndex) in item.childTagList">
                                  <template v-if="sItem.tagType < 5">
                                    <el-popover :ref="'popover'+sItem.tagId" placement="bottom-start" trigger="click" width="550" @hide="handleHidePop(sItem)">
                                      <div class="pop-box">
                                        <div class="marg-20">
                                          <template>
                                            <div class="font-grey marg-20">版本</div>
                                            <el-row :gutter="20">
                                              <el-col style="margin-bottom: 10px;" :span="6" v-for="(peItem,peIndex) in sItem.childTagList">
                                                <el-button style="position: relative;" :type="peItem.isSubscribe==1 ? 'primary': ''" @click="handleCheck1(peItem)" :title="peItem.tagName.length > 5 ? peItem.tagName : ''">{{peItem.tagName && peItem.tagName.length > 5 ? peItem.tagName.substr(0,5)+'...' : peItem.tagName}}<sup
                                    v-if="peItem.checkedCount > 0" class="el-badge__cust">{{peItem.checkedCount}}</sup></el-button>
                                              </el-col>
                                            </el-row>
                                          </template>
                                          <template v-if="secondPopList.childTagList">
                                            <div class="font-grey marg-20">教材</div>
                                            <el-row :gutter="20">
                                              <el-col style="margin-bottom: 10px;" :span="8" v-for="(secItem,secIndex) in secondPopList.childTagList">
                                                <el-button :type="secItem.isSubscribe==1 ? 'primary': ''" @click="handleCheck2(secItem,index,sIndex)">{{secItem.tagName}}</el-button>
                                              </el-col>
                                            </el-row>
                                          </template>
                                        </div>
                                        <div style="text-align: right; border-top: 1px solid #F1F1F1;padding-top: 10px;">
                                          <el-button size="mini" @click="handlePopClose(sItem)">取消</el-button>
                                          <el-button type="primary" size="mini" @click="handleAddSub(sItem.tagId)">确定</el-button>
                                        </div>
                                      </div>
                                      <el-button style="position: relative;" slot="reference" :type="sItem.isSubscribe==1 ? 'primary': ''" @click="handleCheck(2,index,sIndex,sItem)">{{sItem.tagName}}<sup
                          v-if="sItem.checkedCount > 0" class="el-badge__cust">{{sItem.checkedCount}}</sup></el-button>
                                    </el-popover>
                                  </template>
                                  <template v-else>
                                    <el-button :type="sItem.isSubscribe==1 ? 'primary': ''" @click="handleCheck(1,index,sIndex,sItem)">{{sItem.tagName}}</el-button>
                                  </template>
                                </el-col>
                              </el-row>
                            </template>
                            <div class="el-between" style="margin-top:150px;">
                              <div>
                                <el-button type="primary" plain @click="secondStep=false;firstStep=true">上一步</el-button>
                              </div>
                              <el-button type="primary" plain icon="el-icon-plus" @click="addSubscribe1()">订阅</el-button>
                            </div>
                          </div>
                        </div>

                  </div>



                <!-- </el-tab-pane> -->
              <!-- </el-tabs> -->
          </div>

            <div class="tab-views" v-if="isTabActive == 2">
              <div class="header-body">收藏夹 <span>{{!!totalPage1 ? totalPage1 : 0}}</span></div>
                <div v-for="(item, index) in collectList" class="item--inner" @click="goDetail(item)">
                    <div class="article--img" v-if="item.thumbAddress">
                        <img v-real-img="item.thumbAddress" :src="noThumbPic">
                    </div>
                    <div class="rbox--inner">
                            <div class="title--box">
                                <span class="title-content">{{!!item.title && item.title.length >65? item.title.substr(0,65)+'...':item.title}}
                                <img v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png" alt=""></span>
                                <!-- <span v-if="item.isWell == 1">优选</span> -->
                                <span></span>
                            </div>
                            <div class="c-box">
                              <span class="article--type">{{item.channelName}}</span>
                              <span class="article--tag">{{item.tags}}</span>
                            </div>
                        <div class="y-box">
                            <span style="margin-right: 10px;">
                              <!-- <span class="article--type">{{item.tags}}</span> -->
                                <span class="iconfont iconchakan"></span>
                                <span>{{item.viewCount ? item.viewCount : 0}}人看过</span>
                            </span>
                            <span>
                              <!-- <el-button type="text" size="small">分享</el-button> -->
                              <el-button type="text" size="small" v-on:click.stop="setUserCollect(2,item.resourcesId)">取消收藏</el-button>
                            </span>

                        </div>
                    </div>
                </div>
                <div v-if="!!collectList && collectList.length ==0" class="no-data">
                  <img src="~@/assets/img/no-data.png" alt="">
                  <div>暂无收藏</div>
                </div>
            </div>
            <div class="tab-views" v-if="isTabActive == 3">
              <div class="header-body">最近看过 <span>{{!!totalPage2 ? totalPage2 : 0}}</span></div>
                <div v-for="(item, index) in viewList" class="item--inner" @click="goDetail(item)">
                    <div class="article--img" v-if="item.thumbAddress">
                        <img v-real-img="item.thumbAddress" :src="noThumbPic">
                    </div>
                    <div class="rbox--inner">
                            <div class="title--box">
                                <span class="title-content">{{!!item.title && item.title.length >65? item.title.substr(0,65)+'...':item.title}}<img v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png" alt=""></span>
                                <!-- <span v-if="item.isPreferred == 1">优选</span> -->
                                <span></span>
                            </div>
                            <div class="c-box">
                              <span class="article--type">{{item.channelName}}</span>
                              <span class="article--tag">{{item.tags}}</span>
                            </div>
                        <div class="y-box">
                            <span style="margin-right: 10px;">
                              <!-- <span class="article--type">{{item.tags}}</span> -->
                                <span class="iconfont iconchakan"></span>
                                <span>{{item.viewCount ? item.viewCount : 0}}人看过</span>
                            </span>
                            <span>
                              <!-- <el-button type="text" size="small">分享</el-button> -->
                              <el-button type="text" size="small" v-on:click.stop="deleteMyRead(item.resourcesId)">删除记录</el-button>
                            </span>

                        </div>
                    </div>
                </div>
                <div v-if="!!viewList && viewList.length ==0" class="no-data">
                  <img src="~@/assets/img/no-data.png" alt="">
                  <div>暂无数据</div>
                </div>
            </div>
        </div>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import defaultPic from '@/assets/img/avatar.jpg'
import noThumbPic from '@/assets/img/no-thumb.png'

import customHeader from '../components/header.vue'
import { getCommHttpData } from '@/utils/common'
export default {
    data () {
        return {
          rsUserId: this.GLOBAL.getRsUserId(),
          userinfo:this.GLOBAL.getUserinfo(),
          imgUrl: window.SITE_CONFIG.imgIP,
          defaultPic: defaultPic,
          noThumbPic:noThumbPic,
          activeName:'first',
          isTabActive:1,
          subscribeText:'已订阅',
          collectList:[],
          subscribeList:[],
          viewList:[],
          hotList: [],
          dayPushList: [],
          page:1,
          totalPage:'',

          tagList: [],
          firstTagId: '',
          secondTagList: [],
          subscribeList: [],
          secondPopList: [],
          firstStep: false,
          secondStep: false,
          tagIndex1:'',
          tagIndex2:'',
          addTagList:[],
          dialogTagList:[],
          checkSubscribeList:[],
          page1:1,
          totalPage1:'',
          page2:1,
          totalPage2:'',
          isrequire:true,
          loading: false,
          // scrollTop:'',

        }
    },
    components:{customHeader},
    watch:{
      $route: {
        handler: function(val, oldVal){
          console.log(val,'valval')
              this.page = 1
              this.page1 = 1
              this.page2 = 1
              this.isrequire = true
              this.loading = false
              let type =val.query.type
               if(type ==2){
                this.isTabActive = 2
                this.getMyCollected()
              }else if(type ==3){
                this.isTabActive = 3
                this.getMyViewList()
              }else{
                this.isTabActive = 1
                this.getMySubscribe()
              }
            },
            // 深度观察监听
            deep: true
      },
      secondPopList(newVal,oldVal){
        if(oldVal && oldVal.childTagList){
          let isSub = true,templist=oldVal.childTagList
          templist.forEach(val=>{
            if(isSub && val.isSubscribe==1){
              isSub = false
            }
          })
          if(isSub){
            oldVal.isSubscribe = 0
          }
        }
      },
      // scrollTop(newVal,oldVal){
      //   console.log(newVal,'newValnewVal')
      //   console.log(this.$refs.fixedDiv.getBoundingClientRect().top+newVal,'newValnewVal')
      //     if (newVal) {

      //       let currenTop = this.$refs.fixedDiv.getBoundingClientRect().top+newVal
      //       if(newVal >currenTop){
      //         this.$refs.fixedDiv.style="position:fixed;top:60px;width:284px"
      //       }else{
      //         this.$refs.fixedDiv.style=""
      //       }
      //     }
      // }
    },
    mounted() {
      let type =this.$route.query.type
       if(type ==2){
        this.isTabActive = 2
        this.getMyCollected()
      }else if(type ==3){
        this.isTabActive = 3
        this.getMyViewList()
      }else{
        this.isTabActive = 1
        this.getMySubscribe()
      }
      this.getHotResourceList()
      this.getOptimizationResourceList()
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
      //切换
      activeClick1(){
        this.isTabActive = 1
        this.firstTagId = ''
        this.firstStep = false
        this.secondStep = false
        this.addTagList=[]
        this.dialogTagList = []
        this.checkSubscribeList = []
        this.getMySubscribe()
      },
      activeClick2(){
        this.isTabActive= 2;
        this.page1 = 1
        this.isrequire = true
        this.loading= false
        this.collectList = []
        this.getMyCollected()
      },
      activeClick3(){
        this.isTabActive = 3;
        this.page2 = 1
        this.isrequire = true
        this.loading= false
        this.viewList = []
        this.getMyViewList()
      },
      //加载
      scrollBottom() {
                var h = window.pageYOffset || document.body.scrollTop || document.body.scrollHeight;
                // this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        // 滚动到页面底部时，请求前一天的文章内容
        if (((window.screen.height + h) > (document.body.clientHeight)) && this.isrequire ) {
          // 请求的数据未加载完成时，滚动到底部不再请求前一天的数据
          this.isrequire = false;
          this.loading = true;
          if(this.isTabActive == 2){
            if(this.totalPage1 > this.collectList.length){
              let page1 = this.page1
              this.page1 = page1+1
              this.getMyCollected()
            }

          }else if(this.isTabActive == 3){
             if(this.totalPage2 > this.viewList.length){
               let page2 = this.page2
               this.page2 = page2+1
               this.getMyViewList()
             }

          }
        }
      },
      //科目取消选中
      handleHidePop(item){
        let isSub = true,templist=item.childTagList
        templist.forEach(val=>{
          if(isSub && val.isSubscribe==1){
            isSub = false
          }
        })
        if(isSub){
          item.isSubscribe = 0
        }
        this.secondPopList=[];
        this.dialogTagList=[]
      },
      //下一步
      handleNext(){
        this.secondStep=true;
        this.firstStep=false
      },
      //选中
      handleCheck(type, index, sIndex, item) {
        if (type == 1) {
          if(item.isSubscribe == 0){
            this.addTagList.push(item.tagId)
          }else{
            let tmpIndex = this.addTagList.indexOf(item.tagId)
            this.addTagList.splice(tmpIndex, 1)
            let tmpIndex2 = this.checkSubscribeList.indexOf(item.tagId)
            this.checkSubscribeList.splice(tmpIndex2, 1)
          }
          this.secondTagList[index].childTagList[sIndex].isSubscribe = item.isSubscribe == 0 ? 1 : 0
        } else {
          if (item.isSubscribe == 0) {
            this.secondTagList[index].childTagList[sIndex].isSubscribe = 1
            if(!item.childTagList){
              let that = this
              getCommHttpData({
                url: '/iConductor-knowledge-platform/subscribe/tagList',
                method: 'post',
                contentType: 2,
                data: {
                  rsUserId: this.rsUserId,
                  parentId:item.tagId,
                  dataType:2
                },
              }, function(res) {
                    item.childTagList = res.list
              })
            }else{
              item.childTagList = res.list
            }
          }else{
            if(!item.childTagList){
              let that = this
              getCommHttpData({
                url: '/iConductor-knowledge-platform/subscribe/tagList',
                method: 'post',
                contentType: 2,
                data: {
                  rsUserId: this.rsUserId,
                  parentId:item.tagId,
                  dataType:2
                },
              }, function(res) {
                    item.childTagList = res.list
              })
            }else{
              item.childTagList = res.list
            }
          }
        }
        this.$forceUpdate()
      },
      //dailog选中
      handleCheck1(item){
        console.log(item,'dueueuueueu')
        this.secondPopList=[];
        if (item.isSubscribe == 0) {
          item.isSubscribe = 1
          if(!item.childTagList){
            let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/subscribe/tagList',
              method: 'post',
              contentType: 2,
              data: {
                rsUserId: this.rsUserId,
                parentId:item.tagId,
                dataType:3
              },
            }, function(res) {
                  item.childTagList = res.list
                  that.secondPopList = item
            })
          }else{
            this.secondPopList = item
          }
        }else{
          if(!item.childTagList){
            let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/subscribe/tagList',
              method: 'post',
              contentType: 2,
              data: {
                rsUserId: this.rsUserId,
                parentId:item.tagId,
                dataType:3
              },
            }, function(res) {
                  item.childTagList = res.list
                  that.secondPopList = item
            })
          }else{
            this.secondPopList = item
          }
        }
        this.$forceUpdate()
      },
      //dailog子集
      handleCheck2(item,index,sIndex) {
        if (item.isSubscribe == 0) {
          this.dialogTagList.push(item.tagId)
          item.isSubscribe = 1
          this.secondPopList.checkedCount++
          this.secondTagList[index].childTagList[sIndex].checkedCount++
        } else {
          let tmpIndex = this.dialogTagList.indexOf(item.tagId)
          let tmpIndex1 = this.addTagList.indexOf(item.tagId)
          let tmpIndex2 = this.checkSubscribeList.indexOf(item.tagId)
          this.checkSubscribeList.splice(tmpIndex2, 1)
          this.dialogTagList.splice(tmpIndex, 1)
          this.addTagList.splice(tmpIndex1, 1)
          item.isSubscribe = 0
          this.secondPopList.checkedCount--
          this.secondTagList[index].childTagList[sIndex].checkedCount--
        }
        this.$forceUpdate()
      },
      //关闭pop
      handlePopClose(item) {
        this.dialogTagList = []
        let pop = 'popover' + item.tagId
        item.childTagList = null
        item.checkedCount = 0
        item.isSubscribe = 0
        this.secondPopList = [];
        this.dialogTagList = []
        this.$refs[pop][0].doClose()
      },
      handleAddSub(id){
        if(this.dialogTagList.length > 0){
            this.addTagList = this.addTagList.concat(this.dialogTagList)
            let pop = 'popover' + id
            this.$refs[pop][0].doClose()
            this.dialogTagList = []
        }
      },
      //获取标签
      getTagList(type,parentId) {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/tagList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            level: type,
            parentId:parentId,
            dataType:1
          },
        }, function(res) {
          if(type ==1){
              that.tagList = res.list
          }else{
              // that.secondTagList=res.list
              let map = {},
                  dest = [];
                  res.list.forEach(item=>{
                    if(!map[item.tagTypeName]){
                        dest.push({
                            tagId: item.tagId,
                            tagTypeName: item.tagTypeName,
                            childTagList: [item]
                        });
                        map[item.tagTypeName] = item;
                    }else{
                      dest.forEach(item1=>{
                        if(item1.tagTypeName == item.tagTypeName){
                            item1.childTagList.push(item);
                            return
                        }
                      })
                    }
                  })
                  that.secondTagList = dest
                  map={}
                  dest = []
          }

        })
      },
      //添加订阅
      addSubscribe1() {
        let that = this
        let tagIds
        if(this.checkSubscribeList.length > 0){
            tagIds = this.addTagList.concat(this.checkSubscribeList)
        }else{
          tagIds = this.addTagList
        }
        if(tagIds.length == 0){
          this.$message({
            message: '请选择订阅内容',
            type: 'warning'
          })
          return false
        }
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/addSubscribe',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            tagList: tagIds,
            firstTagId:this.firstTagId
          },
        }, function(res) {
          that.$message({
            message: '订阅成功，您可在 [我的订阅] 中查看订阅内容',
            type: 'success',
          });
          that.firstStep = false
          that.secondStep = false
          that.secondTagList = []
          that.tagList=[]
          that.firstTagId=''
          that.getMySubscribe()
        })

      },
      handleRadio(val) {
        this.getTagList(2,val)

      },

        //获取收藏列表
        getMyCollected(){
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/myCollected',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              limit:10,
              page:this.page1
            },
          }, function(res) {
            let tmpList = [...that.collectList]

            that.collectList = tmpList.concat(res.page.list)
            that.totalPage1 = res.page.totalCount
            that.isrequire = true;
            that.loading = false;
          })
        },
        //获取我的订阅
        getMySubscribe(){
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/subscribe/mySubscribe',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId
            },
          }, function(res) {
            that.subscribeList = res.list
          })
        },
        //最近看过列表
        getMyViewList(){
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/myViewList',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              limit:10,
              page:this.page2
            },
          }, function(res) {
            let tmpList = [...that.viewList]

            that.viewList = tmpList.concat(res.page.list)
            that.totalPage2 = res.page.totalCount
            that.isrequire = true;
            that.loading = false;
          })
        },
        //取消收藏
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
            that.page1 = 1
            that.collectList = []
            that.getMyCollected()
          })

        },
        //取消订阅
        cancelSubscribe(tagId) {
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/subscribe/cancelSubscribe',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              tagId: tagId
            },
          }, function(res) {
            that.$message({
              message: '取消成功',
              type: 'success',
            });
            that.getMySubscribe()
          })

        },
        //添加订阅
        addSubscribe(tagId) {
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/subscribe/addSubscribe',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              tagId: [tagId]
            },
          }, function(res) {
            that.$message({
              message: '订阅成功，您可在 [我的订阅] 中查看订阅内容',
              type: 'success',
            });
            that.getMySubscribe()
          })

        },
        //删除浏览记录
        deleteMyRead(resourcesId) {
          let that = this
          getCommHttpData({
            url: '/iConductor-knowledge-platform/delete/myRead',
            method: 'post',
            contentType: 2,
            data: {
              rsUserId: this.rsUserId,
              resourcesId: resourcesId
            },
          }, function(res) {
            that.page2 = 1
            that.viewList = []
            that.getMyViewList()
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
            }
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
              offset:this.page,
              order:'',
              sidx:''
            },
          }, function(res) {
            that.dayPushList = res.list
            // that.totalPage = res.page.totalPage
          })
        },
        //每日优选换一换
        changeOptimization(){
          // let page = this.page
          // if(page < this.totalPage){
          //     this.page = page+1
              this.getOptimizationResourceList()
          // }
        }

    }
}
</script>

<style lang="scss" scoped>
  .border-left{
    border-left: 6px solid #3C85EE;
    padding: 5px;

    border-bottom: 1px solid #CCCCCC;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .el-badge__cust {
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-flex;
    position: absolute;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    justify-content: center;
    align-items: center;
  }
  .no-data{
    text-align: center;
    margin-top: 100px;
    img{
        width: 180px;
        margin-bottom: 15px;
    }
  }
  .sub-wrapper_box {
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    background: #FFFFFF;
    position: relative;

    .sub-content {
      padding: 100px 50px;
    }
  }
.user-container{
  width: 1170px;
      margin: 0px auto;
      margin-top: 85px;
      margin-bottom: 100px;
      .header-box{
        width: 100%;
        height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-image: url(~@/assets/img/user-bg.png);
        background-size: cover;
        font-size: 16px;
        font-weight: bold;
        img{
            width: 128px;
            height: 128px;
            margin-bottom: 15px;
            border-radius: 50%;
            border: 5px solid #FFFFFF;
        }
      }
}
.content{
  display: flex;
    .left-wrapper{
        width: 284px;
        background-color: #F1F4F5;
        .left-tab{
          margin-top: 15px;
          background: #FFFFFF;
          border-top: 1px solid #e4e7ed;
          .tab-item{
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #e4e7ed;
            border-top: none;
            color:#303133;
            cursor: pointer;
          }
          .is-active{
            color: #3C85EE;
          }
        }
        .right-hot--club{
            // min-height: 400px;
            margin-top: 15px;
            background-color: #fff;
            border:1px solid rgba(241,241,241,1);
            box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
            .hot--title{
                padding: 10px 20px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #F1F1F1;
                span:last-child{
                    padding-left: 5px;
                }
            }
            .hot-content{
                padding: 15px 20px;
                .hot-item{
                    display: flex;
                    padding: 10px 0;
                    cursor: pointer;
                    border-bottom: 1px solid #F1F1F1;
                    &:first-child{
                      padding-top: 0;
                    }
                    .hot-item--left{
                        position: relative;
                        margin-right: 8px;
                        .hot-img--inner{
                            width: 100px;
                            height: 56px;
                            border-radius: 4px;
                        }
                        .serial--number{
                            position: absolute;
                            top: 0;
                            left: 2px;
                        }
                    }
                    .hot-item--right{
                        max-height: 52px;
                        line-height: 1.8;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        /* autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 2;
                    }
                }
            }
        }
        .right-day--push{
            // min-height: 312px;
            margin-top: 12px;
            background-color: #fff;
            border:1px solid rgba(241,241,241,1);
            box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
            .right-day--title{
                padding: 10px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #F1F1F1;
            }
            .day-push--content{
                padding: 15px 20px;
                .day-push-item{
                    display: flex;
                    padding: 5px 0;
                    cursor: pointer;
                    border-bottom: 1px solid #F1F1F1;
                    padding-bottom: 10px;
                    padding-top: 10px;
                    &:first-child{
                      padding-top: 0;
                    }
                    .day-push--left{
                        position: relative;
                        margin-right: 8px;
                        .day-push--inner{
                            width: 100px;
                            height: 56px;
                            border-radius: 4px;
                        }
                    }
                    .day-push--right{
                        max-height: 52px;
                        line-height: 1.8;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        /* autoprefixer: off */
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on */
                        -webkit-line-clamp: 2;
                    }
                }
            }
        }
    }
    .feed--box{
      width: 870px;
      background-color: #fff;
      border:1px solid rgba(241,241,241,1);
      box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      margin-top: 15px;
      margin-left: 20px;
      padding: 15px;
      .header-body{
            padding: 5px 0 5px;
            // border-left: 6px solid #3C85EE;
            border-bottom: 1px solid #CCCCCC;
            font-weight: bold;
            span{
              font-weight: 500;
              margin-left: 10px;
            }
      }
      // .curstum-tab{
      //   margin-left: 10px;
        // margin-top: 5px;
        .sub-item{
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          // margin-bottom: 20px;
          margin-top: 20px;
          .sub-left{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 15px;
          }
          .sub-right{
            flex: 1;
            .right-title{
              color: #333;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .right-item{
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #8590A6;
              font-size: 12px;
              /deep/ .el-button{
                padding: 5px 8px;

              }
              /deep/ .is__hover{
                .is-sub{
                  display: inline-block;
                }
                .cancel-sub{
                  display: none;
                }
                &:hover{
                  .is-sub{
                    display: none;
                  }
                  .cancel-sub{
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      // }
      // margin-left: 284px;
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
              justify-content: space-around;
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
                margin-top: 7px;
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
                     // color: #8590A6;
                     font-size: 14px;
                     padding: 0;
                  }
                  /deep/ .el-button .iconfont{
                      padding-right: 3px;
                  }
              }
          }
      }
    }


}

</style>
