$(function() {
        //调用用户数据函数
        getUserInfo()

        //实现点击退出功能
        $("#btnlogout").on('click', function() {
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //退出时清除token并且返回到登陆界面
                localStorage.removeItem('token')
                location.href = '/login.html';
                layer.close(index);
            });
        })
    })
    //创建用户图像渲染函数
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
        // 3.按需渲染用户图像
    if (user.user_pic === null) {
        // 渲染图片图像
        $(".layui-nav-img").attr('src', user_pic).show();
        $(".text-avator").hide();
    } else {
        // 渲染文本图像
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avator").html(first).show();
    }
}
//获取用户数据函数
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败');
            //调用用户图像渲染函数
            renderAvatar(res.data);
        },
        //阻止用户未登录直接访问后台网页complete属性
    })
}