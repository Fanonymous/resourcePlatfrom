<template>
  <div>
    <nav class="site-navbar">
      <div class="site-navbar__body">
        <!-- <div class="site-navbar__body--title">

        </div> -->
        <div class="site-navbar-list">
          <div @click="$router.push({path:'/index'})" style="display: inline-block;">
            <img src="~@/assets/img/logo.png" alt="知识共享服务平台" style="margin-right:10px ;" />
          </div>
          <span v-for="(item, index) in currentMenu" v-if="item.channelName == '我的订阅' || item.channelName == '推荐'"
            :index="item.url" @click="gotoRouteHandle(item)">{{item.channelName}}</span>
          <span v-popover:popover1 style="border-right: none;">更多></span>
        </div>
        <el-popover ref="popover1" placement="bottom" width="500" trigger="hover" popper-class="custum-pop">
          <el-row :gutter="15" style="margin-right: 0;">
            <template>
              <el-col style="padding: 0;" :span="4" v-for="(mItem,mIndex) in currentMenu" v-if="mItem.channelName != '我的订阅' && mItem.channelName != '推荐'">
                <div class="cust-col" style="" @click="gotoRouteHandle(mItem)">{{mItem.channelName}}</div>
              </el-col>
            </template>
            <el-col :span="4">
              <div class="cust-col" style="border-right: none;color: #3C85EE;" @click="handleOpenDio()">自定义</div>
            </el-col>
          </el-row>

        </el-popover>
        <div class="site-navbar__body--right">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img v-real-img="imgUrl + userinfo.imageUrl" :src="defaultPic" @click="$router.push({path:'/userinfo',query: {type:1}})">
              <span style="color: #8590A6;cursor: pointer;">{{userinfo.fullName}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:1}})">我的订阅</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:2}})">收藏夹</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push({path:'/userinfo',query: {type:3}})">最近看过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <a href="https://support.qq.com/products/117498?" target="_blank" style="font-size: 14px; color: #8590A6; margin-bottom: 2px; margin-left: 65px;cursor: pointer;">帮助中心</a>
        </div>
      </div>

    </nav>
    <el-dialog title="自定义" :visible.sync="dialogSidebarVisible" width="540px">
      <div style="margin-top: -20px;" class="marg-20">我的频道<span class="font-s12 font-grey marg-l-15">拖拽可以排序</span></div>
      <div class="marg-20">
        <draggable v-model="changeList" @end="onEnd" :move="checkMove">
          <transition-group>
            <span v-for="(item,index) in changeList" :key="item.channelId">
              <el-tag class="el-tag-cut" style="background-color: #ccc;border-color: #ccc;" type="info" effect="dark"
                v-if="item.channelName == '我的订阅' || item.channelName == '推荐'">{{item.channelName}}</el-tag>
              <el-tag class="el-tag-cut" v-else closable @close="handleClose(index,item)">{{item.channelName}}</el-tag>
            </span>
          </transition-group>
        </draggable>
      </div>
      <div class="marg-20" style="margin-top: 15px;">频道推荐<span class="font-s12 font-grey marg-l-15">{{changeMoreList && changeMoreList.length > 0 ? '点击添加频道' : '暂无更多频道'}}</span></div>
      <div class="marg-20">
        <el-tag v-for="(mItem,index) in changeMoreList" :key="mItem.channelId" @click="handleAdd(index,mItem)" effect="plain"><i class="el-icon-plus"></i>&nbsp;{{mItem.channelName}}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-divider></el-divider>
        <el-button size="mini" @click="handleCloseDio()">取消</el-button>
        <el-button size="mini" type="primary" @click="saveMenuList()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import defaultPic from '@/assets/img/avatar.jpg'
  import {
    getCommHttpData
  } from '@/utils/common'
  import draggable from 'vuedraggable'
  export default {
    data() {
      return {
        userinfo: this.GLOBAL.getUserinfo(),
        rsUserId: this.GLOBAL.getRsUserId(),
        imgUrl: window.SITE_CONFIG.imgIP,
        defaultPic: defaultPic,
        dialogSidebarVisible: false,
        changeList: [],
        changeMoreList: [],
        currentMenu: [],
        moreMenu: [],
        orderList: []
      }
    },
    computed: {
      menuActiveName: {
        get() {
          return this.$store.state.common.menuActiveName
        },
        set(val) {
          this.$store.commit('common/updateMenuActiveName', val)
        }
      },
    },
    mounted() {
      this.getMenuList()
      this.getHotMenuList()
    },
    components: {
      draggable
    },
    methods: {
      //移除频道
      handleClose(index, item) {
        this.changeMoreList.push(item)
        this.changeList.splice(index, 1);
      },
      //订阅
      handleRouter(type) {
        console.log('dhdhdhhdhdhhdhd')
        // $router.push({name:'userinfo',params: {type:1}})
        // if(type ==1){

        // }
      },
      checkMove(evt){
          return (evt.draggedContext.element.channelName!=='推荐' && evt.draggedContext.element.channelName!=='我的订阅');
      },
      onEnd(evt) {
        let newIndex = evt.newIndex,
          num = newIndex - evt.oldIndex,
          tmpChannel = this.changeList[newIndex],
          orderBy = tmpChannel.orderBy + num,
          tempIndex = null
        this.orderList.forEach((item, index) => {
          if (item.channelId == tmpChannel.channelId) {
            tempIndex = index
          }
        })
        if (tempIndex != null) {
          this.orderList[tempIndex].orderBy = orderBy
        } else {
          this.orderList.push({
            orderBy: orderBy,
            channelId: tmpChannel.channelId,
            rsUserId: this.rsUserId
          })
        }
      },
      //添加频道
      handleAdd(index, item) {
        this.changeList.push(item)
        this.changeMoreList.splice(index, 1);
      },
      //获取菜单列表
      getMenuList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/channelList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            userType: this.userinfo.userType
          },
        }, function(res) {
          let tmpMenuList = res.list
          tmpMenuList = tmpMenuList.map(item => {
            if (item.channelName == '推荐') {
              item.url = '/index'
            } else{
              let tmpUrl = item.url
              item.url = tmpUrl+'?channelId='+item.channelId
            }
            return item
          })
          that.currentMenu = tmpMenuList
        })
      },
      //获取推荐列表
      getHotMenuList() {
        let that = this
        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/hotChannelList',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: this.rsUserId,
            userType: this.userinfo.userType
          },
        }, function(res) {

          let tmpMenuList = res.list
          tmpMenuList = tmpMenuList.map(item => {
            if (item.channelName == '推荐') {
              item.url = '/index'
            } else{
              let tmpUrl = item.url
              item.url = tmpUrl+'?channelId='+item.channelId
            }
            return item
          })
          that.moreMenu = tmpMenuList
        })
      },
      handleCloseDio() {
        this.dialogSidebarVisible = false
        this.changeMoreList = []
        this.orderList = []
        this.changeList = []
      },
      handleOpenDio() {
        this.dialogSidebarVisible = true
        this.changeMoreList = [...this.moreMenu]
        this.changeList = [...this.currentMenu]
      },
      //更新菜单
      saveMenuList() {
        let that = this
        if (this.orderList.length > 0) {
          getCommHttpData({
            url: '/iConductor-knowledge-platform/channel/changeOrder',
            method: 'post',
            contentType: 2,
            data: {
              list: this.orderList,
            },
          }, function(res) {})
        }

        getCommHttpData({
          url: '/iConductor-knowledge-platform/channel/saveOrUpdate',
          method: 'post',
          contentType: 2,
          data: {
            rsUserId: that.rsUserId,
            list: that.changeList
          },
        }, function(res) {
          that.$message({
            message: '频道修改成功',
            type: 'success',
          });
          that.getMenuList()
          that.getHotMenuList()
          that.dialogSidebarVisible = false
        })

      },
      gotoRouteHandle(menu, type) {

        if (menu.url == '/index') {
          this.$router.push({
            path: menu.url,
            query: {
              channelId: menu.channelId
            }
          })
        } else if (menu.isOpen == 1) {
          const newTab = this.$router.resolve({
            path: menu.url
          })
          window.open(newTab.href, '_blank')
        } else {
          this.$router.push({
            path: menu.url
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .site-navbar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
    // box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    // padding-left: 15px;
    // padding-right: 30px;

    &__body {
      height: 60px;
      width: 1170px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #606266;
      // background-color: transparent;

      .site-navbar-list {
        display: flex;
        align-items: center;

        span {
          margin: 0 8px;
          color: #606266;
          cursor: pointer;
          font-size: 14px;
          border-right: 1px solid #606266;
          padding-right: 10px;
          height: 14px;
          line-height: 14px;
        }

      }

      &--right {
        display: flex;
        align-items: center;
      }
    }

    .el-dropdown-link {
      >img {
        width: 34px;
        height: 34px;
        margin-right: 5px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
  }
  .marg-20 {
    /deep/ .el-tag {
      margin-bottom: 10px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .cust-col{
    cursor: pointer;
    text-align: center;
    height: 16px;
    line-height: 16px;
    border-right: 1px solid #999999;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-right: 7.5px;
    padding-left: 7.5px;
  }
</style>
