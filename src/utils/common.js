/**
 * 邮箱
 * @param {*} s
 */
//export function getCommFilterMedia (params) {
//	this.$http({
//    url: this.$http.adornUrl('/multimemediaEquip/commFilter'),
//    method: 'post',
//    data: this.$http.adornData(params),
//  }).then(({data}) => {
//	    return data
//  })
//}
import Vue from 'vue'
import http from '@/utils/httpRequest'
import { Message } from 'element-ui'
import qs from 'qs'

//user/power/change
//权限验证，每次调接口前验证
export function validateAPI(){
	http({
	    url: http.adornUrl('user/power/change'),
	    method: 'get',
	    params: ''
	}).then(({data}) => {
	    if (data && data.code === 0) {
	      	if(data.user != undefined){
				//权限验证刷新页面
				let userInfo = data.user
				Vue.cookie.set('userType', userInfo.userType)
                Vue.cookie.set('userId', userInfo.userId)
                if(userInfo.userInfo.length >0){
                	let orgId = '',orgName='',deptIds=''
                	for(let i in userInfo.userInfo){
                		if(userInfo.userType == userInfo.userInfo[i].userType){
                			orgId = userInfo.userInfo[i].deptIdList[0]
                			orgName = userInfo.userInfo[i].deptNameList[0].name
							deptIds =  userInfo.userInfo[i].deptIdList.toString()
                		}
                	}
                	Vue.cookie.set('orgId', orgId)
                	localStorage.setItem('orgEntity', JSON.stringify({orgId: orgId,orgName:orgName,deptIds:deptIds}))
                }
				window.location.reload();
				return;
			}

	    }
	})
}

export function getCommHttpData (resParam,callbackData) {

	let serverUrl =''
	if(resParam.serverType == 1){
		serverUrl = http.adornUrl(resParam.url)
	}else if(resParam.serverType ==2){
		serverUrl = http.adornAnyUrl(resParam.url)
	}else if (resParam.serverType ==3) {
		serverUrl = http.adornLicenseUrl(resParam.url)
  } else if (resParam.serverType == 4) {
    serverUrl = http.adornOauthUrl(resParam.url)
	}else{
		serverUrl = http.adornUrl(resParam.url)
	}
  // console.log(serverUrl,'serverUrlserverUrl')
	// validateAPI()

	if(resParam.contentType ==1){
		//query string parameters
		http({
	      url: resParam.url,
	      method: resParam.method,
	      params: http.adornParams(resParam.data),
	      paramsSerializer: params => {
		      return qs.stringify(params, { indices: false })
		  }
	    }).then(({data}) => {
	      if (data && data.code === 0) {
	      	if(resParam.operateType ==1){
	      		//删除
      			Message({
			        message: '删除成功',
			        type: 'success',
			        onClose: () => {

			        }

			    })
      			 callbackData(data)
	      	}else if(resParam.operateType ==2){
	      		//删除
      			Message({
			        message: '操作成功',
			        type: 'success',
			        onClose: () => {

			        }

			    })
      			callbackData(data)
	      	}else{
	      		callbackData(data)
	      	}
	      }
	    })
	}else if(resParam.contentType ==2){
		//request paylaod
		http({
	      url: serverUrl,
	      method: resParam.method,
	      data: http.adornData(resParam.data),
	    }).then(({data}) => {
	    	//console.log(resParam)
	    	if (data) {
	    		if(data.code === 0){
		    		if(resParam.operateType ==1){
		      		//删除
		      			Message({
					        message: '删除成功',
					        type: 'success',
					        onClose: () => {

					        }
					    })
		      			callbackData(data)
			      	}else if(resParam.operateType ==2){
		      			Message({
					        message: '操作成功',
					        type: 'success',
					        onClose: () => {

					        }
					    })
		      			callbackData(data)
		      		}else{
			      		callbackData(data)
			      	}
		      	}else{
		      		if(resParam.operateType ==3){
		      			callbackData(data)
		      		}
		      	}

	        }else{
	        	if(resParam.operateType ==2){
	        		if(resParam.that.addLoading != undefined){
	        			resParam.that.addLoading = false
	        		}
	        	}
	        }
	    })
	}else{
		//form
		http({
	      url: serverUrl,
	      method: resParam.method,
	      data: http.adornData(resParam.data,true,'form'),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    }).then(({data}) => {
	    	if (data && data.code === 0) {
	    		if(resParam.operateType ==1){
	      		//删除
	      			Message({
				        message: '删除成功',
				        type: 'success',
				        onClose: () => {

				        }
				    })
	      			callbackData(data)
		      	}else{
		      		callbackData(data)
		      	}
	      	}
	    })
	}

}

