<template>
  <div style="background: #F1F4F5;padding-top: 70px;">
    <MainNavbar></MainNavbar>
    <div class="less-container">
      <!-- <el-card> -->
      <div class="header-box">
        <el-menu style="width: 70%;" :default-active="channelId" class="el-menu-demo" mode="horizontal">
          <el-menu-item v-for="(item, index) in secondMenu" :key="index" :index="item.channelId" @click="handleChannel(item)">
            {{item.channelName}}
          </el-menu-item>
        </el-menu>
        <el-input placeholder="内容搜一搜" v-model="keywords" size="mini" style="width:22%;margin-top: 15px;" @keyup.enter.native="getSearch()">
            <el-button size="mini" slot="append" icon="el-icon-search" @click="getSearch()">搜一搜</el-button>
        </el-input>
      </div>
      <el-form :inline="true" @keyup.enter.native="" style="margin-top: 15px;">
        <el-form-item>
          <el-select placeholder="请选择学段" v-model="tagId1" @change="handleSelect">
            <el-option v-for="item in tagList1" :key="item.tagId" :label="item.tagName" :value="item.tagId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择科目" v-model="tagId2" @change="handleSelect1">
            <el-option v-for="(item,index) in tagList2" :key="item.tagId" :label="item.tagName" :value="item.tagId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择版本" v-model="tagId3" @change="handleSelect2">
            <el-option v-for="(item,index) in tagList3" :key="item.tagId" :label="item.tagName" :value="item.tagId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择教材" v-model="tagId4" @change="handleSelect3">
            <el-option v-for="(item,index) in tagList4" :key="item.tagId" :label="item.tagName" :value="item.tagId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="wrapper">

        <!-- 左边树 -->
        <div class="left-side-tree" :style="'height: '+appHeight+'px;'">
          <el-tree :data="treeListData" accordion ref="tree" node-key="tagId" :props="{label : 'tagName'}" highlight-current
            :expand-on-click-node=false :default-expanded-keys="showNode" @node-click="handTreeNodeClick" class="resource-tree-margin" :style="'height: '+(appHeight-30)+'px;'">
            <span style="padding:10px 0;" slot-scope="{ node, data }">
              <i :class="node.level == 1 ? 'el-icon-folder' : 'el-icon-files'" style="padding-right: 5px;color:#3C85EE;"></i>
              <span :title="data.tagName">{{data.tagName && data.tagName.length > 9 ? data.tagName.substr(0,9)+'...' : data.tagName}}</span>
            </span>)
          </el-tree>
        </div>
        <div class="content-resource">
          <!-- 查询 -->
          <div class="search-button">
            <div class="search-button-left">
              <el-button :type="isFilter ? 'primary' : ''" size="mini" @click="filterList(1)">最新<i class="el-icon-d-caret el-icon--right"></i></el-button>
              <el-button :type="isFilter1 ? 'primary' : ''" size="mini" @click="filterList(2)">浏览<i class="el-icon-d-caret el-icon--right"></i></el-button>
              <el-button :type="isFilter2 ? 'primary' : ''" size="mini" @click="filterList(3)">下载量<i class="el-icon-d-caret el-icon--right"></i></el-button>
              <el-select style="margin-left: 10px;" size="mini" placeholder="文档类型" @change="getRecourseData()" v-model="resourcesType" clearable>
                <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-checkbox style="margin-left: 10px;" v-model="isPreferred" @change="getRecourseData()">优选</el-checkbox>
            </div>
            <div class="search-button-right">共{{totalPage}}条资源
              <el-button class="is__hover" type="text" v-if="!!currentTag && currentTag.isSubscribe == 1" @click="cancelSubscribe(currentTag.tagId)">
                <div class="is-sub">已订阅</div><div class="cancel-sub">取消订阅</div>
              </el-button>
              <el-button style="margin-left: 10px;" v-else type="text" icon="el-icon-plus" @click="addScribe(currentTag.tagId)">订阅</el-button>
            </div>
          </div>
          <!-- 资源列表 -->
          <div class="resource-list height-dep" :class="{'no-data-background' : resourceListData.length==0}" v-loading="loading">
            <template v-if="resourceListData.length > 0">
            <template v-if="activeName == '微课' || activeName =='精品课程'">
                <el-row :gutter="12" v-for="rIndex of Math.ceil(resourceListData.length/4)" :key="rIndex">
                  <el-col :span="6" v-for="(item, index) in resourceListData" v-if="index < 4 && resourceListData[(rIndex-1)*4+index]" style="margin-bottom:20px;">
                    <el-card class="card-wrapper" :body-style="{ padding: '0px' }">
                      <div @click="goDetail(resourceListData[(rIndex-1)*4+index])">
                       <div class="mess-box" v-if="resourceListData[(rIndex-1)*4+index].resourcesType">
                          {{resourceListData[(rIndex-1)*4+index].resourcesType}}
                        </div>
                        <img v-real-img="resourceListData[(rIndex-1)*4+index].thumbAddress" :src="allPic" class="image" />
                        <div class="resource-mess">
                          <div>{{resourceListData[(rIndex-1)*4+index].channelName}}| {{resourceListData[(rIndex-1)*4+index].title}}<img v-if="resourceListData[(rIndex-1)*4+index].isPreferred == 1" src="~@/assets/img/best-change.png" alt=""></div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
            </template>
              <div class="feed--box" v-else style="margin-bottom: 20px;">
                <div v-for="(item, index) in resourceListData" :key="index" class="item--inner" @click="goDetail(item)">
                 <div class="article--img" v-if="item.thumbAddress">
                    <img v-real-img="item.thumbAddress" :src="allPic">
                  </div>
                  <div class="word--img" v-else>
                    <img class="bg-img" src="~@/assets/img/bgImg.png">

                    <span>{{item.channelName}}</span>
                    <div class="cont-img">
                      <img v-if="item.resourcesType == 'FLV' || item.resourcesType == 'MP4' || item.resourcesType == 'M3U8'" src="~@/assets/img/video.png" alt="">
                      <img v-else-if="type1.includes(item.resourcesType)" class="cont-img" src="~@/assets/img/WORD.png" alt="">
                      <img v-else-if="type2.includes(item.resourcesType)" class="cont-img" src="~@/assets/img/ppt.png" alt="">
                      <img v-else-if="item.resourcesType == 'ZIP'" class="cont-img" src="~@/assets/img/zip.png" alt="">
                      <img v-else class="cont-img" src="~@/assets/img/other.png" alt="">
                    </div>

                  </div>
                  <div class="rbox--inner">
                    <div>
                      <div class="title--box">
                        <span class="title-content">{{item.title.length >65? item.title.substr(0,65)+'...':item.title}}<img v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png" alt=""></span>
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
                    </div>
                  </div>
                </div>
              </div>

              <el-pagination @current-change="handCurChange" :current-page="curPage" class="pagination-bottom"
                 :total="totalPage" :page-size="20" layout="total, prev, pager, next, jumper">
              </el-pagination>
            </template>
            <div class="no-data" style="text-align: center;padding-top: 100px;" v-if="resourceListData.length==0">
              <img src="~@/assets/img/no-data.png" class="no-data-img"  style="width: 180px;">
              <div style="margin-top: 15px;">暂无资源</div>
            </div>
          </div>
        </div>
      </div>



    </div>
  </div>

