<template>
  <div class="index--container">
    <div class="sub-wrapper">
      <div class="sub-wrapper_box" :style="'min-height: '+appHeight+'px;overflow-y:auto;'" v-if="subscribeList.length == 0 ||firstStep|| secondStep">
        <div class="el-center el-column" :style="'height: '+(appHeight-10)+'px;'" v-if="!firstStep && !secondStep">
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
                                <el-button style="position: relative;" :type="peItem.isSubscribe==1 ? 'primary': ''" @click="handleCheck1(peItem,peIndex)"
                                  :title="peItem.tagName.length > 5 ? peItem.tagName : ''">{{peItem.tagName && peItem.tagName.length > 5 ? peItem.tagName.substr(0,5)+'...' : peItem.tagName}}<sup
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
              <el-button type="primary" plain icon="el-icon-plus" @click="addSubscribe()">订阅</el-button>
            </div>
          </div>
        </div>

      </div>

      <!-- <template v-else> -->
      <div class="sub-side" v-if="subscribeList.length > 0 && !firstStep&& !secondStep">
        <div class="el-center sub-side-item el-column" style="cursor: pointer;" @click="firstStep=true;getTagList(1)">
          <div class="marg-20 el-center" style="border: 1px dashed #3C85EE;">+ 订阅更多</div>
        </div>
        <div class="el-center sub-side-item el-column" v-for="(item,index) in subscribeList" v-if="index<4">
          <div class="marg-20 el-center" :title="item.tagName && item.tagName.length > 6 ? item.tagName : ''">{{item.tagName && item.tagName.length > 6 ? item.tagName.substr(0,6)+'...': item.tagName}}</div>
        </div>
        <div class="el-center el-column" style="color: #999999;text-decoration: underline;cursor: pointer;" v-if="subscribeList.length > 4">
          <div class="marg-20 el-center" @click="$router.push({name:'userinfo',params: {type:1}})">查看更多</div>
        </div>
      </div>

      <div class="index-content--wrapper" v-if="subscribeList.length > 0 && !firstStep&& !secondStep">
        <div class="feed--box">
          <div v-for="(item, index) in articleList" :key="index" class="item--inner" @click="goDetail(item)">
            <div class="article--img" v-if="item.thumbAddress">
              <img v-real-img="item.thumbAddress" :src="defaultPic">
            </div>
            <div class="rbox--inner">
              <div>
                <div class="title--box">
                  <span class="title-content">{{item.title.length >65? item.title.substr(0,65)+'...':item.title}}<img
                      v-if="item.isPreferred == 1" style="width: 32px;height: 18px;" src="~@/assets/img/best-change.png"
                      alt=""></span>
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
                <!-- <el-button type="text" size="small" icon="iconfont iconfenxiang">分享</el-button> -->
                <template>
                  <el-button type="text" v-if="item.isCollected == 1" v-on:click.stop="setUserCollect(2,item.resourcesId,index)"
                    icon="is-collect iconfont iconbuoumaotubiao44">收藏</el-button>
                  <el-button type="text" v-else size="small" v-on:click.stop="setUserCollect(1,item.resourcesId,index)"
                    icon="iconfont iconbuoumaotubiao44">收藏</el-button>
                </template>
                <el-button type="text" size="small" v-on:click.stop="setUserNotLike(item.resourcesId,index)" icon="iconfont iconexpressionfailure">不感兴趣</el-button>
              </div>
            </div>
          </div>
          <div class="infinite-scroll" v-show="loading" style="text-align: center;padding: 25px;">
            <span class="infinite-scroll-text">努力加载中...</span><img style="height: 16px;margin-left: 15px;" src="../../assets/img/load.gif"
              alt="">
          </div>
          <div v-if="articleList.length == 0" style="text-align: center;padding: 50px;">
            <img src="~@/assets/img/no-data.png" alt="" style="width: 180px;margin-bottom: 15px;">
            <div>暂无资源</div>
          </div>
        </div>
      </div>
      <!-- </template> -->



    </div>

    <rightSidebar :scrollTop="scrollTop" :isClick="page1<totalPage1" class="index--right" :hotList="hotList"
      :dayPushList="dayPushList" @changeOptimization="changeOptimization" :viewnum="userInfo.viewNum" :collectednum="userInfo.collectedNum"
      :subscribednum="userInfo.subscribedNum"></rightSidebar>
    <el-backtop></el-backtop>
  </div>

</template>