export function getAnalysisChartData(chartParams,callbackData) {
    getCommHttpData({url:chartParams.url,method:'get',contentType:1,data:chartParams.data},callbackData)
}
export function deleteData(_this,delJsonData,callbackData) {
	let msg = '您确定删除该条记录吗?'
	let delJson = delJsonData
	let cancelMsg = '已取消删除'
	if(delJson.msg != undefined){
		msg = delJson.msg
		delJson = delJsonData.delJson
		cancelMsg = '已取消操作'
	}
    _this.$confirm(msg, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: ''
    }).then(() => {
    	getCommHttpData (delJson,callbackData)
	    //callbackData();
    }).catch(() => {
      Message({
        type: 'info',
        message: cancelMsg
      });
    });
}

/*
 * 获取日期
 * @param sdate 开始时间
 * @param edate 结束时间
 * */
export function getDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    if(m<10) m ='0'+m;
    if(d<10) d ='0'+d;
    return y+"-"+m+"-"+d;
}

/*
 * 获取日期
 * @param sdate 开始时间
 * @param edate 结束时间
 * */
export function getCommonDictByType(_this,type,respData,callbackData) {
	http({
      url: http.adornUrlMedia('/common/dict/typeChange'),
      method: 'post',
      params: http.adornParams({
      	type:type
      })
    }).then(({data}) => {
      if (data && data.code === 0) {
      	if(type == 'app_type'){
      		for(let i in data.list){
      			data.list[i]['disabled'] = false
      		}
      	}
        _this[respData] = data.list
        if(typeof callbackData == 'function'){
        	callbackData(data)
        }
      }
    })
}
/**
 * 根据数字转换中文汉字
 *
 * */
export function getChineseByNum(number){
	var weekArr = ['一','二','三','四','五','六','日'];
	return weekArr[number-1];
}
/**
 * 时间格式，数字小于10补零
 *
 * */
export function setTimeAddZero(number){
	let temp = number
	if(parseInt(number)<10){
		temp='0'+number
	}
	return temp
}
/**
 * 数组中取最大值，计算interval 值
 *
 * */
export function getIntervalByArr(arr){
	let max=Math.max.apply(Math,arr);
	let interval = parseInt(max/6) == 0 ? max:parseInt(max/6)
	return interval
}
/**
 * 时间格式，数字小于10补零
 *
 * */
export function getTimeMinus(time1,time2){

	let tempArr1 = time1.split(':')
	let tempArr2 = time2.split(':')
	let tempTotal1 = parseInt(tempArr1[0])*60+parseInt(tempArr1[1])
	let tempTotal2 = parseInt(tempArr2[0])*60+parseInt(tempArr2[1])
	return Math.abs(tempTotal2 - tempTotal1)
}
export function compareDate(t1,t2)
{
    var date = new Date();
    var dangqian=date.toLocaleTimeString('chinese',{hour12:false})
    var dq=dangqian.split(":");
    var a = t1.split(":");
    var b = t2.split(":");
    var dqdq=date.setHours(dq[0],dq[1]);
    var aa=date.setHours(a[0],a[1]);
    var bb=date.setHours(b[0],b[1]);
    return aa>bb
}
export function compareNowDate(t1,t2)
{
    var date = new Date();
    var dangqian=date.toLocaleTimeString('chinese',{hour12:false})
    var dq=dangqian.split(":");
    var a = t1.split(":");
    var b = t2.split(":");
    var dqdq=date.setHours(dq[0],dq[1]);
    var aa=date.setHours(a[0],a[1]);
    var bb=date.setHours(b[0],b[1]);
    return dqdq>=aa && dqdq<=bb
}
/*
 * 文件导出
 * @param url 接口
 * @param paramsData 参数
 * */
export function getExportFile(_this,url,paramsData) {
	_this.$confirm('您确定导出文件吗?', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {

		//paramsData['excelType'] = 'xlsx'
//		http({
//	      url: http.adornUrlMedia(url),
//	      method: 'get',
//	      params: http.adornParams(paramsData)
//	    }).then(({data}) => {
//	      if (data && data.code === 0) {
//
//	      }
//	    })
		let getstr='?excelType=xlsx'
		for(var key in paramsData){
			getstr += "&"+key+"="+paramsData[key] ;
		}
		window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+url+getstr));
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消'
      });
    });




}
/*
 * 文件导出
 * @param url 接口
 * @param paramsData 参数
 * */
export function getExportFileDiama(_this,url,paramsData) {
	_this.$confirm('您确定导出文件吗?', '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
		let getstr='?excelType=xlsx'
		for(var key in paramsData){
			getstr += "&"+key+"="+paramsData[key] ;
		}
		window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrl+url+getstr));
    }).catch(() => {
      Message({
        type: 'info',
        message: '已取消'
      });
    });
}
/**
 * 获得当前星期和日期
 *
 * */
export function getNowDate(){
	var nowDate = new Date();
	var numDay = nowDate.getDay();
	numDay = numDay== 0 ? 7:numDay;
	var nowStr = '星期'+getChineseByNum(numDay)+' '+getDateStr(0);
	return nowStr;
}
/**
 * 获得当前的时间
 * 时：分：秒
 * */