</template>

<script>
  import {
    getCommHttpData
  } from '@/utils/common'
  import allPic from '@/assets/img/no-thumb.png'
  import MainNavbar from '../components/header'
  export default {
    data() {
      return {
        type1:['DOC', 'DOCX', 'DOT', 'DOTM', 'DOCM'],
        type2:['PPTX', 'PPT', 'POT', 'POTM','PPTM'],
        tagIds:[],
        showNode:[],
        orderList:null,
        isFilter: false,
        isFilter1: false,
        isFilter2: false,
        allPic: allPic,
        imgUrl: window.SITE_CONFIG.imgIP,
        rsUserId: this.GLOBAL.getRsUserId(),
        userinfo:this.GLOBAL.getUserinfo(),
        tagId1: '',
        tagId2: '',
        tagId3: '',
        tagId4:'',
        resourcesType: '',
        isPreferred: false,
        treeListData: [],
        resourceListData: [],
        curPage: 1,
        totalPage: 0,
        loading: false,
        channelId:'',
        keywords:'',
        tagList1:[],
        tagList2:[],
        tagList3:[],
        tagList4:[],
        secondMenu: [],
        typeList:[],
        currentTag:null,
        treeTagId:'',
        appHeight:700,
        activeName:''
      }

    },
    mounted() {
      this.channelId = this.$route.query.channelId
      this.tagIds = this.$route.query.tagIds && this.$route.query.tagIds.split(',')
      this.getSecondMenu()
      this.getTagList(1)
      this.getDict()
      window.addEventListener('resize', () => {
        this.appHeight = window.innerHeight - 230
      })

      this.appHeight = window.innerHeight - 230
      // this.getRecourseData()
    },
    components:{MainNavbar},
    watch:{
      $route: {
        handler: function(val, oldVal){
              console.log(val);
              if(val){
                  this.channelId = val.query.channelId
              }
              this.getRecourseData()
              this.getTreeData(this.tagId4)
            },
            // 深度观察监听
            deep: true
      }
    },
    methods: {
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
            that.resourceListData[index].isCollected = 1
            }else{
                that.resourceListData[index].isCollected = 0
              }
              that.$forceUpdate()
        })
      
      },
      handleChannel(item){
        // if(channelId){
          this.channelId = item.channelId
          this.activeName = item.channelName
          this.curPage = 1
          this.totalPage = 0
        // }
        this.getRecourseData()
      },
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
          that.currentTag.isSubscribe = 0
        })

      },
      //订阅
      addScribe(tagId){
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/addSubscribe',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            tagList: [tagId],
            firstTagId: this.tagId1
          },
        }, function(res) {
          that.$message({
            message: '订阅成功，您可在 [我的订阅] 中查看订阅内容',
            type: 'success',
          });
          that.currentTag.isSubscribe = 1
        })
      },
      //shuaixuan
      filterList(type){
        let order = this.orderList && this.orderList.length > 0 ? this.orderList[0].order : ''
        let temp = order == 'asc' ? 'desc': 'asc'
        this.orderList = [{order:temp,sidx:''}]
        if(type ==1){
          this.orderList[0].sidx = 'create_date'
          this.isFilter=true
          this.isFilter1= false
          this.isFilter2 =  false
        }else if(type ==2){
          this.orderList[0].sidx = 'view_count'
          this.isFilter=false
          this.isFilter1= true
          this.isFilter2 =  false
        }else if(type ==3){
          this.orderList[0].sidx = 'download_count'
          this.isFilter=false
          this.isFilter1= false
          this.isFilter2 =  true
        }
        this.getRecourseData()
      },
      //获取open的频道
      getSecondMenu(){
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/navigationNar',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            userType: this.userinfo.userType,
            isOpen:1,
            channelId:this.channelId
          },
        }, function(res) {
          let temp = [{channelName:'综合',channelId:''}]
          that.secondMenu = temp.concat(res.list)
            let tempActive = that.secondMenu.find(item=>{return item.channelId == that.channelId})
            that.activeName = tempActive.channelName

        })
      },
      //查询数据字典
      getDict(){
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/getDict',
          method: 'get',
          contentType: 1,
          data: {
            type: 'resources_type',

          },
        }, function(res) {

          that.typeList = res.list

        })
      },
      handleSelect(val) {
        this.getTagList(2,val)
      },
      handleSelect1(val){
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/tagList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            parentId:val,
            dataType:2
          },
        }, function(res) {
              that.tagList3 = res.list
              if(that.tagList3 && that.tagList3.length > 0){
                if(that.tagIds && that.tagIds.length > 2){
                  that.tagId3 = parseInt(that.tagIds[2])
                }else{
                  let tempIndex3 = null
                  that.tagList3.forEach((item,index)=>{
                    if(item.isSubscribe == 1 && tempIndex3 == null){
                        tempIndex3 = index
                    }
                  })
                    that.tagId3 = tempIndex3 ? that.tagList3[tempIndex3].tagId : that.tagList3[0].tagId
                }

                  that.handleSelect2(that.tagId3)
              }else{
                that.tagId3=''
                that.tagId4 = ''
                that.tagList4=[]
                that.currentTag = that.tagList2.find((item)=>{return item.tagId == val})
                that.getRecourseData()
              }
        })

      },
      handleSelect2(val){
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/tagList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            parentId:this.tagId3,
            dataType:3
          },
        }, function(res) {
              that.tagList4 = res.list
              if(that.tagList4 && that.tagList4.length > 0 ){
                if(that.tagIds && that.tagIds.length > 3){
                  that.tagId4 = parseInt(that.tagIds[3])
                }else{
                  let tempIndex4 = null
                  that.tagList4.forEach((item,index)=>{
                    if(item.isSubscribe == 1 && tempIndex4 == null){
                        tempIndex4 = index
                    }
                  })
                  that.tagId4 = tempIndex4 ? that.tagList4[tempIndex4].tagId : that.tagList4[0].tagId
                }

                that.handleSelect3(that.tagId4)
              }else{
                that.tagId4 = ''
                that.currentTag = that.tagList3.find((item)=>{return item.tagId == val})
                that.getRecourseData()
              }
        })

      },
      handleSelect3(val){
        if(this.tagList4 && this.tagList4.length > 0){
            this.currentTag = this.tagList4.find((item)=>{return item.tagId == val})
            this.getTreeData(val)
            this.getRecourseData()
        }
      },
      //tagList
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
              that.tagList1 = res.list
              if(that.tagList1 && that.tagList1.length > 0){
                if(that.tagIds && that.tagIds.length > 0){
                  that.tagId1 = parseInt(that.tagIds[0])
                }else{
                  let tempIndex1 = null
                  that.tagList1.forEach((item,index)=>{
                    if(item.isSubscribe == 1 && tempIndex1 == null){
                        tempIndex1 = index
                    }
                  })
                  that.tagId1 = tempIndex1 ? that.tagList1[tempIndex1].tagId : that.tagList1[0].tagId
                }
                that.getTagList(2,that.tagId1)
              }

          }else{
            if(res.list){
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
              that.tagList2=dest[0].tagTypeName =='科目' ? dest[0].childTagList : []
              map={}
              dest = []
              if(that.tagList2 && that.tagList2.length > 0 ){
                if(that.tagIds && that.tagIds.length > 1){
                  that.tagId2 = parseInt(that.tagIds[1])
                }else{
                  let tempIndex2 = null
                  that.tagList2.forEach((item,index)=>{
                    if(item.isSubscribe == 1 && tempIndex2 == null){
                        tempIndex2 = index
                    }
                  })
                  that.tagId2 = tempIndex2 ? that.tagList2[tempIndex2].tagId : that.tagList2[0].tagId
                }

                that.handleSelect1(that.tagId2)
              }else{
                that.tagId2 = ''
                that.tagId3 = ''
                that.tagId4 = ''
                that.tagList2=[]
                that.tagList3=[]
                that.tagList4=[]
                that.getRecourseData()
                that.currentTag = null
              }
            }

          }

        })
      },
      getTreeData(tagId) {
        let self = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/tagListTree',
          method: 'get',
          contentType: 1,
          data:{
            keywords:this.keywords,
            channelId:this.channelId,
            tagId:tagId
          }
        }, res => {
          if (res.code === 0) {
            self.treeListData = res.list
            self.showNode.push(res.list[0].tagId)
          }
        })
      },
      //搜一搜
      getSearch(){
        // this.getTreeData()
        let self = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/resourcesInfo/search',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            keywords:this.keywords,
            offset:this.curPage,
            limit:20,
            sidx:'',
            order:'',
            channelId:this.channelId ? this.channelId : null
          },
        }, function(res) {

          self.totalPage = res.page.totalCount
          self.resourceListData = res.page.list

        })
      },
      //树节点点击
      handTreeNodeClick(data, node, el) {
        if(data.tagId == this.treeTagId){
          this.$nextTick(()=>{
            this.$refs.tree.setCurrentKey(null);
          })
            this.treeTagId = ''
        }else{
            this.treeTagId = data.tagId
        }
        this.getRecourseData()
      },
      getRecourseData() {
        this.loading = true
        let self = this
        let tmpList = []
        if(this.tagId1){
          tmpList.push(self.tagId1)
        }
        if(this.tagId2){
          tmpList.push(self.tagId2)
        }
        if(this.tagId3){
          tmpList.push(self.tagId3)
        }
        if(this.tagId4){
          tmpList.push(self.tagId4)
        }
        getCommHttpData({
            url : '/iConductor-knowledge-platform/resourcesInfo/resourcesList',
            method : 'post',
            contentType : 2,
            data : {
              channelId:this.channelId ? this.channelId : null,
              isPreferred:this.isPreferred ? 1 : null,
              resourcesType:this.resourcesType ? this.resourcesType : null,
              orderList:this.orderList,
              rsUserId: this.rsUserId,
              tagList:tmpList.length > 0 ? tmpList : null,
              sidx:'',
              order:'',
              offset:this.curPage,
              limit:20,
              tagId:this.treeTagId ? this.treeTagId : null
            }
        }, res => {
            if (res.code === 0) {
                self.totalPage = res.page.totalCount
                self.resourceListData = res.page.list
                self.loading = false
            }
        })

      },

      handCurChange(val) {
        this.curPage  = val
        this.getRecourseData()
      },


    }

    // components: {atricleContent, rightSidebar }
  }
