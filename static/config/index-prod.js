/**
 * 验收环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
window.SITE_CONFIG['baseUrl'] = 'http://119.3.228.197:80/';
  //图片
  window.SITE_CONFIG['imgIP'] = 'http://119.3.228.197:80/iConductor-media/file/common/getFile?fileName=';

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['sysVersion'] = 'V1.1.0.0';   // 版本号(年月日时分)
  window.SITE_CONFIG['version'] = ''; 
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();