export function getNowTime(){
	var nowDate = new Date();
	var numHours = nowDate.getHours();
	var numMinutes = nowDate.getMinutes();
	var numSeconds = nowDate.getSeconds();
	numHours = numHours<10 ?'0'+numHours:numHours;
	numMinutes = numMinutes<10 ?'0'+numMinutes:numMinutes;
	numSeconds = numSeconds<10 ?'0'+numSeconds:numSeconds;
	var nowStr = numHours+':'+numMinutes+':'+numSeconds;
	return nowStr;
}

export function newline(option, number, axis){
    /* 此处注意你的json是数组还是对象 */
    option[axis][0]['axisLabel']={
        interval: 0,
        formatter: function(params){
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = number;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }
            } else {
                newParamsName = params;
            }
            return newParamsName
        }
    }
    return option;
}
/*
 图表resize
 * @param that
 * @param refList array
 *
 * */
export function chartResize(that,refList){
    window.addEventListener('resize', () => {
    	for(let i in refList){
    		if (that.$refs[refList[i]].chart!= undefined && that.$refs[refList[i]].chart) {
	        	that.$refs[refList[i]].chart.resize()
	        }
    	}

    })

}

/*
 根据不同域名展示不同的内容，
 数据权限的不同,班牌1，课堂2，集控3,课题4, 其他0
 * */
export function getDomainType(){
	let domainType = 0
	let domainName = document.domain
	if(domainName.indexOf('banpai') > -1){
		domainType = 1
	}else if(domainName.indexOf('ketang') > -1){
		domainType = 2
	}else if(domainName.indexOf('nazhi') > -1){
		domainType = 3
	}else if(domainName.indexOf('keti') > -1){
		domainType = 4
	}else if(domainName.indexOf('demo') > -1){
		domainType = 5
	}else{
		domainType = 0
	}
    return domainType;
}

// 获取当前周的开始结束时间和结束时间
export function getDayOfWeek () {
    var nowDate = new Date();
	var numDay = nowDate.getDay();
	return {startDate:getDateStr(1-numDay),endDate:getDateStr(7-numDay)}
}

export function getUnitbyNum(numb){
	let num = parseInt(numb)
	let temp = 0
	let unit = ''
	if(num>=10000 && num<100000000){
	    temp=parseFloat(num/10000).toFixed(2)
	    unit = "万"
	}else if(num>=100000000 && num<1000000000000){
	    temp=parseFloat(num/100000000).toFixed(2)
	    unit = "亿"
	}else{
		temp=num
	    unit = ""
	}
	return {num:temp,unit:unit}
}

export function applicationSave(productId){
	let that = this;
	getCommHttpData({
		url: 'sys/sysuseapplication/save',
		method: 'post',
		contentType: 2,
		data: {
			userId: Vue.cookie.get('userId'),
			productId: productId
		},
	}, function(data) {

	})

}


export function getAxios(resParam) {
    let serverUrl =''
	if(resParam.serverType == 1){
		serverUrl = http.adornUrl(resParam.url)
	}else if(resParam.serverType == 2){
		serverUrl = http.adornAnyUrl(resParam.url)
	}else if (resParam.serverType == 3) {
		serverUrl = http.adornLicenseUrl(resParam.url)
	}else{
		serverUrl = http.adornAnyUrl(resParam.url)
	}

    validateAPI()

    return http({
        url: serverUrl,
        method: resParam.method,
        data: http.adornData(resParam.data)
    })
}

//删除字符串空格，前后中间的空格
export function trimAll(str){
	var result;
	if(str !='' && str !=null){
	    result = str.replace(/(^\s+)|(\s+$)/g,"");
	    result = result.replace(/\s/g,"");
	    result = result.replace(/'/g, '“');
		result = result.replace(/"/g, '“');
	}else{
		result = '';
	}
    return result;
}
// 降序排序
export function compareDown (data, propertyName) {
  if ((typeof data[0][propertyName]) !== 'number') { // 属性值为非数字
    return function (object1, object2) {
      var value1 = object1[propertyName]
      var value2 = object2[propertyName]
      return value2.localeCompare(value1)
    }
  }	else {
    return function (object1, object2) { // 属性值为数字
      var value1 = object1[propertyName]
      var value2 = object2[propertyName]
      return value2 - value1
    }
  }
}

export function sum(arr) {
  return eval(arr.join("+"));
};

/**
 * 计算天数差的函数，通用
 * @param sDate1 2006-12-18
 * @param sDate2
 * @returns {Number}天数
 */
export function dateDiff(sDate1,  sDate2){
    var  aDate,  oDate1,  oDate2,  iDays
    aDate  =  sDate1.split("-")
    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式
    aDate  =  sDate2.split("-")
    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
    return  iDays
}