<script>
  import rightSidebar from '../components/right-sidebar'
  import defaultPic from '@/assets/img/no-thumb.png'
  import {
    getCommHttpData
  } from '@/utils/common'
  export default {
    data() {
      return {
        defaultPic: defaultPic,
        channelId: '',
        appHeight: 800,
        rsUserId: this.GLOBAL.getRsUserId(),
        tagList: [],
        firstTagId: '',
        secondTagList: [],
        subscribeList: [],
        firstPopList: [],
        secondPopList: [],
        firstStep: false,
        secondStep: false,
        tagIndex1: '',
        tagIndex2: '',
        addTagList: [],
        dialogTagList: [],
        checkSubscribeList: [],
        REQUIRE: true,
        loading: false,
        articleList: [],
        totalPage: '',
        page: 1,
        userInfo: '',
        hotList: [],
        dayPushList: [],
        page1: 1,
        totalPage1: '',
        scrollTop: 0
      }
    },
    mounted() {

      this.channelId = this.$route.query.channelId
      window.addEventListener('resize', () => {
        this.appHeight = window.innerHeight - 80
      })
      window.addEventListener('scroll', this.scrollBottom1, true)

      this.appHeight = window.innerHeight - 80
      this.getUserInfo()
      this.getMySubscribe();
      if (this.$route.query.login == 1) {
        this.getTagList(1)
        this.firstStep = true
      }
      this.getHotResourceList()
      this.getOptimizationResourceList()
      this.getDataList()

    },
    activated() {
      this.firstStep = false
      this.secondStep = false
      this.REQUIRE = true
      this.loading = false
    },
    components: {
      rightSidebar
    },
    destroyed() {
      //  删除监听事件
      window.removeEventListener('scroll', this.scrollBottom1, true);
    },
    watch: {
      secondPopList(newVal, oldVal) {
        if (oldVal && oldVal.childTagList) {
          let isSub = true,
            templist = oldVal.childTagList
          templist.forEach(val => {
            if (isSub && val.isSubscribe == 1) {
              isSub = false
            }
          })
          if (isSub) {
            oldVal.isSubscribe = 0
          }
        }
      }
    },
    methods: {
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
      getHotResourceList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/homepage/hotResourceList',
          method: 'post',
          contentType: 2,
          data: {
            channelId: parseInt(this.channelId),
            limit: 5,
            offset: 1,
            order: '',
            sidx: ''
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
            channelId: parseInt(this.channelId),
            isPreferred: 1,
            limit: 5,
            offset: this.page1,
            order: '',
            sidx: ''
          },
        }, function(res) {
          that.dayPushList = res.list
          // that.totalPage1 = res.page.totalPage
        })
      },
      //每日优选换一换
      changeOptimization() {
        // let page = this.page1
        // if (page < this.totalPage1) {
        //   this.page1 = page + 1
        this.getOptimizationResourceList()
        // }
      },
      //科目取消选中
      handleHidePop(item) {
        let isSub = true,
          templist = item.childTagList
        templist.forEach(val => {
          if (isSub && val.isSubscribe == 1) {
            isSub = false
          }
        })
        if (isSub) {
          item.isSubscribe = 0
        }
        this.secondPopList = [];
        this.dialogTagList = []
      },
      //下一步
      handleNext() {
        this.secondStep = true;
        this.firstStep = false
      },
      getUserInfo() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/userinfo',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId
          },
        }, function(res) {
          that.userInfo = res.userinfo
        })
      },
      //滚动
      scrollBottom1() {
        var h = window.pageYOffset || document.body.scrollTop || document.body.scrollHeight;
        this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        // 滚动到页面底部时，请求前一天的文章内容
        if (((window.screen.height + h) > (document.body.clientHeight)) && this.REQUIRE && this.page < this.totalPage) {
          // 请求的数据未加载完成时，滚动到底部不再请求前一天的数据
          this.REQUIRE = false;
          this.loading = true;
          let page = this.page
          this.page = page + 1
          this.getDataList()
        }
      },
      //选中
      handleCheck(type, index, sIndex, item) {
        if (type == 1) {
          if (item.isSubscribe == 0) {
            this.addTagList.push(item.tagId)
          } else {
            let tmpIndex = this.addTagList.indexOf(item.tagId)
            this.addTagList.splice(tmpIndex, 1)
            let tmpIndex2 = this.checkSubscribeList.indexOf(item.tagId)
            this.checkSubscribeList.splice(tmpIndex2, 1)
          }
          this.secondTagList[index].childTagList[sIndex].isSubscribe = item.isSubscribe == 0 ? 1 : 0
        } else {
          if (item.isSubscribe == 0) {
            this.secondTagList[index].childTagList[sIndex].isSubscribe = 1
            if (!item.childTagList) {
              let that = this
              getCommHttpData({
                url: '/iConductor-knowledge-platform/subscribe/tagList',
                method: 'post',
                contentType: 2,
                data: {
                  rsUserId: this.rsUserId,
                  parentId: item.tagId,
                  dataType: 2
                },
              }, function(res) {
                item.childTagList = res.list
              })
            }
          } else {
            if (!item.childTagList) {
              let that = this
              getCommHttpData({
                url: '/iConductor-knowledge-platform/subscribe/tagList',
                method: 'post',
                contentType: 2,
                data: {
                  rsUserId: this.rsUserId,
                  parentId: item.tagId,
                  dataType: 2
                },
              }, function(res) {
                item.childTagList = res.list
              })
            }
          }
        }
        this.$forceUpdate()
      },
      //dailog选中
      handleCheck1(item,peIndex) {
        this.secondPopList = [];
        if (item.isSubscribe == 0) {
          item.isSubscribe = 1
          if (!item.childTagList) {
            let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/subscribe/tagList',
              method: 'post',
              contentType: 2,
              data: {
                rsUserId: this.rsUserId,
                parentId: item.tagId,
                dataType: 3
              },
            }, function(res) {
              item.childTagList = res.list
              that.secondPopList = item
            })
          } else {
            this.secondPopList = item
          }
        } else {
          if (!item.childTagList) {
            let that = this
            getCommHttpData({
              url: '/iConductor-knowledge-platform/subscribe/tagList',
              method: 'post',
              contentType: 2,
              data: {
                rsUserId: this.rsUserId,
                parentId: item.tagId,
                dataType: 3
              },
            }, function(res) {
              item.childTagList = res.list
              that.secondPopList = item
            })
          } else {
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
      //重置子集
      resetChild(tagArr) {
        const arr = [];
        let obj = {};
        tagArr.forEach(item => {
          const tmp = { ...item
          };
          if (tmp.childTagList && tmp.childTagList.length > 0) {
            tmp.childTagList = this.resetChild(tmp.childTagList);
          }
          obj = {
            tagId: tmp.tagId,
            tagName: tmp.tagName,
            tagType: tmp.tagType,
            usedFor: tmp.usedFor,
            level: tmp.level,
            parentIds: tmp.parentIds,
            childTagList: tmp.childTagList ? tmp.childTagList : '',
            isSubscribe: 0
          }
          arr.push(obj);
        })
        return arr;
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
      handleAddSub(id) {
        if (this.dialogTagList.length > 0) {
          this.addTagList = this.addTagList.concat(this.dialogTagList)
          let pop = 'popover' + id
          this.$refs[pop][0].doClose()
          this.dialogTagList = []
        }
      },
      //获取标签
      getTagList(type, parentId) {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/subscribe/tagList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            level: type,
            parentId: parentId,
            dataType: 1
          },
        }, function(res) {
          if (type == 1) {
            that.tagList = res.list
          } else {
            // that.secondTagList=res.list
            let map = {},
              dest = [];
            res.list.forEach(item => {
              if (!map[item.tagTypeName]) {
                dest.push({
                  tagId: item.tagId,
                  tagTypeName: item.tagTypeName,
                  childTagList: [item]
                });
                map[item.tagTypeName] = item;
              } else {
                dest.forEach(item1 => {
                  if (item1.tagTypeName == item.tagTypeName) {
                    item1.childTagList.push(item);
                    return
                  }
                })
              }
            })
            that.secondTagList = dest
            map = {}
            dest = []
          }

        })
      },
      //添加订阅
      addSubscribe() {
        let that = this
        let tagIds
        if (this.checkSubscribeList.length > 0) {
          tagIds = this.addTagList.concat(this.checkSubscribeList)
        } else {
          tagIds = this.addTagList
        }
        if (tagIds.length == 0) {
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
            firstTagId: this.firstTagId
          },
        }, function(res) {
          that.$message({
            message: '订阅成功，您可在 [我的订阅] 中查看订阅内容',
            type: 'success',
          });
          that.firstStep = false
          that.secondStep = false
          that.secondTagList = []
          that.tagList = []
          that.firstTagId = ''
          that.getMySubscribe()
          that.getUserInfo()
          that.getDataList()
        })

      },
      handleRadio(val) {
        this.getTagList(2, val, 1)

      },
      //获取我的订阅
      getMySubscribe() {
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
          res.list.forEach(item => {
            that.checkSubscribeList.push(item.tagId)
          })
        })
      },
      //添加、取消收藏
      setUserCollect(type, resourcesId, index) {
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
            that.userInfo.collectedNum = that.userInfo.collectedNum + 1
          } else {
            that.articleList[index].isCollected = 0
            that.userInfo.collectedNum = that.userInfo.collectedNum - 1
          }
          that.$forceUpdate()
        })

      },
      //添加不感兴趣
      setUserNotLike(resourcesId, index) {
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
          that.articleList.splice(index, 1)
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
            limit: 20,
            order: '',
            sidx: '',
            channelId: this.channelId
          },
        }, function(res) {
          let tmpList = [...that.articleList]

          that.articleList = tmpList.concat(res.page.list)
          that.REQUIRE = true;
          that.loading = false;
          that.totalPage = res.page.totalPage
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .index--container {
    display: flex;
    position: relative;
    margin-left: 206px;
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

  .sub-wrapper {
    width: 670px;

    &_box {
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
      background: #FFFFFF;
      position: relative;

      .sub-content {
        padding: 100px 50px;
      }
    }

    .sub-side {
      background: #FFFFFF;
      display: flex;
      padding-top: 20px;
      border: 1px solid #F1F1F1;
      padding-left: 20px;
      // padding-bottom: 20px;

      &-item {
        // width: 90px;
        margin-right: 10px;

        div {
          // width: 50px;
          padding: 4px 10px;
          // height: 50px;
          border: 1px solid #3C85EE;
          border-radius: 4px;
          font-size: 14px;
          color: #3C85EE;
        }
      }
    }
  }

  .index--right {
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

          &:hover {
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

        .article--tag {
          margin-left: 6px;
          color: #333;

          &:hover {
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
