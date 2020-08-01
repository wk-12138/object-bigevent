$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //调用函数
    initdata()
        //获取服务器列表
    function initdata() {
        $.ajax({
            type: 'GET',
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！');
                var htmlstr = template('art-mate', res)

                $("tbody").html(htmlstr)
            }
        })
    }
    var index = null;
    $('#btnAddMate').on('click', function() {
            index = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html(),
            });
        })
        //通过代理的形式监听表单区域,因为在点击添加类别时,页面上还没有表单元素
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) return layer.msg('新增文章分类失败!');
                    initdata()
                    layer.msg('新增文章分类成功!')
                    layer.close(index);
                }
            })
        })
        // 通过代理方式给删除按钮添加事件
    $('tbody').on('click', "#art-del", function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {

            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除失败!');
                    initdata()
                    layer.msg('删除成功!');
                    layer.close(index);
                }
            })

        });
    })
    var indexEdit = null;
    //通过代理方式给编辑按钮添加事件
    $('tbody').on('click', '#art-edit', function() {
        var id = $(this).attr('data-id');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章分类数据失败！');
                form.val('form-edit', res.data)
                    // $('#form-edit [name=Id]').val(res.data.name);
                    // $('#form-edit [name=name]').val(res.data.name);
                    // $('#form-edit [name=alias]').val(res.data.alias);
            }
        })
        $('body').on('submit', '#form-edit', function(e) {
            // console.log('ok');
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg('更新分类信息失败！');
                    initdata()
                    layer.close(indexEdit)
                    layer.msg('更新分类信息成功！');
                }
            })
        })
    })
})