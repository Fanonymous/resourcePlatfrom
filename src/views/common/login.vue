<template>
	<div v-loading.fullscreen.lock="loginBgLoading" element-loading-background="rgba(255, 255, 255, 1)">
		<div v-if="!loginBgLoading">
            <div class="login-header">
                <img src="~@/assets/img/logo.png" />
                <!-- <div class="login-header-text">
                    {{systemName}}
                </div> -->
            </div>

            <!--<img src="~@/assets/img/bg.png" width="" height="400px" />-->
            <div :class="loginBg">
                <div class="login-main">
                    <h3 class="login-title">登录</h3>
                    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                        <el-form-item prop="userName">
                            <el-input clearable v-model="dataForm.userName" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input clearable v-model="dataForm.password" type="password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()"  :loading="loginLoading">登录</el-button>
                        </el-form-item>
                        <el-button type="text" @click="goRegister">免费注册</el-button>
                        <el-button type="text" @click="forgetPaw" class="right">忘记密码</el-button>
                    </el-form>
                </div>
            </div>
            <com-footer></com-footer>
        </div>
	</div>
</template>

<script>
import logincss from '@/assets/scss/login.scss'
import ComFooter from './com-footer'
import { getUUID } from '@/utils'
import sha256 from 'js-sha256'
import { clearLoginInfo } from '@/utils'
import { getCommHttpData } from '@/utils/common'
export default {
    data() {
        return {
            systemName:window.SITE_CONFIG.systemName,
            loginBgLoading : true,
            isFirstLogin:'',
            loginBg:'login-cont-bg',
            dataForm: {
                userName: '',
                password: '',
                uuid: '',
                captcha: ''
            },
            loginLoading:false,
            dataRule: {
                userName: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                },{
                  max: 320,
                  message: '用户名不能超过320个字符'
                }],
                password: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }]
                //        captcha: [
                //          { required: true, message: '验证码不能为空', trigger: 'blur' }
                //        ]
            },
            captchaPath: '',
            platformName:''
        }
    },
    components: {
        ComFooter
    },
    created() {
        //班牌1，课堂2，集控3,课题4, 其他0
            this.platformName = this.$t('navbar.systemName')
            this.loginBg='login-cont-bg'

        if(this.$cookie.get('accesstoken') && this.$cookie.get('accesstoken') != '' && this.$route.query.token == undefined ){

            if(this.$cookie.get('userType') == 7){
                this.$router.replace({
                    name: 'userinfo'
                })
            }else{
                this.$router.replace({
                    name: 'index'
                })
            }
        }else{
            clearLoginInfo()
            this.getCaptcha()
            if(this.$route.query.token != undefined){
                this.getCmsUserInfo()
            }else {
                this.loginBgLoading = false
            }
        }
    },
    methods: {
      //获取用户id
        getCmsUserInfo(){
            let that = this;
            getCommHttpData({
                url: '/iConductor-knowledge-platform/getMsgByToken',
                method: 'post',
                contentType: 2,
                data: {
                    token: this.$route.query.token,
                    comeFrom:this.$route.query.comeFrom
                },
            }, function(data) {
              that.$cookie.set('accesstoken', that.$route.query.token)
              let rsUserId = data.rsUserId
              that.$cookie.set('rsUserId', rsUserId)
                getCommHttpData({
                    url: '/iConductor-knowledge-platform/userinfo',
                    method: 'post',
                    contentType: 2,
                    data: {
                        rsUserId: rsUserId
                    },
                },function(res){
                    let userInfo = res.userinfo
                    localStorage.setItem('userinfo', JSON.stringify(userInfo))
                    if(data.isFirstLogin ==1){
                      window.location.href = location.origin+'/subscribe?login=1'
                    }else{
                      window.location.href = location.origin+'/index'
                    }
                    // that.$router.push({
                    //     name: 'index'
                    // })
                })
            })
        },
        // 提交表单
        dataFormSubmit() {
            let passwordData = sha256(this.dataForm.password);
            this.$refs['dataForm'].validate((valid) => {
                if(valid) {
                    this.loginLoading = true
                    this.$http({
                        url: this.$http.adornUrlMedia('/sys/login'),
                        method: 'post',
                        data: this.$http.adornData({
                            'username': this.dataForm.userName,
                            'password': passwordData,
                            appType:1,
                            platformName:this.platformName
                        })
                    }).then(({
                        data
                    }) => {
                        if(data && data.code === 0) {
                            this.loginLoading = true
                            let userInfo = data.userInfo
                            let userType = userInfo.userType
                            this.$cookie.set('accesstoken', data.token)
                            this.$cookie.set('roleId', userInfo.cuRoleid)
                            this.$cookie.set('userType', userType)
                            this.$cookie.set('userId', userInfo.userId)
                            let orgId =  -1
                            let orgName =  -1,deptIds=-1
                            if(userInfo.deptIdList.length > 0 ){
                                orgId = userInfo.deptIdList[0]
                                orgName= userInfo.deptIdName[0].name
                                deptIds= userInfo.deptIdList.toString()
                            }
                            this.$cookie.set('orgId', orgId)
                            localStorage.setItem('orgEntity', JSON.stringify({
                                orgId: orgId,orgName:orgName,deptIds:deptIds
                            }))
                            localStorage.setItem('yearTermData', {})
                            let dynamicMenuRoutes = sessionStorage.getItem('dynamicMenuRoutes')
                            dynamicMenuRoutes = JSON.parse(dynamicMenuRoutes)

                            if(userType == 7){
                                this.$router.replace({
                                    name: 'userinfo'
                                })
                            }else{
                                this.$router.replace({
                                    name: 'index'
                                })
                            }
                        } else {
                            this.loginLoading = false
                            //this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
        // 获取验证码
        getCaptcha() {
            this.dataForm.uuid = getUUID()
            this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
        },
        forgetPaw() {
            this.$message.success({
                showClose: true,
                message: '请联系管理员',
                type: 'success'
            })
        },
        goRegister(){
			this.$message.success({
			    showClose: true,
			    message: '请联系管理员',
			    type: 'success'
			})
            // window.location.href = window.location.origin +'/register'
        },
    }
}
</script>
