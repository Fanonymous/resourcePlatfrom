<template>
  <div style="background: #F1F4F5;padding-top: 70px;">
    <MainNavbar></MainNavbar>
    <div class="less-container">
      <!-- <el-card> -->
      <div class="header-box">
        <div class="header-left">
          <b style="padding-left: 0;font-size: 16px;" @click="goMyBook()">电子课本</b>
          <span style="border-right: 1px solid #999999;" @click="goMyBook()">我的书架</span><span>课本库</span>
        </div>
        <el-input placeholder="内容搜一搜" v-model="keywords" size="mini" style="width:22%;" @keyup.enter.native="getRecourseData()()">
            <el-button size="mini" slot="append" icon="el-icon-search" @click="getRecourseData()">搜一搜</el-button>
        </el-input>
      </div>
        <div style="padding: 15px 15px 1px 15px;background: #FFFFFF;margin-top: 15px;border-bottom: 1px solid #F1F4F5;">
          <div class="cust-menu">
            <b style="padding-right: 10px;">学段:</b>
            <div>
              <template v-if="tagList1 && tagList1.length > 0">
                <span v-for="(item, index) in tagList1" @click="handleSelect1(item.tagId)" :class="tagId1 == item.tagId ? 'is-active-c':''">{{item.tagName}}</span>
              </template>
              <span class="font-grey" v-else>暂无数据</span>
            </div>
          </div>
          <div class="cust-menu">
            <b style="padding-right: 10px;">版本:</b>
            <div>
              <template v-if="tagList3 && tagList3.length > 0">
              <span @click="handleSelect2('')" :class="tagId3=='' ? 'is-active-c':''">全部</span>
                <span v-for="(item, index) in tagList3" @click="handleSelect2(item.tagIds)" :class="tagId3 && item.tagIds.indexOf(tagId3)> -1 ? 'is-active-c':''">{{item.tagName}}</span>
              </template>
              <span class="font-grey" v-else>暂无数据</span>
            </div>
          </div>
          <div class="cust-menu" v-if="tagList4.length > 0">
            <b style="padding-right: 10px;">教材:</b>
            <div>
              <template v-if="tagList4">
                <span @click="handleSelect3('')" :class="tagId4=='' ? 'is-active-c':''">全部</span>
                <span v-for="(item, index) in tagList4" @click="handleSelect3(item.tagIds)" :class="tagId4 && item.tagIds.indexOf(tagId4)> -1 ? 'is-active-c':''">{{item.tagName}}</span>
              </template>
              <span class="font-grey" v-else>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="content-resource">
          <!-- 资源列表 -->
          <div class="resource-list" :class="{'no-data-background' : resourceListData.length==0}" v-loading="loading">
            <template v-if="resourceListData.length > 0">
              <el-row :gutter="12" v-for="rIndex of Math.ceil(resourceListData.length/5)" :key="rIndex">
                  <div class="card-wrapper" v-for="(item, index) in resourceListData" :key="resourceListData[(rIndex-1)*5+index].resourcesId" v-if="index < 5 && resourceListData[(rIndex-1)*5+index]" style="margin-bottom:20px;">
                    <div>
                      <img v-real-img="resourceListData[(rIndex-1)*5+index].thumbAddress" :src="allPic" class="image" />
                      <div class="resource-mess">
                        {{formatTag(resourceListData[(rIndex-1)*5+index].tagsName)}}
                      </div>
                    </div>
                    <div class="find-button">
                        <span @click="goDetail(resourceListData[(rIndex-1)*5+index].resourcesId)">阅读</span>
                        <span class="second-btn" v-if="resourceListData[(rIndex-1)*5+index].isCollected == 1" @click="setUserCollect(2,resourceListData[(rIndex-1)*5+index].resourcesId,(rIndex-1)*5+index)">
                          <div class="is-sub"><i class="el-icon-check"></i></i>已加入书架</div>
                          <div class="cancel-sub"></i><i class="el-icon-delete"></i>移出书架</div>
                         </span>
                        <span v-else @click="setUserCollect(1,resourceListData[(rIndex-1)*5+index].resourcesId,(rIndex-1)*5+index)"><i class="el-icon-plus"></i>加入书架</span>
                    </div>
                  </div>
              </el-row>
              <el-pagination @current-change="handCurChange" :current-page="curPage" class="pagination-bottom"
                 :total="totalPage" :page-size="10" layout="total, prev, pager, next, jumper">
              </el-pagination>
            </template>
            <div v-if="resourceListData.length > 0" style="margin-top: 15px;border-top: 1px solid #F1F4F5;width: 100%;text-align: right;padding-top: 15px;">
              <el-button type="primary" @click="goMyBook()">选好了</el-button>
            </div>
            <div class="no-data" style="text-align: center;padding: 135px;" v-if="resourceListData.length==0">
              <img src="~@/assets/img/no-data.png" class="no-data-img"  style="width: 180px;">
              <div style="margin-top: 15px;">暂无课本</div>
            </div>
          </div>
        </div>



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
  export default {
    data() {
      return {
        allPic: allPic,
        imgUrl: window.SITE_CONFIG.imgIP,
        rsUserId: this.GLOBAL.getRsUserId(),
        userinfo:this.GLOBAL.getUserinfo(),
        tagId1: '',
        tagId3: '',
        tagId4:'',
        resourceListData: [],
        curPage: 1,
        totalPage: 0,
        loading: false,
        channelId:'',
        keywords:'',
        tagList1:[],
        tagList3:[],
        tagList4:[],
        tagIds:[],
      }

    },
    mounted() {
      this.channelId = this.$route.query.channelId
      this.tagIds = this.$route.query.tagIds && this.$route.query.tagIds.split(',')
      this.getTagList()
    },
    components:{MainNavbar,ComFooter},
    watch:{
    },
    methods: {
      //格式化标签
      formatTag(tags){
        let tmpTag = tags && tags.split('|')
        return tmpTag[0]+'|'+tmpTag[2]+'|'+tmpTag[1]
      },
      //我的书架
      goMyBook(){
        window.location.href = location.origin+'/my-book?channelId='+this.channelId
        // this.$router.push({
        //   path: '/my-book',
        //   query: {
        //     channelId: this.channelId
        //   }
        // })
      },
      //查看资源详情
      goDetail(id){
        let routeData = this.$router.resolve({path:'/book-detail',query:{id:id,channelId: this.channelId}});
          window.open(routeData.href, '_blank');
      },
      //加入书架
      setUserCollect(type, resourcesId,index) {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/add/userCollected',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            type: type,
            resourcesId: resourcesId,
            channelId:this.channelId
          },
        }, function(res) {
        that.$message({
          message: type == 1 ? '加入成功' : '移除成功',
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
      handleSelect1(val){
        this.tagId1 = val
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/bookTagList',
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
                     let tempTagIds = parseInt(that.tagIds[2]),tempInd = null
                     that.tagList3.forEach((item,index)=>{
                       if(item.tagId == tempTagIds){
                           tempInd = index
                       }
                     })
                     that.tagId3 = tempInd ? that.tagList3[tempInd].tagIds : ''
                   }else{
                       that.tagId3 = ''
                   }
                  that.handleSelect2(that.tagId3)
              }else{
                that.tagId3=''
                that.tagId4 = ''
                that.tagList4=[]
                that.getRecourseData()
              }
        })

      },
      handleSelect2(val){
        this.tagId3 = val
        if(val){
            let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/subscribe/bookTagList',
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
                      let tempTagIds = parseInt(that.tagIds[3]),tempInd = null
                      that.tagList4.forEach((item,index)=>{
                        if(item.tagId == tempTagIds){
                            tempInd = index
                        }
                      })


                      that.tagId4 = tempInd ? that.tagList4[tempInd].tagIds : ''
                    }else{
                        that.tagId4 = ''
                    }

                    that.handleSelect3(that.tagId4)
                  }else{
                    that.tagId4 = ''
                    that.getRecourseData()
                  }
            })
        }else{
          this.tagList4 = []
          this.tagId4 = ''
          this.getRecourseData()
        }

      },
      handleSelect3(val){

        this.tagId4 = val
        if(this.tagList4 && this.tagList4.length > 0){
            this.getRecourseData()
        }
      },
      //tagList
      getTagList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/bookTagList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            parentId:0,
            dataType:1
          },
        }, function(res) {
              that.tagList1 = res.list
              if(that.tagList1 && that.tagList1.length > 0){
                if(that.tagIds && that.tagIds.length > 1){
                  that.tagId1 = parseInt(that.tagIds[0])
                }else{
                  that.tagId1 = that.tagList1[0].tagId
                }

                that.handleSelect1(that.tagId1)
              }

        })
      },
      getRecourseData() {

        this.loading = true
        let self = this
        let tmpList = []
        if(this.tagId4){
          let tagId4 = this.tagId4 && this.tagId4.split(',')
          tagId4.forEach(item=>{
            tmpList.push(parseInt(item))
          })
        }
        if(this.tagId3 && tmpList.length == 0){
          let tagId3 = this.tagId3 && this.tagId3.split(',')
          tagId3.forEach(item=>{
            tmpList.push(parseInt(item))
          })
          }
        if(this.tagId1 && tmpList.length ==0){
          tmpList.push(self.tagId1)
        }


        getCommHttpData({
            url : '/iConductor-knowledge-platform/resourcesInfo/resourcesList',
            method : 'post',
            contentType : 2,
            data : {
              channelId:this.channelId ? this.channelId : null,
              rsUserId: this.rsUserId,
              bookTagList:tmpList ? tmpList : null,
              sidx:'',
              order:'',
              offset:this.curPage,
              keywords: this.keywords,
              limit:10,
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
  .find-button{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span{
        width: 100px;
        height: 30px;
        text-align: center;
        display: inline-block;
        color: #FFFFFF;
        border-radius: 4px;
        line-height: 30px;
        cursor: pointer;
        &:first-child{
          background: #3C85EE;
          margin-bottom: 10px;
        }
        &:last-child{
          background: #FF8F00;
          i{
            margin-right: 3px;
          }
        }
        // margin-bottom: 10px;
      }

  }
  .card-wrapper:hover .find-button{
      display: flex;
      .second-btn{
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
  .less-container{
    width: 1170px;
    margin: 0 auto;
  }
  .header-box{
    padding: 15px;
    background: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left{
      line-height: 14px;
      height: 14px;
      color: #333333;
      cursor: pointer;
      span{
          padding-left: 8px;
          padding-right: 8px;
          &:hover{
            color: #3C85EE;
          }
      }
    }
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

  .content-resource {
    flex-grow: 1;
    background: #FFFFFF;
    padding: 15px;
  }



  .card-wrapper {
    position: relative;
    width: 18%;
    margin-left: 1%;
    margin-right: 1%;
    float: left;
    // cursor: pointer;
  }


  .resource-list {
    overflow: hidden;
    text-align: center;
    .image {
      width: 75%;
      margin-bottom: 10px;
      // margin: 0px 10% 15px;
      height: 205px;
    }

    position: relative;
  }
  .resource-mess {
    // padding-left: 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.4);
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    overflow: hidden;/*超出部分隐藏*/
    text-overflow:ellipsis;/* 超出部分显示省略号 */
    white-space: nowrap;
  }



  .no-data-background {
    background-color: #fff;
  }

  .pagination-bottom {
    text-align: right;
  }
  .cust-menu{
    margin-bottom: 15px;
    div{
      display: inline-block;
      margin-left: 40px;
      margin-top: -4px;
    }
    b{
      position: absolute;
    }
    span{
      display: inline-block;
      padding: 3px 8px;
      margin-right: 5px;
      margin-bottom: 5px;
      cursor: pointer;
      &:hover{
        color: #3C85EE;
      }

    }
    .is-active-c{
          border: 1px dashed #3C85EE;
          border-radius: 4px;
          color: #3C85EE;
    }
  }
</style>
