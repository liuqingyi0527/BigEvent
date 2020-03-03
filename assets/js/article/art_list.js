$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 用于分页功能
    var laypage = layui.laypage
    // 定义一个参数对象，将来发请求，获取文章列表的时候，
    // 需要通过 ajax 把这个参数对象，提交到服务器
    var q = {
        pagenum: 1, // 页码值（默认获取第1页数据）
        pagesize: 2, // 每页显示几条数据（默认2条）
        cate_id: '', // 文章的分类（表示要获取哪个分类下的文章）
        state: '' // 文章的状态（表示要获取哪种状态的文章）
    }
    // 定义 art-template 中的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        //格式2012-12-12 12:12:12
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //日期的格式小于10 在前面加0
    function padZero(num) {
        // if (num > 0) {
        //     return num;
        // }
        // return "0" + num;
        return num > 0 ? num : "0" + num;
    }

    initTable();
    initCate();
    // 定义一个获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log("渲染数据");

                var htmlStr = template('tpl-table', res)
                $('.layui-table tbody').html(htmlStr)
                // 把真实的总数据条数，传递给分页插件
                renderPage(res.total)
            }
        })
    }
    // 获取类别
    function initCate() {
        //请求接口获取类别
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (status != 0) {
                    return layer.msg('获取类别错误')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 动态添加的表单元素，通知 layui 重新渲染一下筛选区域的 form 表单
                form.render();//表单全部更新
            }
        })
    }
    //筛选按钮
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 拿到筛选框里面的值
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 重新调取接口传递数据，渲染表格
        initTable();
    });
    //编辑按钮
    $('.layui-table').on('click', '.btn_edit', function () {
        // console.log($(this).attr('data_Id'));
        layer.open({
            type: 1,
            title: '编辑',
            area: ['500px', '250px'], // 宽高
            content: $('#tpl-edit').html()
        });
        // 获取当前这一行数据的 Id
        var id = $(this).attr('data_Id');
        $.ajax({
            type: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //layui提供的渲染方法
                form.val('form-edit', res.data)
                var artType = $(res.data.content).text();
                // console.log(artType);
                $(".artType").val(artType);
            }
        })

    })
    //删除按钮
    $('.layui-table').on('click', '.btn_delete', function () {
        var id = $(this).attr('data_Id');
        console.log(id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);

                    if (res.status != 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initTable();
                }
            })
        })
    })


    //点击确定修改(后续修改，存在服务器传参问题)
    $('body').on('submit', '#form-edit', function () {
        // layer.close('tpl-edit');
        // console.log($(this));
        var fd = new FormData($(this)[0]);
        // console.log(111);
        $.ajax({
            type: "POST",
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
            }
        })
    })

    //分页功能
    // 定义一个渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pager', // 容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 设置每页显示几条数据
            curr: q.pagenum, // 设置让哪个页码值被高亮选中
            // 控制分页中包含哪些功能项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // // 每页条数的选择项
            limits: [2, 3, 5, 10],
            // 只要页码值发生切换，就会触发 jump
            // 注意：首次页面打开渲染的时候，会立即触发一次 jump
            jump: function (obj, first) {
                console.log('页码回调函数')
                // console.log(obj)
                // 1. 获取到最新的页码值
                var newPage = obj.curr
                // 2. 更新参数对象中的页码值
                q.pagenum = newPage

                // 获取最新的条目数，并且设置给 q.pagesize
                q.pagesize = obj.limit

                // 3. 调用 initTable，根据最新的参数，获取表格的数据
                // initTable()
                // 这个 first 是一个布尔值，用来指示是否第一次渲染分页（第二次点击触发时候就是undefined）
                console.log(first)
                // 如果要是第二次就先调jump渲染分页，在渲染数据
                if (first !== true) {
                    console.log('aaaaaaaaaaaaaaa')
                    initTable()
                }
            }
        })
    }
})