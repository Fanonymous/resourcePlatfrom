<template>
    <div class="right-sidebar--wrapper">
        <!-- 头像区 -->
        <div class="right-avatar--box">
            <div class="top-box">
                 <img v-real-img="imgUrl + userinfo.imageUrl" :src="allPic" />
                <span style="margin-left: 20px;">HI,<span :title="userinfo.fullName">{{userinfo.fullName && userinfo.fullName.length >7 ? userinfo.fullName.substr(0,7)+'...':userinfo.fullName}}</span></span>
            </div>
            <div class="bottom-box">
                <div class="collet-item" @click="$router.push({path:'/userinfo',query: {type:1}})">
                    <div>{{subscribednum ? subscribednum : '0'}}</div>
                    <div>我的订阅</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="collet-item" @click="$router.push({path:'/userinfo',query: {type:2}})">
                    <div>{{collectednum ? collectednum : '0'}}</div>
                    <div>我的收藏</div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="collet-item" @click="$router.push({path:'/userinfo',query: {type:3}})">
                    <div>{{viewnum ? viewnum : '0'}}</div>
                    <div>最近看过</div>
                </div>
            </div>
        </div>

        <!-- 应用中心 -->
        <div class="right-application--center" v-if="menuList.length > 0">
            <div class="application-title">
                <span class="el-icon-menu"></span>
                <span>应用中心</span>
            </div>
            <el-row class="application-content">
                <el-col :span="8" v-for="(item, index) in menuList" :key="index">
                    <div class="menu--item">
                        <img v-real-img="imgUrl + item.icon" :src="defaultPic">
                        <div>{{item.appName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 热门榜 -->
        <div ref="fixedDiv">
          <div class="right-hot--club">
              <div class="hot--title">
                  <img src="~@/assets/img/hot.png">
                  <span>热门榜</span>
              </div>
              <div class="hot-content">
                  <div class="hot-item" v-for="(i, j) in hotList" :key="j" @click="goDetail(i)">
                    <template v-if="i.thumbAddress">
                      <div class="hot-item--left">
                          <img v-real-img="i.thumbAddress" :src="defaultPic" class="hot-img--inner">
                          <img :src="require(`@/assets/img/${j}.png`)" class="serial--number">
                      </div>
                      <div class="hot-item--right">
                          <span>{{i.title}}</span>
                          <span>{{i.tagsName}}</span>
                      </div>
                    </template>
                    <template v-else>
                      <img style="height: 21px;margin-right: 10px;" :src="require(`@/assets/img/${j}.png`)">
                      <div class="hot-item--right">
                          <span>{{i.title}}</span>
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
                  <div style="color: #8590A6;">
                      <!-- <span  :style="{cursor:(isClick?'pointer':'not-allowed')}" @click="changeOptimization">换一换</span> -->
                    <span style="cursor: pointer;" @click="changeOptimization">换一换</span>
                  </div>
              </div>
              <div class="day-push--content">
                  <div class="day-push-item" v-for="(m, n) in dayPushList" :key="n" @click="goDetail(m)">
                      <div class="day-push--left" v-if="m.thumbAddress">
                          <img v-real-img="m.thumbAddress" :src="defaultPic" class="day-push--inner">
                      </div>
                      <div class="day-push--right">
                          <span>{{m.title}}</span>
                      </div>
                  </div>
              </div>
          </div>

        </div>

        <!-- 版权信息 -->
        <div class="right--footer" ref="footerTop">
            <div>Copyright © 2016-{{date}}</div>
            <div><img src="~@/assets/img/phone.png">400-155-6090</div>
            <div><img src="~@/assets/img/office.png">{{$t('navbar.address')}}</div>
            <div>
                <img src="~@/assets/img/police.png">
                <span>{{$t('navbar.record')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  import defaultPic from '@/assets/img/no-thumb.png'
  import allPic from '@/assets/img/avatar.jpg'
  import {
    getCommHttpData
  } from '@/utils/common'
export default {
  props:['hotList','viewnum','collectednum','subscribednum','dayPushList','isClick','scrollTop'],
    data() {
        return {
          userinfo:this.GLOBAL.getUserinfo(),
          imgUrl: window.SITE_CONFIG.imgIP,
          defaultPic: defaultPic,
          allPic:allPic,
            menuList: [],

            date:(new Date()).getFullYear(),
            childScrollTop:true
        }
    },
    mounted() {
      this.getApplicationList()
    },
    watch:{
      scrollTop(newVal,oldVal){
          if (newVal) {
            let currenTop = this.$refs.footerTop.getBoundingClientRect().top+90+newVal
            if(newVal >currenTop){
              this.$refs.fixedDiv.style="position:fixed;top:60px;width:284px"
            }else{
              this.$refs.fixedDiv.style=""
            }
          }
      }
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
      //获取应用
      getApplicationList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/homepage/applicationList',
          method: 'post',
          contentType: 2,
          data: {
            userType: this.userinfo.userType
          },
        }, function(res) {
          that.menuList = res.list
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
            channelId: this.channelId,
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
            channelId: this.channelId,
            isPreferred:1,
            limit:5,
            offset:this.page,
            order:'',
            sidx:''
          },
        }, function(res) {
          that.dayPushList = res.page.list
          that.totalPage = res.page.totalPage
        })
      },
      //每日优选换一换
      changeOptimization(){
        this.$emit('changeOptimization')
        // let page = this.page
        // if(page < this.totalPage){
        //   this.page = page+1
        //   this.getOptimizationResourceList()
        // }
      }
    }
}
</script>

<style lang="scss" scoped>
.right-sidebar--wrapper{
    width: 284px;
    background-color: #F1F4F5;
}
.right-avatar--box{
    background-color: #fff;
    height: 157px;
    padding: 20px;
    border:1px solid rgba(241,241,241,1);
    box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    .top-box{
        img{
            width: 56px;
            height: 56px;
            border-radius: 50%;
        }
        span{
            font-size: 16px;
            font-weight: bold;
        }
    }
    .bottom-box{
        display: flex;
        margin-top: 15px;
        .collet-item{
            flex-grow: 1;
            text-align: center;
            cursor: pointer;
            div:first-child{
                margin-bottom: 8px;
                font-size: 18px;
                color: #3C85EE;
                font-weight: bold;
            }
            div:last-child{
                font-size: 12px;
            }
        }
        /deep/ .el-divider{
            height: 18px;
            background-color: #CCCCCC;
            margin-top: 12px;
        }
    }
}
.right-application--center{
    min-height: 312px;
    margin-top: 12px;
    background-color: #fff;
    border:1px solid rgba(241,241,241,1);
    box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    .application-title{
        padding: 10px 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #F1F1F1;
        span:first-child{
            font-size: 26px;
            color: #3C85EE;
        }
        span:last-child{
            margin-left: 5px;
            font-size: 16px;
            font-weight: bold;
        }
    }
    .application-content{
        padding: 20px 20px 0 20px;
        .menu--item{
            cursor: pointer;
        }
    }
    .menu--item{
        text-align: center;
        padding-bottom: 20px;
        img{
            width: 30px;
            height: 30px;
            border-radius: 4px;
        }
        div{
            margin-top: 15px;
        }
    }
}
.right-hot--club{
    // max-height: 400px;
    margin-top: 12px;
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
                display: flex;
                flex-direction: column;
                justify-content: space-between;
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
.right--footer{
    // height: 138px;
    margin-top: 12px;
    padding: 20px;
    background-color: #fff;
    border:1px solid rgba(241,241,241,1);
    box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    div{
        line-height: 25px;
        img{
          margin-right: 8px;
          height: 15px;
        }
    }
}
</style>
