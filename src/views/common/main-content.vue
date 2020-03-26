<template>
    <main class="site-content">
        <div class="site-content--wrapper">

              <MainSidebar></MainSidebar>
              <!-- <keep-alive> -->
                  <router-view />
              <!-- </keep-alive> -->
        </div>
    </main>
</template>

<script>
import { isURL } from '@/utils/validate'
import MainSidebar from './main-sidebar'
export default {
    inject: ['refresh'],
    data () {
        return {

        }
    },
    computed: {
      isOpenNewTab: {
        get () { return this.$store.state.common.isOpenNewTab }
      }
    },
    mounted(){
      console.log(this.isOpenNewTab,'jjjjjjjjjjjjjj')
    },
    components: { MainSidebar },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.site-content {
    position: relative;
    padding-top: 60px;
}
.site-content--wrapper{
    width: 1170px;
    margin: 0 auto;
    margin-top: 12px;
}
</style>
