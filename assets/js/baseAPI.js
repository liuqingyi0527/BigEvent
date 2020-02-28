//注意：今后每个页面。繁花似发送ajxa请求，都必须先导入这个baseAP.js之后，发起请求
//否者，无法统一为ajax请求拼接url根路径
$.ajaxPrefilter(function (option) {
    // 这里的option就是发送$.ajax的配置对象
    option.url = 'http://www.liulongbin.top:3007' + option.url;
    // 有权限的接口，URL路径中会包含 /my/ 这样的字符串
    if (option.url.indexOf('/my/') != -1) {
        option.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    // 统一为有权限的接口，设置 complete 回调函数
    option.complete = function (res) {
        // 使用 res.responseJSON 获取到服务器的响应内容
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 用户没有登录，就来访问 index 页面
            // 1. 清空假 token
            localStorage.removeItem('token')
            // 2. 强制用户跳转到 登录页面
            location.href = '/Day01/code/login.html'
        }
    }
})