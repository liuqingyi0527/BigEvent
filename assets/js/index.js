$(function () {
    var layer = layui.layer;
    // 调用这个函数，获取用户的信息
    getUserInfo();
    //退出绑定事件
    $('#btnLogout').on("click", function () {
        layer.confirm('确定退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清 token
            localStorage.removeItem('token')
            // 2. 跳页面
            location.href = '/Day01/code/login.html'
            // layer.close 表示关闭指定的弹出层
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
// 注意：一定要在 jQuery 入口函数之外，定义这个方法
function getUserInfo() {
    // 发起 ajax 请求，获取用户信息
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // 成功的回调
        success: function (res) {
            // console.log(res);

            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 获取用户信息成功
            // 渲染用户的头像和欢迎的文本内容
            // render 渲染的意思
            // Avatar 头像的意思
            renderAvatar(res.data)
        },
        //下面信息在baseAPI.js中进行封装

        // complete: function (res) {
        //     console.log(res);
        //     // 使用 res.responseJSON 获取到服务器的响应内容
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 用户没有登录，就来访问 index 页面
        //         // 1. 清空假 token
        //         localStorage.removeItem('token')
        //         // 2. 强制用户跳转到 登录页面
        //         location.href = '/Day01/code/login.html'

        //     }
        // }
    })
}

//渲染用户头像和欢迎文本  render:渲染
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // console.log(name);
    // 1. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //user.user_pic = null 就false
    // 2. 按需渲染头像
    if (user.user_pic) {
        // 渲染图片的头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本的头像
        $('.layui-nav-img').hide()
        // 获取用户名的第一个字符串
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }

}