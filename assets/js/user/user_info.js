//入口函数
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    form.verify({
        // 昵称的验证规则
        nickname: [
            /^[\S]{2,6}$/
            , '昵称必须2到6位，且不能出现空格'
        ]
    })
    // 初始化用户的基本信息(信息回填)
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            //请求头等信息已经在baseAPI.js中封装
            success: function (res) {
                // console.log(res.data);
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // 用于给指定表单集合的元素赋值和取值。
                // 如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
                form.val("f1", res.data);
            }
        })
    }
    // 监听重置按钮的点击事件
    $('#btnReset').on('click', function (e) {
        // 1. 阻止重置的默认行为 默认会清空所有
        e.preventDefault()
        // 2. 重新获取用户信息，并渲染表单数据
        initUserInfo();
    })
    // 点击提交按钮修改用户信息 
    $('#form').on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('更新用户失败')
                }
                //return完减少写else
                layer.msg('更新用户信息成功！')
                // 更新 index.html 页面中的欢迎文本
                window.parent.getUserInfo();
            }


        })
    })

})