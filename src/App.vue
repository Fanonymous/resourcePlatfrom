<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    provide(){
      return{
        reload:this.reload
      }
    },
    data(){
      return{
        RouteState:true
      }
    },
    methods:{
      reload(){
        this.RouteState = false;
        this.$nextTick(()=>{
          this.RouteState = true
        })
      }
    }
  }
</script>
