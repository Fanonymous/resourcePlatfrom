<template>
  <div>
    <div class="side-bar--wrapper">
      <div class="el-menu">
        <div class="el-menu-item" v-for="(item, index) in currentMenu" v-if="index < 12" :class="menuActiveName == item.channelName ? 'is-active': ''" @click="gotoRouteHandle(item)">
           <span slot="title">{{item.channelName}}</span>
        </div>
        <div class="el-menu-item" v-popover:popover :class="menuActiveName == 100 ? 'is-active': ''">
          <span slot="title">
              更多
          </span>
        </div>
      </div>
        <!-- <el-menu :default-active="menuActiveName || '100'" active-text-color="#ffffff">
            <el-menu-item v-for="(item, index) in currentMenu" v-if="index < 12" :index="item.channelName" @click="gotoRouteHandle(item)">
                <span slot="title">{{item.channelName}}</span>
            </el-menu-item>
            <el-menu-item index="100" v-popover:popover>
                <span slot="title">
                    更多
                </span>
            </el-menu-item>
        </el-menu> -->
        <el-popover
            ref="popover"
            placement="right"
            width="200"
            trigger="hover" popper-class="custum-pop">
            <el-row :gutter="15">
              <template v-if="currentMenu.length > 12">
                <el-col :span="12" v-for="(mItem,mIndex) in currentMenu" v-if="mIndex > 11"><div style="line-height: 30px;cursor: pointer;text-align: center;" @click="gotoRouteHandle(mItem,2)">{{mItem.channelName}}</div></el-col>
              </template>
              <el-col :span="12"><div style="line-height: 30px;cursor: pointer;text-align: center;color: #3C85EE;" @click="handleOpenDio()">自定义</div></el-col>
            </el-row>

          </el-popover>
    </div>
    <el-dialog title="自定义" :visible.sync="dialogSidebarVisible" width="540px">
    				<div style="margin-top: -20px;" class="marg-20">我的频道<span class="font-s12 font-grey marg-l-15">拖拽可以排序</span></div>
            <div class="marg-20">
              <draggable v-model="changeList" @end="onEnd" :move="checkMove">
                  <transition-group>
                      <span v-for="(item,index) in changeList" :key="item.channelId">
                        <el-tag class="el-tag-cut" style="background-color: #ccc;border-color: #ccc;" type="info" effect="dark" v-if="item.channelName == '我的订阅' || item.channelName == '推荐'">{{item.channelName}}</el-tag>
                        <el-tag class="el-tag-cut" v-else closable @close="handleClose(index,item)">{{item.channelName}}</el-tag>
                      </span>
                  </transition-group>
              </draggable>
            </div>
            <div class="marg-20" style="margin-top: 15px;">频道推荐<span class="font-s12 font-grey marg-l-15">{{changeMoreList && changeMoreList.length > 0 ? '点击添加频道' : '暂无更多频道'}}</span></div>
            <div class="marg-20">
              <el-tag v-for="(mItem,index) in changeMoreList" @click="handleAdd(index,mItem)" effect="plain"><i class="el-icon-plus"></i>&nbsp;{{mItem.channelName}}</el-tag>
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
  import {
    getCommHttpData
  } from '@/utils/common'
  import draggable from 'vuedraggable'
