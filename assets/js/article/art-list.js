$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
            pagenum: 1, // 页码值，默认请求第一页的数据
            pagesize: 2, // 每页显示几条数据，默认每页显示2条
            cate_id: '', // 文章分类的 Id
            state: '' // 文章的发布状态
        }
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // layer.msg('获取文章列表成功！')
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用分页函数
                renderPage(res.total)
            }
        })
    }
    //获取文章分类列表数据
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败');
                // layer.msg('获取文章分类列表成功');
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        })
    }
    //给筛选表单添加submit方法
    $("#form-cate").on('submit', function(e) {
            e.preventDefault();
            var cate_id = $('[name=cate_id]').val();
            var state = $('[name=state]').val();
            q.cate_id = cate_id;
            q.state = state;
            initTable()

        })
        //定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total) {
        //调用render方法实现分页
        laypage.render({
            elem: 'pagebox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7],

            //分页切换发生时,回调jump函数
            jump: function(obj, first) {
                // console.log(obj);
                //把最新的页码值,赋值到q查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit //获取最新的条目数
                    //通过判断first的值,判断通过那种方式回调,如果first=true就是通过  laypage.render,触发,否则就是通过点击页码触发
                if (!first) {
                    initTable()
                }

            }
        })
    }
    $('body').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id');
        var len = $('.btn-del').length //获取页面上有几个删除按钮
        console.log(len);
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'GET',
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除文章失败');
                    layer.msg('删除文章成功');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
    $('body').on('click', '.btn-edit', function() {
        var id = $(this).attr('data-id');
        initEdits()

        function initEdits() {
            $.ajax({
                type: 'GET',
                url: '/my/article/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('获取内容失败');
                    console.log(res.data);
                    location.href = '/article/art-pub.html';
                }
            })
        }
    })

})