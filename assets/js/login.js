$(function() {
    // 点击注册页面
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击登录
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        // 获取form对象
    var form = layui.form;
    //获取layer对象
    var layer = layui.layer;
    //设置用户输入正则规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //自定义密码规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=pwd]').val();
            if (value != pwd) {
                return '确认密码与输入密码不一致'
            }
        }
    });
    //监听提交数据请求
    $("#form_reg").on('submit', function(e) {
            //阻止默认行为
            e.preventDefault();
            // 发起ajax post请求
            $.ajax({
                type: 'POST',
                url: '/api/reguser',
                data: { username: $("#form_reg [name=uname]").val(), password: $('#form_reg [name=pwd]').val() },
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message, { icon: 5 });
                    layer.msg('注册成功', { icon: 6 });
                    $("#link_login").click()
                }
            })
        })
        //监听登录请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: "/api/login",
            data: { username: $('#form_login [name=uname]').val(), password: $('#form_login [name=pwd]').val() },
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message, { icon: 5 })
                layer.msg(res.message, { icon: 6 })
                    //将登录成功获取的token字符串保存到浏览器本地
                localStorage.setItem('token', res.token);
                //跳转到index页面
                location.href = '/index.html';
            }
        })
    })
})