export default {
    data() {
        return {
          dialogSidebarVisible: false,
          rsUserId: this.GLOBAL.getRsUserId(),
          userinfo:this.GLOBAL.getUserinfo(),
          changeList:[],
          changeMoreList:[],
            currentMenu: [
            ],
            moreMenu: [
            ],
            orderList:[]
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
      this.getMenuList(1)
      this.getHotMenuList()

    },
    components: { draggable},
	methods:{
    //移除频道
    handleClose(index,item){
      this.changeMoreList.push(item)
      this.changeList.splice(index, 1);
    },
    checkMove(evt){
        return (evt.draggedContext.element.channelName!=='推荐' && evt.draggedContext.element.channelName!=='我的订阅');
    },
    onEnd(evt){
      let newIndex = evt.newIndex,
      num = newIndex-evt.oldIndex,
      tmpChannel = this.changeList[newIndex],
      orderBy = tmpChannel.orderBy+num,tempIndex=null
      this.orderList.forEach((item,index)=>{
         if(item.channelId == tmpChannel.channelId){
           tempIndex = index
         }
      })
      if(tempIndex !=null){
        this.orderList[tempIndex].orderBy = orderBy
      }else{
        this.orderList.push({
          orderBy:orderBy,
          channelId:tmpChannel.channelId,
          rsUserId:this.rsUserId
        })
      }
    },
    //添加频道
    handleAdd(index,item){
      let tempObj = this.changeList[this.changeList.length-1]
      if(tempObj){
        item.orderBy = tempObj.orderBy+1
      }
      this.changeList.push(item)
      this.changeMoreList.splice(index, 1);
    },
    //获取菜单列表
    getMenuList(type){
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
        let tmpMenuList=res.list
        tmpMenuList= tmpMenuList.map(item=>{
          if(item.channelName=='推荐'){
            item.url='/index'
          }else{
            let tmpUrl = item.url
            item.url = tmpUrl+'?channelId='+item.channelId
          }
          // else if(item.channelName=='我的订阅'){
          //   item.url='/subscribe?channelId='+item.channelId
          //  }else if(item.isOpen == 1){
          //    item.url='/less-plan?channelId='+item.channelId
          //  }else{
          //    item.url='/activity?channelId='+item.channelId
          //  }
           return item
        })
        that.currentMenu = tmpMenuList
        sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(tmpMenuList || '[]'))
        if(type ==1){
          that.gotoRouteHandle(that.$route,1)
        }
      })
    },
    handleCloseDio(){
      this.dialogSidebarVisible=false
      this.changeMoreList = []
      this.orderList=[]
      this.changeList = []
    },
    handleOpenDio(){
      this.dialogSidebarVisible=true
      this.changeMoreList = [...this.moreMenu]
      this.changeList = [...this.currentMenu]
    },
    //获取推荐列表
    getHotMenuList(){
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
        let tmpMenuList=res.list
        tmpMenuList= tmpMenuList.map(item=>{
          if(item.channelName=='推荐'){
            item.url='/index'
          }else{
            let tmpUrl = item.url
            item.url = tmpUrl+'?channelId='+item.channelId
          }
           return item
        })
        that.moreMenu = tmpMenuList
      })
    },
    //更新菜单
    saveMenuList(){
      let that = this
      if(this.orderList.length > 0){
          getCommHttpData({
            url: '/iConductor-knowledge-platform/channel/changeOrder',
            method: 'post',
            contentType: 2,
            data: {
               list:this.orderList,
             },
          }, function(res) {
          })
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
          that.dialogSidebarVisible=false
      })

    },
		gotoRouteHandle(menu,type){
      if(type == 1){
        // let dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
        let newMenu
        this.currentMenu.forEach(item=>{
          if(menu.path == '/index' && menu.path == item.url){
            item.url = '/index?channelId='+item.channelId
            newMenu = item
          }else if(menu.path == '/subscribe' && item.url.indexOf('/subscribe') > -1){
            if(menu.query.login == 1){
                newMenu = item
                newMenu.url = item.url+'&login=1'
            }else{
                newMenu = item
            }

          }else{
            let tempPath = menu.path+'?channelId='+menu.query.channelId
            if(item.url == tempPath){
              newMenu = item
            }
          }
        })
        if(newMenu){
            this.$router.push({ path: newMenu.url })
        }
        this.menuActiveName = newMenu.channelName

      }else{
        if(menu.url == '/index'){
          this.$router.push({ path: menu.url,query:{channelId:menu.channelId} })
        }else if(menu.isOpen == 1){
            const newTab = this.$router.resolve({path: menu.url})
               window.open(newTab.href,'_blank')
        }else{
            this.$router.push({ path: menu.url })
        }
        if(menu.isOpen != 1){
          this.menuActiveName = type ==2 ? '100' : menu.channelName
        }

      }
		}
	}
}
</script>

<style lang="scss" scoped>
.side-bar--wrapper{
    width: 194px;
    height: 600px;
    position: fixed;
    top: 72px;
    border:1px solid rgba(241,241,241,1);
    box-shadow:0px 1px 4px 0px rgba(0, 0, 0, 0.08);
    /deep/ .el-menu{
        border-right: 0;
        text-align: center;
        padding: 20px;
        height: 100%;
    }
    /deep/ .el-menu-item{
        height: 40px;
        line-height: 40px;
        color: #333;
        span{
            font-size: 16px;
        }
    }
    /deep/ .el-menu-item.is-active{
        background-color: #3C85EE;
        border-radius: 4px;
        span{
          color: #FFFFFF;
        }
    }
    .custum-pop{
      padding: 15px;
    }
}
.marg-20{
  /deep/ .el-tag{
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
