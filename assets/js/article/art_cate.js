$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initTable()

    // 初始化表格的数据
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('获取表格数据失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //添加类目
    var addIndex = null;
    $('#showAdd').on('click', function () {
        // 弹出一个【页面层 type:1 】
        addIndex = layer.open({
            type: 1, // 页面层
            title: '添加文章分类', // 标题
            //类似模板的做法
            content: $('#tpl-add').html(), // 弹出层的主体
            area: ['500px', '250px'] // 设置层的宽和高
        })
    })

    // 通过代理的方式，为添加的表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败！')
                }
                layer.msg('添加文章分类成功！')
                // 调用 layer.close() 关闭层
                layer.close(addIndex)
                // 刷新表格的数据
                initTable()
            }
        })
    })
    //编辑按钮
    $('table').on('click', '.btnEdit', function () {
        // 弹层
        layer.open({
            type: 1, // 层的类型
            title: '修改文章分类', // 标题
            area: ['500px', '250px'], // 宽高
            content: $('#tpl-edit').html()
        })
        // 获取当前这一行数据的 Id
        var id = $(this).attr('data-id');
        // console.log(id);

        // // 根据 Id 获取文章分类数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // form.val('表单', 数据对象)
                form.val('form-edit', res.data);
            }
        })
    })
    //删除按钮
    // 点击删除按钮
    $('body').on('click', '.btnDelete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);

                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 刷新列表数据
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})
