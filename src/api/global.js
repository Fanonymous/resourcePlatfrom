import Vue from 'vue'
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
// let orgEntity


export function getUserinfo(){
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
	return userinfo
}
export function getRsUserId(){

  return Vue.cookie.get('rsUserId')
}
// export function getYearTerm(){
// 	orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
// 	return Vue.cookie.get('roleId')
// }
export default {
	getUserinfo,
  getRsUserId
}
