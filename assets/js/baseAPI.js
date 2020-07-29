$.ajaxPrefilter(function(options) {
    //请求ajax接口时拼接url字符串
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // 请求ajax接口时添加headers属性
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    //全局统一挂载complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清除token
            localStorage.removeItem('token');
            // 强制跳转登录页面
            location.href = '/login.html';
        }
    }
})