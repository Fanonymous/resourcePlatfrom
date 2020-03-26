<template>
  <div style="background: #F1F4F5;padding-top: 70px;">
    <MainNavbar></MainNavbar>
    <div class="less-container">
      <!-- <el-card> -->
      <div class="header-box">
        <div class="header-left">
          <b style="padding-left: 0;font-size: 16px;padding-right: 8px;">电子课本</b>
          <span>没带课本？别担心！电子课本省心又省力！</span>
        </div>
        <el-button type="primary" plain @click="goBook()">去课本库选书</el-button>
      </div>
      <div class="content-resource">
        <!-- 资源列表 -->
        <div class="resource-list" :class="{'no-data-background' : resourceListData.length==0}" v-loading="loading">
          <template v-if="resourceListData.length > 0">
            <template v-for="(item2,index2) in resourceListData">
              <div class="card-title" v-if="item2.childList.length > 0">{{item2.tagsName}}</div>
              <el-row :gutter="12" v-for="rIndex of Math.ceil(item2.childList.length/5)">
                <div class="card-wrapper" v-for="(item, index) in item2.childList" v-if="index < 5 && item2.childList[(rIndex-1)*5+index]"
                  style="margin-bottom:20px;">
                  <div>
                    <img v-real-img="item2.childList[(rIndex-1)*5+index].thumbAddress" :src="allPic" class="image" />
                    <div class="resource-mess">
                      {{item2.childList[(rIndex-1)*5+index].tags}}
                    </div>
                  </div>
                  <div class="find-button">
                    <span @click="goDetail(item2.childList[(rIndex-1)*5+index].resourcesId)">阅读</span>
                    <span @click="setUserCollect(2,item2.childList[(rIndex-1)*5+index].resourcesId,(rIndex-1)*5+index,index2)"></i><i
                        class="el-icon-delete"></i>移出书架</span>
                  </div>
                </div>
              </el-row>
            </template>

          </template>
          <div class="no-data" :style="'min-height: '+appHeight+'px;overflow-y:auto;'" v-if="resourceListData.length==0">
            <div style="margin-bottom: 15px;font-size: 18px;">我的书架上暂无课本</div>
            <el-button type="primary" plain @click="goBook()">去课本库选书</el-button>
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
        userinfo: this.GLOBAL.getUserinfo(),
        resourceListData: [],
        loading: false,
        channelId: '',
        appHeight: 800
      }

    },
    mounted() {
      this.channelId = this.$route.query.channelId
      window.addEventListener('resize', () => {
        this.appHeight = window.innerHeight - 250
      })

      this.appHeight = window.innerHeight - 250
      this.getRecourseData()
    },
    components: {
      MainNavbar,
      ComFooter
    },
    watch: {},
    methods: {
      //查看教材库
      goBook() {
        window.location.href = location.origin + '/text-book?channelId=' + this.channelId
        // this.$router.push({
        //   path: '/text-book',
        //   query: {
        //     channelId: this.channelId
        //   }
        // })
      },
      //查看资源详情
      goDetail(id) {
        let routeData = this.$router.resolve({
          path: '/book-detail',
          query: {
            id: id,
            channelId: this.channelId
          }
        });
        window.open(routeData.href, '_blank');
      },
      //加入书架
      setUserCollect(type, resourcesId, index, index2) {
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
            message: type == 1 ? '加入成功' : '移除成功',
            type: 'success',
          });
          if (type == 1) {
            that.resourceListData[index].isCollected = 1
          } else {
            that.resourceListData[index].isCollected = 0
            if (that.resourceListData[index2].childList.length == 1) {
              that.resourceListData.splice(index, 1)
            } else {
              that.resourceListData[index2].childList.splice(index, 1)
            }
          }
          that.$forceUpdate()
        })

      },
      getRecourseData() {
        this.loading = true
        let self = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/myCollected',
          method: 'post',
          contentType: 2,
          data: {
            channelId: this.channelId ? this.channelId : null,
            limit: 10,
            page: this.curPage,
            rsUserId: this.rsUserId,
            type: 1
          }
        }, res => {
          if (res.code === 0) {
            let map = {},
              dest = [];
            res.list.forEach(item => {
              let tmpTag = item.tags && item.tags.split('|')
              item.tags = tmpTag[1] + '|' + tmpTag[3] + '|' + tmpTag[2]
              if (!map[item.tagsName]) {
                dest.push({
                  tagId: item.tagId,
                  tagsName: item.tagsName,
                  childList: [item]
                });
                map[item.tagsName] = item;
              } else {
                dest.forEach(item1 => {
                  if (item1.tagsName == item.tagsName) {
                    item1.childList.push(item);
                    return
                  }
                })
              }
            })
            self.resourceListData = dest
            self.loading = false
            map = {}
            dest = []
          }
        })

      },




    }

    // components: {atricleContent, rightSidebar }
  }
</script>

<style lang="scss" scoped>
  .find-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    span {
      width: 100px;
      height: 30px;
      text-align: center;
      display: inline-block;
      color: #FFFFFF;
      border-radius: 4px;
      line-height: 30px;
      cursor: pointer;

      &:first-child {
        background: #3C85EE;
        margin-bottom: 10px;
      }

      &:last-child {
        background: #FF8F00;

        i {
          margin-right: 3px;
        }
      }

      // margin-bottom: 10px;
    }

  }

  .card-wrapper:hover .find-button {
    display: flex;
  }

  .less-container {
    width: 1170px;
    margin: 0 auto;
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

    .card-title {
      border-bottom: 1px solid #F1F4F5;
      line-height: 40px;
      margin-bottom: 20px;
      text-align: left;
      font-weight: bold;
      font-size: 18px;
    }

    position: relative;
  }

  .resource-mess {
    // padding-left: 15px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    overflow: hidden;
    /*超出部分隐藏*/
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
    white-space: nowrap;
  }


  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .no-data-background {
    background-color: #fff;
  }
</style>
