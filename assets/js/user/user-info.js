$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
        }
    })

    // 初始化用户信息页面
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('初始化失败');
                form.val('initinfo', res.data)
            }
        })
    }
    //调用初始化信息函数
    initUserInfo()
    $(".layui-btn-primary").on('click', function(e) {
            e.preventDefault();
            initUserInfo();
        })
        //监听表单区域提交信息
    $(".layui-form").on('submit', function(e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发起post请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('提交信息失败了!');
                layer.msg('成功提交信息!')
                window.parent.getUserInfo()
            }
        })
    })
})