</script>

<style lang="scss" scoped>
  .less-container{
    width: 1170px;
    margin: 0 auto;
  }
  .header-box{
    padding-left: 15px;padding-right: 15px;background: #FFFFFF;
    display: flex;
    justify-content: space-between;
    .el-button--mini{
      padding: 7px;
    }
    /deep/ .el-input-group__append{
        color: #fff;
        border: 0;
    }
    /deep/ .el-button{
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #3C85EE;
    }
  }
  .wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: -5px;
    // background: #FFFFFF;
    @extend .scrollbar-commn;

    div {
      box-sizing: border-box;
    }
  }

  .left-side-tree {
    padding: 15px;
    background: #FFFFFF;
    width: 250px;
  }

  .content-resource {
    flex-grow: 1;
    margin-left: 10px;
  }

  .resource-tree-margin {
    min-width: 220px;
    overflow: auto;

    /deep/ .el-tree-node__children {
      max-width: 220px;
      overflow-x: auto;
    }

    /deep/ .el-tree-node.is-current>.el-tree-node__content {
      background-color: rgba(87, 199, 242, .3) !important;
    }
  }

  .search-button {
    display: flex;
    justify-content: space-between;
    background: #FFFFFF;
    padding-left: 15px;
    padding-right: 15px;
    line-height: 40px;
  }

  .search-button-right {
    /deep/ .is__hover{
      margin-left: 10px;
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

  .card-wrapper {
    position: relative;
    cursor: pointer;
  }


  .resource-list {
    .image {
      width: 100%;
      margin-bottom: 10px;
      // margin: 0px 10% 15px;
      height: 128px;
    }

    min-height: 635px;
    position: relative;
    margin-top: 10px;
    .item--inner {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #f1f1f1;
      background: #FFFFFF;

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
      .word--img{
        margin-right: 20px;
        position: relative;
        .bg-img{
          height: 104px;
        }
        .cont-img{
          width: 100%;
          text-align: center;
          img{
            width: 35px;
          }
          position: absolute;
          top: 25px;

        }
        span{
          position: absolute;
          bottom: 8px;
          color: #FFFFFF;
          display: inline-block;
          width: 100%;
          text-align: center;
          left: 0;
        }

      }

      .rbox--inner {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

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

        .y-box {
          color: #8590A6;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;

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
  }

  .height-dep {
    min-height: 684px;
  }

  .resource-mess {
    padding-left: 15px;
    padding-bottom: 15px;
    &:hover{
      color: #3C85EE;
    }

    img {
      width: 32px;
      height: 18px;
      margin-left: 5px;
    }
  }



  .no-data-background {
    background-color: #fff;
  }

  .pagination-bottom {
    position: absolute;
    // bottom: 0px;
    right: 0;
  }


  .mess-box {
    position: absolute;
    top: 13px;
    right: 0px;
    font-size: 12px;

    background: #FEB23A;
        color: #FFFFFF;
        padding: 2px 4px;
        border-radius:4px 0px 0px 4px;
  }

  .scrollbar-commn {
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
      background-color: #bdbdbd;
    }

    ::-webkit-scrollbar-thumb:hover {
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.4);
    }

    div {
      scrollbar-face-color: #bfbfbf;
      scrollbar-highlight-color: #000;
      scrollbar-3dlight-color: #000;
      scrollbar-darkshadow-color: #000;
      scrollbar-Shadow-color: #adadad;
      scrollbar-arrow-color: rgba(0, 0, 0, 0.4);
      scrollbar-track-color: #eeeeee;
    }
  }
</style>
